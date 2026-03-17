import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { projectSchema } from '@/lib/validations'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(projects)))
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
    const validatedData = projectSchema.parse(body)

    const project = await Project.create({
      title: validatedData.title,
      description: validatedData.description,
      image: validatedData.image || null,
      githubUrl: validatedData.githubUrl || null,
      liveUrl: validatedData.liveUrl || null,
      techStack: validatedData.techStack,
      featured: validatedData.featured,
    })

    return NextResponse.json(JSON.parse(JSON.stringify(project)))
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
