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
      academic_ai_state: {
        Row: {
          id: string
          paused: boolean
          reason: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          paused?: boolean
          reason?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          paused?: boolean
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      academic_content_reviews: {
        Row: {
          comments: string
          created_at: string
          id: string
          item_id: string
          item_snapshot: Json
          teacher_id: string
          verdict: string
        }
        Insert: {
          comments: string
          created_at?: string
          id?: string
          item_id: string
          item_snapshot?: Json
          teacher_id: string
          verdict: string
        }
        Update: {
          comments?: string
          created_at?: string
          id?: string
          item_id?: string
          item_snapshot?: Json
          teacher_id?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_content_reviews_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "academic_items"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_entitlements: {
        Row: {
          human_credits: number
          pro_until: string | null
          subscription_status: string
          user_id: string
        }
        Insert: {
          human_credits?: number
          pro_until?: string | null
          subscription_status?: string
          user_id: string
        }
        Update: {
          human_credits?: number
          pro_until?: string | null
          subscription_status?: string
          user_id?: string
        }
        Relationships: []
      }
      academic_evaluations: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          due_at: string | null
          error_message: string | null
          essay_id: string
          essay_snapshot: Json
          exam: string
          feedback: Json | null
          id: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          error_message?: string | null
          essay_id: string
          essay_snapshot: Json
          exam: string
          feedback?: Json | null
          id?: string
          status?: string
          type?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          error_message?: string | null
          essay_id?: string
          essay_snapshot?: Json
          exam?: string
          feedback?: Json | null
          id?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_evaluations_essay_id_fkey"
            columns: ["essay_id"]
            isOneToOne: false
            referencedRelation: "essays"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_items: {
        Row: {
          choices: Json
          correct_key: string | null
          created_at: string
          difficulty: number
          exam: string
          explanation: string
          id: string
          kind: string
          metadata: Json
          origin: string
          published: boolean
          source_url: string
          source_year: number | null
          statement: string
          subject: string
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          choices?: Json
          correct_key?: string | null
          created_at?: string
          difficulty?: number
          exam?: string
          explanation?: string
          id?: string
          kind: string
          metadata?: Json
          origin?: string
          published?: boolean
          source_url?: string
          source_year?: number | null
          statement?: string
          subject?: string
          title: string
          topic?: string
          updated_at?: string
        }
        Update: {
          choices?: Json
          correct_key?: string | null
          created_at?: string
          difficulty?: number
          exam?: string
          explanation?: string
          id?: string
          kind?: string
          metadata?: Json
          origin?: string
          published?: boolean
          source_url?: string
          source_year?: number | null
          statement?: string
          subject?: string
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      academic_notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      academic_progress: {
        Row: {
          completed: boolean
          due_at: string | null
          id: string
          item_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          due_at?: string | null
          id?: string
          item_id: string
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          due_at?: string | null
          id?: string
          item_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_progress_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "academic_items"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_requests: {
        Row: {
          created_at: string
          id: string
          kind: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      academic_responses: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          item_id: string
          selected_key: string
          session_id: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct: boolean
          item_id: string
          selected_key: string
          session_id: string
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          item_id?: string
          selected_key?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_responses_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "academic_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_scholarships: {
        Row: {
          created_at: string
          id: string
          month: string
          position: number
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          month: string
          position: number
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          month?: string
          position?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      academic_sessions: {
        Row: {
          completed_at: string | null
          current_index: number
          exam: string
          expires_at: string | null
          id: string
          item_ids: string[]
          mode: string
          score: number | null
          score_by_topic: Json
          started_at: string
          status: string
          target_course: string
          target_university: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_index?: number
          exam: string
          expires_at?: string | null
          id?: string
          item_ids: string[]
          mode: string
          score?: number | null
          score_by_topic?: Json
          started_at?: string
          status?: string
          target_course?: string
          target_university?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_index?: number
          exam?: string
          expires_at?: string | null
          id?: string
          item_ids?: string[]
          mode?: string
          score?: number | null
          score_by_topic?: Json
          started_at?: string
          status?: string
          target_course?: string
          target_university?: string
          user_id?: string
        }
        Relationships: []
      }
      academic_teacher_earnings: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          evaluation_id: string
          id: string
          paid_at: string | null
          status: string
          teacher_amount_minor: number | null
          teacher_id: string
          teacher_share_bps: number
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency?: string
          evaluation_id: string
          id?: string
          paid_at?: string | null
          status?: string
          teacher_amount_minor?: number | null
          teacher_id: string
          teacher_share_bps: number
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          evaluation_id?: string
          id?: string
          paid_at?: string | null
          status?: string
          teacher_amount_minor?: number | null
          teacher_id?: string
          teacher_share_bps?: number
        }
        Relationships: [
          {
            foreignKeyName: "academic_teacher_earnings_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: true
            referencedRelation: "academic_evaluations"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_answers: {
        Row: {
          answered_at: string
          attempt_id: string
          id: string
          is_correct: boolean
          question_id: string
          selected_key: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          attempt_id: string
          id?: string
          is_correct: boolean
          question_id: string
          selected_key: string
          user_id: string
        }
        Update: {
          answered_at?: string
          attempt_id?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_attempts: {
        Row: {
          completed_at: string | null
          id: string
          score: number | null
          score_by_area: Json | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          score?: number | null
          score_by_area?: Json | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          score?: number | null
          score_by_area?: Json | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnostic_questions: {
        Row: {
          area: string
          choices: Json
          correct_key: string
          created_at: string
          difficulty: number
          id: string
          position: number
          statement: string
          subject: string
        }
        Insert: {
          area: string
          choices: Json
          correct_key: string
          created_at?: string
          difficulty?: number
          id?: string
          position?: number
          statement: string
          subject: string
        }
        Update: {
          area?: string
          choices?: Json
          correct_key?: string
          created_at?: string
          difficulty?: number
          id?: string
          position?: number
          statement?: string
          subject?: string
        }
        Relationships: []
      }
      essays: {
        Row: {
          content: string
          created_at: string
          id: string
          status: string
          theme: string
          title: string
          updated_at: string
          user_id: string
          word_count: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          status?: string
          theme: string
          title: string
          updated_at?: string
          user_id: string
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          status?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          notifications_enabled: boolean
          onboarding_completed: boolean
          ranking_opt_in: boolean
          school: string | null
          target_course: string | null
          target_exam: string
          target_exams: string[]
          target_university: string
          target_year: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          notifications_enabled?: boolean
          onboarding_completed?: boolean
          ranking_opt_in?: boolean
          school?: string | null
          target_course?: string | null
          target_exam?: string
          target_exams?: string[]
          target_university?: string
          target_year?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          notifications_enabled?: boolean
          onboarding_completed?: boolean
          ranking_opt_in?: boolean
          school?: string | null
          target_course?: string | null
          target_exam?: string
          target_exams?: string[]
          target_university?: string
          target_year?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      academic_answer_session: {
        Args: {
          p_item: string
          p_key: string
          p_session: string
          p_user: string
        }
        Returns: Json
      }
      academic_award_scholarships: {
        Args: { p_month: string }
        Returns: number
      }
      academic_create_session: {
        Args: {
          p_course: string
          p_exam: string
          p_ids: string[]
          p_mode: string
          p_university: string
          p_user: string
        }
        Returns: string
      }
      academic_reserve_evaluation: {
        Args: {
          p_essay: string
          p_exam: string
          p_type: string
          p_user: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "teacher", "student"],
    },
  },
} as const
