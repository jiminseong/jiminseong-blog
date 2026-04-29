export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string;
          slug: string;
          user_id: string | null;
          author_name: string | null;
          author_avatar_url: string | null;
          author_role: string | null;
          parent_id: string | null;
          body: string;
          honeypot: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          user_id?: string | null;
          author_name?: string | null;
          author_avatar_url?: string | null;
          author_role?: string | null;
          parent_id?: string | null;
          body: string;
          honeypot?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
