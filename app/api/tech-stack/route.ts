import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'
import { techStackSchema } from '@/lib/validations'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const techStack = await db.techStacks.findSorted({ createdAt: -1 })
    return NextResponse.json(techStack)
  } catch (error) {
    console.error('TechStack GET error:', error)
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

    const body = await request.json()
    const validatedData = techStackSchema.parse(body)

    const tech = await db.techStacks.create({
      name: validatedData.name,
      category: validatedData.category,
      icon: validatedData.icon || null,
    })

    return NextResponse.json(tech)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    console.error('TechStack POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
