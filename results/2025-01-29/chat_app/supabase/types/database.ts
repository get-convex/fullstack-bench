export type Channel = {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export type Message = {
  id: number
  channel_id: number
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      channels: {
        Row: Channel
        Insert: Omit<Channel, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Channel, 'id'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Message, 'id'>>
      }
    }
  }
}