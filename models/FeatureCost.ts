import mongoose, { Schema, Document } from 'mongoose'

export interface IFeatureCost extends Document {
  name: string
  usdCost: string
  inrCost: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const FeatureCostSchema = new Schema<IFeatureCost>(
  {
    name: { type: String, required: true },
    usdCost: { type: String, required: true },
    inrCost: { type: String, required: true },
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

export default mongoose.models.FeatureCost ||
  mongoose.model<IFeatureCost>('FeatureCost', FeatureCostSchema)
