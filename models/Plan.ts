import mongoose, { Schema, Document } from 'mongoose'

export interface IPlan extends Document {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    cta: { type: String, default: 'Work With Me' }, // 
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
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

export default mongoose.models.Plan ||
  mongoose.model<IPlan>('Plan', PlanSchema)
