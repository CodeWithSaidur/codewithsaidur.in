import mongoose, { Schema, Document } from 'mongoose'

export interface IProfile extends Document {
  name: string
  bio: string
  avatar?: string
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  email?: string
  whatsapp?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    bio: { type: String, required: true },
    avatar: { type: String, default: null },
    github: { type: String, default: null },
    linkedin: { type: String, default: null },
    twitter: { type: String, default: null },
    website: { type: String, default: null },
    email: { type: String, default: null },
    whatsapp: { type: String, default: null },
    phone: { type: String, default: null }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete (ret as any)._id
        delete (ret as any).__v
        return ret
      }
    }
  }
)

export default mongoose.models.Profile ||
  mongoose.model<IProfile>('Profile', ProfileSchema)
