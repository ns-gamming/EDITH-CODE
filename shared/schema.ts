import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with enhanced profile
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  username: text("username").unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  websiteUrl: text("website_url"),
  githubUsername: text("github_username"),
  twitterUsername: text("twitter_username"),
  location: text("location"),
  skills: text("skills").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Projects table with community features
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  isPublic: boolean("is_public").default(false),
  tags: text("tags").array(),
  framework: text("framework"),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  forks: integer("forks").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Files table - stores project files
export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  path: text("path").notNull(),
  content: text("content").notNull(),
  language: text("language"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API Keys table - securely stores user API keys
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  service: text("service").notNull(), // 'gemini', 'openai', 'anthropic'
  keyPreview: text("key_preview").notNull(), // Last 4 characters for display
  encryptedKey: text("encrypted_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// System Prompts table - stores custom system prompts
export const systemPrompts = pgTable("system_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Chat Messages table - stores conversation history
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  model: text("model"), // 'gemini-2.5-flash', 'gpt-5', 'claude-sonnet-4'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Uploaded Files table - stores user uploaded files/images
export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // 'image', 'file'
  size: text("size"),
  analysisResult: jsonb("analysis_result"), // AI analysis of image/file
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Likes table - tracks project likes
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comments table - project comments
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Follows table - user follow relationships
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: varchar("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Usage Tracking table - track Gemini API usage per user
export const usageTracking = pgTable("usage_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow().notNull(),
  requestCount: integer("request_count").default(0),
  service: text("service").notNull(), // 'gemini'
  usingOwnKey: boolean("using_own_key").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true, likes: true, views: true, forks: true });
export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true });
export const insertSystemPromptSchema = createInsertSchema(systemPrompts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).omit({ id: true, createdAt: true });
export const insertLikeSchema = createInsertSchema(likes).omit({ id: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFollowSchema = createInsertSchema(follows).omit({ id: true, createdAt: true });
export const insertUsageTrackingSchema = createInsertSchema(usageTracking).omit({ id: true, date: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;

export type InsertSystemPrompt = z.infer<typeof insertSystemPromptSchema>;
export type SystemPrompt = typeof systemPrompts.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;
export type UploadedFile = typeof uploadedFiles.$inferSelect;

export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Like = typeof likes.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect;

export type InsertUsageTracking = z.infer<typeof insertUsageTrackingSchema>;
export type UsageTracking = typeof usageTracking.$inferSelect;

// AI Model types - ONLY GEMINI
export type AIModel = 'gemini-2.0-flash-exp' | 'gemini-1.5-flash' | 'gemini-1.5-pro';
export type AIService = 'gemini';

// Database type for Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: InsertUser;
        Update: Partial<InsertUser>;
      };
      projects: {
        Row: Project;
        Insert: InsertProject;
        Update: Partial<InsertProject>;
      };
      files: {
        Row: File;
        Insert: InsertFile;
        Update: Partial<InsertFile>;
      };
      api_keys: {
        Row: ApiKey;
        Insert: InsertApiKey;
        Update: Partial<InsertApiKey>;
      };
      system_prompts: {
        Row: SystemPrompt;
        Insert: InsertSystemPrompt;
        Update: Partial<InsertSystemPrompt>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: InsertChatMessage;
        Update: Partial<InsertChatMessage>;
      };
      uploaded_files: {
        Row: UploadedFile;
        Insert: InsertUploadedFile;
        Update: Partial<InsertUploadedFile>;
      };
      likes: {
        Row: Like;
        Insert: InsertLike;
        Update: Partial<InsertLike>;
      };
      comments: {
        Row: Comment;
        Insert: InsertComment;
        Update: Partial<InsertComment>;
      };
      follows: {
        Row: Follow;
        Insert: InsertFollow;
        Update: Partial<InsertFollow>;
      };
      usage_tracking: {
        Row: UsageTracking;
        Insert: InsertUsageTracking;
        Update: Partial<InsertUsageTracking>;
      };
    };
  };
};