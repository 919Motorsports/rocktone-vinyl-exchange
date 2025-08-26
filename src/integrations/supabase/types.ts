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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      offers: {
        Row: {
          amount: number
          buyer_id: string
          counter_amount: number | null
          counter_message: string | null
          created_at: string
          id: string
          message: string | null
          record_id: string
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          counter_amount?: number | null
          counter_message?: string | null
          created_at?: string
          id?: string
          message?: string | null
          record_id: string
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          counter_amount?: number | null
          counter_message?: string | null
          created_at?: string
          id?: string
          message?: string | null
          record_id?: string
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "vinyl_records"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_fee: number
          buyer_id: string
          created_at: string
          id: string
          notes: string | null
          offer_amount: number
          payment_intent_id: string | null
          payment_session_id: string | null
          record_id: string
          seller_fee: number
          seller_id: string
          shipping_address: Json | null
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          buyer_fee?: number
          buyer_id: string
          created_at?: string
          id?: string
          notes?: string | null
          offer_amount: number
          payment_intent_id?: string | null
          payment_session_id?: string | null
          record_id: string
          seller_fee?: number
          seller_id: string
          shipping_address?: Json | null
          status?: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          buyer_fee?: number
          buyer_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          offer_amount?: number
          payment_intent_id?: string | null
          payment_session_id?: string | null
          record_id?: string
          seller_fee?: number
          seller_id?: string
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          seller_rating: number | null
          total_purchases: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          seller_rating?: number | null
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          seller_rating?: number | null
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          communication_rating: number
          created_at: string
          id: string
          item_accuracy_rating: number
          order_id: string
          overall_rating: number
          review_text: string | null
          reviewee_id: string
          reviewer_id: string
          reviewer_type: string
          shipping_rating: number
          updated_at: string
        }
        Insert: {
          communication_rating: number
          created_at?: string
          id?: string
          item_accuracy_rating: number
          order_id: string
          overall_rating: number
          review_text?: string | null
          reviewee_id: string
          reviewer_id: string
          reviewer_type: string
          shipping_rating: number
          updated_at?: string
        }
        Update: {
          communication_rating?: number
          created_at?: string
          id?: string
          item_accuracy_rating?: number
          order_id?: string
          overall_rating?: number
          review_text?: string | null
          reviewee_id?: string
          reviewer_id?: string
          reviewer_type?: string
          shipping_rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vinyl_records: {
        Row: {
          album_name: string
          artist: string
          condition: string
          created_at: string
          description: string | null
          genre: string | null
          id: string
          images: string[]
          price: number
          release_year: number | null
          seller_id: string
          updated_at: string
        }
        Insert: {
          album_name: string
          artist: string
          condition: string
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          images?: string[]
          price: number
          release_year?: number | null
          seller_id: string
          updated_at?: string
        }
        Update: {
          album_name?: string
          artist?: string
          condition?: string
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          images?: string[]
          price?: number
          release_year?: number | null
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vinyl_records_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_transaction_fees: {
        Args: { offer_amount: number }
        Returns: {
          buyer_fee: number
          seller_fee: number
          total_amount: number
        }[]
      }
      get_user_rating_stats: {
        Args: { user_id: string }
        Returns: {
          communication_avg: number
          item_accuracy_avg: number
          overall_avg: number
          shipping_avg: number
          total_reviews: number
        }[]
      }
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
