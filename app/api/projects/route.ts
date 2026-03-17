import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'
import { projectSchema } from '@/lib/validations'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const projects = await db.projects.findSorted({ createdAt: -1 })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects GET error:', error)
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
    const validatedData = projectSchema.parse(body)

    const project = await db.projects.create({
      title: validatedData.title,
      description: validatedData.description,
      image: validatedData.image || null,
      githubUrl: validatedData.githubUrl || null,
      liveUrl: validatedData.liveUrl || null,
      techStack: validatedData.techStack,
      featured: validatedData.featured,
    })

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    console.error('Projects POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
