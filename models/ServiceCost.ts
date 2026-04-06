import mongoose, { Schema, Document } from 'mongoose'

export interface IServiceCost extends Document {
  name: string
  cost: number
  type: 'fixed' | 'usage'
  order: number
  createdAt: Date
  updatedAt: Date
}

const ServiceCostSchema = new Schema<IServiceCost>(
  {
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    type: { type: String, enum: ['fixed', 'usage'], default: 'fixed', required: true },
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

export default mongoose.models.ServiceCost ||
  mongoose.model<IServiceCost>('ServiceCost', ServiceCostSchema)
