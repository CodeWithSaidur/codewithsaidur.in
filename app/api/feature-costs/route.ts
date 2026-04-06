import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { featureCostSchema } from '@/lib/validations'
import FeatureCost from '@/models/FeatureCost'

export async function GET() {
  try {
    await connectDB()
    const costs = await FeatureCost.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(costs)))
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const validatedData = featureCostSchema.parse(body)

    const cost = await FeatureCost.create(validatedData)

    return NextResponse.json(JSON.parse(JSON.stringify(cost)))
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
