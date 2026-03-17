import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  image?: string
  githubUrl?: string
  liveUrl?: string
  techStack: string[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
    githubUrl: { type: String, default: null },
    liveUrl: { type: String, default: null },
    techStack: { type: [String], default: [] },
    featured: { type: Boolean, default: false }
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

export default mongoose.models.Project ||
  mongoose.model<IProject>('Project', ProjectSchema)
