import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { teamMemberSchema } from '@/lib/validations'
import TeamMember from '@/models/TeamMember'

export async function GET() {
  try {
    await connectDB()
    const members = await TeamMember.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(members)))
  } catch (error) {
    console.error('TeamMembers GET error:', error)
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
    const validatedData = teamMemberSchema.parse(body)

    const member = await TeamMember.create(validatedData)
    return NextResponse.json(JSON.parse(JSON.stringify(member)))
  } catch (error: any) {
    if (error?.name === 'ZodError' || error?.issues) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('TeamMember create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
