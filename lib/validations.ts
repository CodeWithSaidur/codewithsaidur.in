import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Helper to validate optional URL fields (allows empty string or valid URL)
const optionalUrl = z.string().refine(
  (val) => {
    if (!val || val.trim() === '') return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  },
  { message: 'Must be a valid URL or empty' }
).default('')

// Helper to validate optional email fields (allows empty string or valid email)
const optionalEmail = z.string().refine(
  (val) => {
    if (!val || val.trim() === '') return true
    return z.string().email().safeParse(val).success
  },
  { message: 'Must be a valid email or empty' }
).default('')

// Helper to validate optional phone/whatsapp (allows empty string or phone number)
const optionalPhone = z.string().refine(
  (val) => {
    if (!val || val.trim() === '') return true
    // Basic phone validation - allows numbers, +, -, spaces, parentheses
    return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(val.trim())
  },
  { message: 'Must be a valid phone number or empty' }
).default('')

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().min(1, 'Bio is required'),
  avatar: optionalUrl,
  github: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  website: optionalUrl,
  email: optionalEmail,
  whatsapp: optionalPhone,
  phone: optionalPhone,
})

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.number().min(1).max(5),
  icon: z.string().optional().or(z.literal('')),
})

export const techStackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().optional().or(z.literal('')),
})

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  techStack: z.array(z.string()),
  featured: z.boolean(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type SkillInput = z.infer<typeof skillSchema>
export type TechStackInput = z.infer<typeof techStackSchema>
export type ProjectInput = z.infer<typeof projectSchema>
