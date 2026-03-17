import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { techStackSchema } from '@/lib/validations'
import TechStack from '@/models/TechStack'

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
    const validatedData = techStackSchema.parse(body)

    const tech = await TechStack.findByIdAndUpdate(
      id,
      {
        name: validatedData.name,
        category: validatedData.category,
        icon: validatedData.icon || null,
      },
      { new: true }
    )

    if (!tech) {
      return NextResponse.json({ error: 'Tech stack item not found' }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(JSON.stringify(tech)))
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
    await TechStack.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
