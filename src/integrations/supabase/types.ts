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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          message: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          challenge: string | null
          created_at: string
          date: string
          energy: number
          gratitude: string
          id: string
          mood: string
          user_id: string
          voice_note_url: string | null
        }
        Insert: {
          challenge?: string | null
          created_at?: string
          date?: string
          energy: number
          gratitude: string
          id?: string
          mood: string
          user_id: string
          voice_note_url?: string | null
        }
        Update: {
          challenge?: string | null
          created_at?: string
          date?: string
          energy?: number
          gratitude?: string
          id?: string
          mood?: string
          user_id?: string
          voice_note_url?: string | null
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          habit_id: string
          id: string
          notes: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          habit_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string | null
          created_at: string
          difficulty: string | null
          frequency: string
          icon: string | null
          id: string
          is_template: boolean | null
          linked_path_id: string | null
          linked_vision_id: string | null
          longest_streak: number
          name: string
          pause_reason: string | null
          paused: boolean | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          streak: number
          time_of_day: string
          tracking_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          difficulty?: string | null
          frequency?: string
          icon?: string | null
          id?: string
          is_template?: boolean | null
          linked_path_id?: string | null
          linked_vision_id?: string | null
          longest_streak?: number
          name: string
          pause_reason?: string | null
          paused?: boolean | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          streak?: number
          time_of_day?: string
          tracking_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          difficulty?: string | null
          frequency?: string
          icon?: string | null
          id?: string
          is_template?: boolean | null
          linked_path_id?: string | null
          linked_vision_id?: string | null
          longest_streak?: number
          name?: string
          pause_reason?: string | null
          paused?: boolean | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          streak?: number
          time_of_day?: string
          tracking_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_linked_path_id_fkey"
            columns: ["linked_path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habits_linked_vision_id_fkey"
            columns: ["linked_vision_id"]
            isOneToOne: false
            referencedRelation: "visions"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          created_at: string
          description: string
          dismissed: boolean
          id: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          dismissed?: boolean
          id?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          dismissed?: boolean
          id?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          key_takeaways: string[] | null
          read_time: number | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          key_takeaways?: string[] | null
          read_time?: number | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          key_takeaways?: string[] | null
          read_time?: number | null
          title?: string
        }
        Relationships: []
      }
      paths: {
        Row: {
          completed_at: string | null
          created_at: string
          deadline: string | null
          depends_on_path_id: string | null
          description: string | null
          id: string
          name: string
          order_index: number | null
          status: string | null
          vision_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          depends_on_path_id?: string | null
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
          status?: string | null
          vision_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          depends_on_path_id?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
          status?: string | null
          vision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paths_depends_on_path_id_fkey"
            columns: ["depends_on_path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paths_vision_id_fkey"
            columns: ["vision_id"]
            isOneToOne: false
            referencedRelation: "visions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          consumed: boolean | null
          created_at: string | null
          id: string
          notes: string | null
          title: string
          type: string | null
          url: string | null
          user_id: string
          vision_id: string | null
        }
        Insert: {
          consumed?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          title: string
          type?: string | null
          url?: string | null
          user_id: string
          vision_id?: string | null
        }
        Update: {
          consumed?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          title?: string
          type?: string | null
          url?: string | null
          user_id?: string
          vision_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_vision_id_fkey"
            columns: ["vision_id"]
            isOneToOne: false
            referencedRelation: "visions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lessons: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lessons_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      visions: {
        Row: {
          archived: boolean | null
          category: string
          color: string | null
          created_at: string
          description: string | null
          health_score: number | null
          icon: string | null
          id: string
          image_url: string | null
          timeline: string | null
          title: string
          updated_at: string
          user_id: string
          why_it_matters: string | null
        }
        Insert: {
          archived?: boolean | null
          category: string
          color?: string | null
          created_at?: string
          description?: string | null
          health_score?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          timeline?: string | null
          title: string
          updated_at?: string
          user_id: string
          why_it_matters?: string | null
        }
        Update: {
          archived?: boolean | null
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          health_score?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          timeline?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          why_it_matters?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
