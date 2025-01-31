export type TodoStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'canceled'

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number
          name: string
          emoji: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      project_members: {
        Row: {
          project_id: number
          user_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['project_members']['Row'], 'created_at'>
        Update: never
      }
      todos: {
        Row: {
          id: number
          project_id: number
          title: string
          description: string | null
          status: TodoStatus
          assignee_id: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['todos']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['todos']['Insert']>
      }
      comments: {
        Row: {
          id: number
          todo_id: number
          author_id: string
          content: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      todo_status: TodoStatus
    }
  }
}