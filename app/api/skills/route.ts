import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'
import { skillSchema } from '@/lib/validations'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const skills = await db.skills.findSorted({ createdAt: -1 })
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Skills GET error:', error)
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
    const validatedData = skillSchema.parse(body)

    const skill = await db.skills.create({
      name: validatedData.name,
      category: validatedData.category,
      level: validatedData.level,
      icon: validatedData.icon || null,
    })

    return NextResponse.json(skill)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    console.error('Skills POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
