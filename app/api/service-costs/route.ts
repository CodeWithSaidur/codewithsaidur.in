import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { serviceCostSchema } from '@/lib/validations'
import ServiceCost from '@/models/ServiceCost'

export async function GET() {
  try {
    await connectDB()
    const costs = await ServiceCost.find().sort({ order: 1, createdAt: -1 })
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
    const validatedData = serviceCostSchema.parse(body)

    const cost = await ServiceCost.create(validatedData)

    revalidatePath('/')
    revalidatePath('/projects')

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
