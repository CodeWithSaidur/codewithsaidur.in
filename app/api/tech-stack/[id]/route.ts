import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'
import { techStackSchema } from '@/lib/validations'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = techStackSchema.parse(body)

    const tech = await db.techStacks.findByIdAndUpdate(
      id,
      {
        name: validatedData.name,
        category: validatedData.category,
        icon: validatedData.icon || null,
      }
    )

    if (!tech) {
      return NextResponse.json({ error: 'Tech stack item not found' }, { status: 404 })
    }

    return NextResponse.json(tech)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    console.error('TechStack PUT error:', error)
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

    const { id } = await params
    await db.techStacks.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('TechStack DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
