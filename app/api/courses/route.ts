import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { courseSchema } from '@/lib/validations'
import Course from '@/models/Course'

export async function GET() {
  try {
    await connectDB()
    const courses = await Course.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(courses)))
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
    const validatedData = courseSchema.parse(body)

    const course = await Course.create({
      name: validatedData.name,
      price: validatedData.price,
      description: validatedData.description,
      features: validatedData.features,
      cta: validatedData.cta,
      featured: validatedData.featured,
      order: validatedData.order,
    })

    return NextResponse.json(JSON.parse(JSON.stringify(course)))
  } catch (error) {
    if (error instanceof Error && (error.name === 'ZodError' || (error as any).name === 'ZodError')) {
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
