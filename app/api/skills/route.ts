import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { skillSchema } from '@/lib/validations'
import Skill from '@/models/Skill'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(skills)))
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
    const validatedData = skillSchema.parse(body)

    const skill = await Skill.create({
      name: validatedData.name,
      category: validatedData.category,
      level: validatedData.level,
      icon: validatedData.icon || null,
    })

    return NextResponse.json(JSON.parse(JSON.stringify(skill)))
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
