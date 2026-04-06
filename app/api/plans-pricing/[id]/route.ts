import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { planSchema } from '@/lib/validations'
import Plan from '@/models/Plan'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { id } = await params
    const body = await request.json()
    const validatedData = planSchema.parse(body)

    const plan = await Plan.findByIdAndUpdate(
      id,
      {
        name: validatedData.name,
        price: validatedData.price,
        description: validatedData.description,
        features: validatedData.features,
        cta: validatedData.cta,
        featured: validatedData.featured,
        order: validatedData.order,
      },
      { new: true }
    )

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json(JSON.parse(JSON.stringify(plan)))
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { id } = await params
    const plan = await Plan.findByIdAndDelete(id)

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json({ message: 'Plan deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
