export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anonymous_reports: {
        Row: {
          category: string
          counselor_notes: string | null
          created_at: string
          id: string
          message: string
          school_code: string
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          category?: string
          counselor_notes?: string | null
          created_at?: string
          id?: string
          message: string
          school_code: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          counselor_notes?: string | null
          created_at?: string
          id?: string
          message?: string
          school_code?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      challenge_progress: {
        Row: {
          challenge_id: string
          completed: boolean
          created_at: string
          current_day: number
          id: string
          last_checked_date: string | null
          total_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean
          created_at?: string
          current_day?: number
          id?: string
          last_checked_date?: string | null
          total_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean
          created_at?: string
          current_day?: number
          id?: string
          last_checked_date?: string | null
          total_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      class_challenges: {
        Row: {
          class_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          title: string
          total_days: number
        }
        Insert: {
          class_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          title: string
          total_days?: number
        }
        Update: {
          class_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title?: string
          total_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_challenges_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_members: {
        Row: {
          class_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          class_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          class_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_members_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_posts: {
        Row: {
          class_id: string
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          mood: string | null
          user_id: string
        }
        Insert: {
          class_id: string
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          mood?: string | null
          user_id: string
        }
        Update: {
          class_id?: string
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          mood?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_posts_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_supports: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_supports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          code: string
          created_at: string
          created_by: string
          id: string
          name: string
          school_code: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          school_code: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          school_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_code_fkey"
            columns: ["school_code"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["code"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          post_id: string
          school_code: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id: string
          school_code?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id?: string
          school_code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_anonymous: boolean
          mood: string | null
          school_code: string | null
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_anonymous?: boolean
          mood?: string | null
          school_code?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_anonymous?: boolean
          mood?: string | null
          school_code?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_supports: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_supports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          is_favorite: boolean
          mood: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      homeroom_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          school_code: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          school_code: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          school_code?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homeroom_codes_school_code_fkey"
            columns: ["school_code"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["code"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reason: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allow_anonymous: boolean
          allow_comments: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_private: boolean
          school_code: string | null
          school_joined_at: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          allow_anonymous?: boolean
          allow_comments?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_private?: boolean
          school_code?: string | null
          school_joined_at?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          allow_anonymous?: boolean
          allow_comments?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_private?: boolean
          school_code?: string | null
          school_joined_at?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_code_fkey"
            columns: ["school_code"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["code"]
          },
        ]
      }
      saved_motivations: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          source: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          source?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      school_check_ins: {
        Row: {
          challenge_day: number
          check_date: string
          created_at: string
          id: string
          school_code: string
          user_id: string
        }
        Insert: {
          challenge_day?: number
          check_date?: string
          created_at?: string
          id?: string
          school_code: string
          user_id: string
        }
        Update: {
          challenge_day?: number
          check_date?: string
          created_at?: string
          id?: string
          school_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_check_ins_school_code_fkey"
            columns: ["school_code"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["code"]
          },
        ]
      }
      schools: {
        Row: {
          approved_at: string | null
          city: string | null
          code: string
          created_at: string
          daily_target: number
          display_name: string
          status: string
          submitted_by: string | null
          submitter_contact: string | null
          submitter_name: string | null
        }
        Insert: {
          approved_at?: string | null
          city?: string | null
          code: string
          created_at?: string
          daily_target?: number
          display_name: string
          status?: string
          submitted_by?: string | null
          submitter_contact?: string | null
          submitter_name?: string | null
        }
        Update: {
          approved_at?: string | null
          city?: string | null
          code?: string
          created_at?: string
          daily_target?: number
          display_name?: string
          status?: string
          submitted_by?: string | null
          submitter_contact?: string | null
          submitter_name?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _gen_class_code: { Args: { _name: string }; Returns: string }
      approve_school: { Args: { _pending_code: string }; Returns: string }
      checkin_challenge: {
        Args: { _challenge_id: string; _total_days?: number }
        Returns: {
          already_done: boolean
          completed: boolean
          current_day: number
        }[]
      }
      create_class: { Args: { _name: string }; Returns: string }
      current_user_class: { Args: never; Returns: string }
      current_user_school: { Args: never; Returns: string }
      generate_homeroom_codes: {
        Args: { _count: number; _school_code: string }
        Returns: string[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_class_homeroom: { Args: { _class_id: string }; Returns: boolean }
      is_class_member: { Args: { _class_id: string }; Returns: boolean }
      join_class: { Args: { _code: string }; Returns: string }
      join_school: {
        Args: { _code: string; _display_name?: string }
        Returns: string
      }
      leave_class: { Args: never; Returns: undefined }
      mark_all_notifications_read: { Args: never; Returns: undefined }
      reject_school: { Args: { _pending_code: string }; Returns: undefined }
      reset_class_code: { Args: { _class_id: string }; Returns: string }
      submit_anonymous_report: {
        Args: { _category: string; _message: string; _severity: string }
        Returns: string
      }
      submit_school: {
        Args: {
          _city: string
          _contact?: string
          _name: string
          _submitter_name?: string
        }
        Returns: string
      }
      verify_homeroom_code: { Args: { _code: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "counselor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "counselor"],
    },
  },
} as const
