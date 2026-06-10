export type Category = 'brand' | 'events' | 'print'

export interface Project {
  id: string
  title: string
  slug: string
  category: Category
  description: string | null
  cover_image: string | null
  images: string[]
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface AboutContent {
  id: string
  bio: string | null
  headline: string | null
  subheadline: string | null
  profile_image: string | null
  tools: string[]
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

export type Settings = Record<string, string | null>
