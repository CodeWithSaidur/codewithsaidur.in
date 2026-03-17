import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { techStackSchema } from '@/lib/validations'
import TechStack from '@/models/TechStack'

export async function GET() {
  try {
    await connectDB()
    const techStack = await TechStack.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(techStack)))
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
    const validatedData = techStackSchema.parse(body)

    const tech = await TechStack.create({
      name: validatedData.name,
      category: validatedData.category,
      icon: validatedData.icon || null,
    })

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
