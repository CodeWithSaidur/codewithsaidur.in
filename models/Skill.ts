import mongoose, { Schema, Document } from 'mongoose'

export interface ISkill extends Document {
  name: string
  category: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: null }
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

export default mongoose.models.Skill ||
  mongoose.model<ISkill>('Skill', SkillSchema)
