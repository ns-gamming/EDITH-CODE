// This file is kept for compatibility but Supabase handles storage directly
// All storage operations are now done through Supabase client in routes.ts

export interface IStorage {
  // Legacy interface - not used with Supabase backend
}

export class MemStorage implements IStorage {
  constructor() {
    console.log("MemStorage initialized but not used - using Supabase for all persistence");
  }
}

export const storage = new MemStorage();
