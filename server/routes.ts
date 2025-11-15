import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { supabase } from "./lib/supabase";
import { generateCode, analyzeImage } from "./lib/gemini";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "edith-secure-key-32-chars-long!";
const ALGORITHM = "aes-256-cbc";

// Helper: Encrypt API key
function encryptKey(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Helper: Decrypt API key
function decryptKey(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift()!, "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Free tier limits
const FREE_TIER_DAILY_LIMIT = 50;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ===== AUTH ROUTES =====
  
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, fullName, username, bio, occupation, experienceLevel } = req.body;

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          id: authData.user!.id,
          email,
          full_name: fullName,
          username,
          bio,
          occupation,
          experience_level: experienceLevel,
        })
        .select()
        .single();

      if (userError) throw userError;

      res.json(userData);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/signin", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Get user profile
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      res.json(userData || { id: authData.user.id, email: authData.user.email });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/signout", async (req: Request, res: Response) => {
    try {
      await supabase.auth.signOut();
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      res.json(userData || { id: user.id, email: user.email });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  // ===== USER PROFILE ROUTES =====
  
  app.get("/api/users/:userId", async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.params.userId)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/users/:userId", async (req: Request, res: Response) => {
    try {
      const { fullName, username, bio, occupation, experienceLevel, avatarUrl, logoUrl } = req.body;

      const { data, error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          username,
          bio,
          occupation,
          experience_level: experienceLevel,
          avatar_url: avatarUrl,
          logo_url: logoUrl,
        })
        .eq("id", req.params.userId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== PROJECT ROUTES =====
  
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const { userId, name, description } = req.body;

      const { data, error } = await supabase
        .from("projects")
        .insert({ user_id: userId, name, description })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/projects/:projectId", async (req: Request, res: Response) => {
    try {
      const { name, description, thumbnail } = req.body;

      const { data, error } = await supabase
        .from("projects")
        .update({ name, description, thumbnail, updated_at: new Date().toISOString() })
        .eq("id", req.params.projectId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/projects/:projectId", async (req: Request, res: Response) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", req.params.projectId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== FILE ROUTES =====
  
  app.get("/api/files", async (req: Request, res: Response) => {
    try {
      const projectId = req.query.projectId as string;
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", projectId)
        .order("path");

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/files", async (req: Request, res: Response) => {
    try {
      const { projectId, name, path, content, language } = req.body;

      const { data, error } = await supabase
        .from("files")
        .insert({ project_id: projectId, name, path, content, language })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/files/:fileId", async (req: Request, res: Response) => {
    try {
      const { content, name, path } = req.body;

      const { data, error } = await supabase
        .from("files")
        .update({ content, name, path, updated_at: new Date().toISOString() })
        .eq("id", req.params.fileId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/files/:fileId", async (req: Request, res: Response) => {
    try {
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", req.params.fileId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== AI CHAT ROUTES =====
  
  app.post("/api/ai/chat", async (req: Request, res: Response) => {
    try {
      const { userId, projectId, message, model, systemPromptId } = req.body;

      // Check usage limits
      const today = new Date().toISOString().split("T")[0];
      let { data: usage } = await supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      const requestCount = usage?.request_count || 0;

      if (requestCount >= FREE_TIER_DAILY_LIMIT) {
        // Check if user has their own API key
        const { data: apiKey } = await supabase
          .from("api_keys")
          .select("*")
          .eq("user_id", userId)
          .eq("service", "gemini")
          .single();

        if (!apiKey) {
          return res.status(429).json({
            message: "Daily free tier limit reached. Please add your own Gemini API key to continue.",
            limitReached: true,
          });
        }
      }

      // Get system prompt if provided
      let systemPrompt;
      if (systemPromptId) {
        const { data } = await supabase
          .from("system_prompts")
          .select("content")
          .eq("id", systemPromptId)
          .single();
        systemPrompt = data?.content;
      }

      // Get user's API key if they have one
      let userApiKey;
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("encrypted_key")
        .eq("user_id", userId)
        .eq("service", "gemini")
        .single();

      if (apiKeyData) {
        userApiKey = decryptKey(apiKeyData.encrypted_key);
      }

      // Generate AI response
      const aiResponse = await generateCode(message, systemPrompt, userApiKey);

      // Save user message
      await supabase.from("chat_messages").insert({
        project_id: projectId,
        role: "user",
        content: message,
      });

      // Save AI response
      await supabase.from("chat_messages").insert({
        project_id: projectId,
        role: "assistant",
        content: aiResponse,
        model,
      });

      // Update usage tracking
      if (!usage) {
        await supabase.from("usage_tracking").insert({
          user_id: userId,
          date: today,
          request_count: 1,
          token_count: message.length + aiResponse.length,
        });
      } else {
        await supabase
          .from("usage_tracking")
          .update({
            request_count: requestCount + 1,
            token_count: usage.token_count + message.length + aiResponse.length,
          })
          .eq("id", usage.id);
      }

      res.json({ response: aiResponse });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ai/messages", async (req: Request, res: Response) => {
    try {
      const projectId = req.query.projectId as string;
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at");

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== API KEY ROUTES =====
  
  app.post("/api/api-keys", async (req: Request, res: Response) => {
    try {
      const { userId, service, key } = req.body;

      const encryptedKey = encryptKey(key);
      const keyPreview = "..." + key.slice(-4);

      const { data, error } = await supabase
        .from("api_keys")
        .upsert({
          user_id: userId,
          service,
          key_preview: keyPreview,
          encrypted_key: encryptedKey,
        })
        .select()
        .single();

      if (error) throw error;
      res.json({ ...data, encrypted_key: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/api-keys", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const { data, error } = await supabase
        .from("api_keys")
        .select("id, user_id, service, key_preview, created_at")
        .eq("user_id", userId);

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/api-keys/:keyId", async (req: Request, res: Response) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", req.params.keyId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== SYSTEM PROMPT ROUTES =====
  
  app.get("/api/system-prompts", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const { data, error } = await supabase
        .from("system_prompts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/system-prompts", async (req: Request, res: Response) => {
    try {
      const { userId, name, content, isDefault } = req.body;

      const { data, error } = await supabase
        .from("system_prompts")
        .insert({ user_id: userId, name, content, is_default: isDefault })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== USAGE TRACKING ROUTES =====
  
  app.get("/api/usage", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const today = new Date().toISOString().split("T")[0];
      
      const { data } = await supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      const requestCount = data?.request_count || 0;
      const remaining = Math.max(0, FREE_TIER_DAILY_LIMIT - requestCount);

      res.json({
        requestCount,
        limit: FREE_TIER_DAILY_LIMIT,
        remaining,
        limitReached: requestCount >= FREE_TIER_DAILY_LIMIT,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== AI CODE GENERATION ROUTE =====
  
  app.post("/api/ai/generate", async (req: Request, res: Response) => {
    try {
      const { userId, prompt, systemPrompt, projectId } = req.body;

      // Check usage limits
      const today = new Date().toISOString().split("T")[0];
      const { data: usageData } = await supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      const requestCount = usageData?.request_count || 0;
      
      // Get user's API key
      let userApiKey;
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("encrypted_key")
        .eq("user_id", userId)
        .eq("service", "gemini")
        .single();

      if (apiKeyData) {
        userApiKey = decryptKey(apiKeyData.encrypted_key);
      }

      // If no user API key and free limit reached, throw error
      if (!userApiKey && requestCount >= FREE_TIER_DAILY_LIMIT) {
        return res.status(403).json({ 
          message: "Free tier limit reached. Please add your own API key to continue.",
          limitReached: true 
        });
      }

      // Get project context
      let projectContext;
      if (projectId) {
        const { data: filesData } = await supabase
          .from("files")
          .select("name, path, language")
          .eq("project_id", projectId);
        
        projectContext = { files: filesData };
      }

      const code = await generateCode(prompt, systemPrompt, userApiKey, projectContext);

      // Update usage tracking if using free tier
      if (!userApiKey) {
        await supabase
          .from("usage_tracking")
          .upsert({
            user_id: userId,
            date: today,
            request_count: requestCount + 1,
          });
      }

      // Save message to chat history
      await supabase.from("chat_messages").insert([
        { project_id: projectId, role: "user", content: prompt, model: "gemini-2.0-flash-exp" },
        { project_id: projectId, role: "assistant", content: code, model: "gemini-2.0-flash-exp" },
      ]);

      res.json({ code, remaining: userApiKey ? null : Math.max(0, FREE_TIER_DAILY_LIMIT - requestCount - 1) });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===== IMAGE ANALYSIS ROUTE =====
  
  app.post("/api/ai/analyze-image", async (req: Request, res: Response) => {
    try {
      const { userId, base64Image, prompt } = req.body;

      // Get user's API key if they have one
      let userApiKey;
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("encrypted_key")
        .eq("user_id", userId)
        .eq("service", "gemini")
        .single();

      if (apiKeyData) {
        userApiKey = decryptKey(apiKeyData.encrypted_key);
      }

      const analysis = await analyzeImage(base64Image, prompt, userApiKey);

      res.json({ analysis });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
