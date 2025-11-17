
-- ═══════════════════════════════════════════════════════════════
-- VIBECODER / EDITH - Complete Database Schema with RLS
-- Created by NS GAMMING / Nishant Sarkar
-- ═══════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════
-- USERS TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  occupation TEXT,
  experience_level TEXT,
  favorite_languages TEXT[],
  project_goals TEXT,
  github_username TEXT,
  github_access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════════
-- PROJECTS TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[],
  framework TEXT,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view public projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

CREATE POLICY "Users can view their own projects" 
  ON projects FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" 
  ON projects FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can create projects" 
  ON projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- FILES TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS files CASCADE;

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT DEFAULT '',
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view files in their projects" ON files;
DROP POLICY IF EXISTS "Users can view files in public projects" ON files;
DROP POLICY IF EXISTS "Users can create files in their projects" ON files;
DROP POLICY IF EXISTS "Users can update files in their projects" ON files;
DROP POLICY IF EXISTS "Users can delete files in their projects" ON files;

CREATE POLICY "Users can view files in their projects" 
  ON files FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view files in public projects" 
  ON files FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = files.project_id
      AND projects.is_public = true
    )
  );

CREATE POLICY "Users can create files in their projects" 
  ON files FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update files in their projects" 
  ON files FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files in their projects" 
  ON files FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = files.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- CHAT MESSAGES TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS chat_messages CASCADE;

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their project messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete their messages" ON chat_messages;

CREATE POLICY "Users can view their project messages" 
  ON chat_messages FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" 
  ON chat_messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their messages" 
  ON chat_messages FOR DELETE 
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- SYSTEM PROMPTS TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS system_prompts CASCADE;

CREATE TABLE system_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE system_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own prompts" ON system_prompts;

CREATE POLICY "Users can manage their own prompts" 
  ON system_prompts FOR ALL 
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- API KEYS TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS api_keys CASCADE;

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL CHECK (service IN ('openai', 'anthropic', 'gemini')),
  key_preview TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service)
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own API keys" ON api_keys;

CREATE POLICY "Users can manage their own API keys" 
  ON api_keys FOR ALL 
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- USAGE LOGS TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS usage_logs CASCADE;

CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  request_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their usage" ON usage_logs;
DROP POLICY IF EXISTS "System can insert usage" ON usage_logs;

CREATE POLICY "Users can view their usage" 
  ON usage_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage" 
  ON usage_logs FOR INSERT 
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- DAILY USAGE TABLE
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS daily_usage CASCADE;

CREATE TABLE daily_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their daily usage" ON daily_usage;
DROP POLICY IF EXISTS "System can manage daily usage" ON daily_usage;

CREATE POLICY "Users can view their daily usage" 
  ON daily_usage FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage daily usage" 
  ON daily_usage FOR ALL 
  USING (true);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS on_user_updated ON users;
DROP TRIGGER IF EXISTS on_project_updated ON projects;
DROP TRIGGER IF EXISTS on_file_updated ON files;
DROP TRIGGER IF EXISTS on_system_prompt_updated ON system_prompts;
DROP TRIGGER IF EXISTS on_api_key_updated ON api_keys;

CREATE TRIGGER on_user_updated
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_project_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_file_updated
  BEFORE UPDATE ON files
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_system_prompt_updated
  BEFORE UPDATE ON system_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_api_key_updated
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_system_prompts_user_id ON system_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, date);

-- ═══════════════════════════════════════════════════════════════
-- SCHEMA COMPLETE ✓
-- ═══════════════════════════════════════════════════════════════
