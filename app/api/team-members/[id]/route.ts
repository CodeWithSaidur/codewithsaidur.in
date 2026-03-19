import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { teamMemberSchema } from '@/lib/validations'
import TeamMember from '@/models/TeamMember'

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
    await connectDB()
    const body = await request.json()
    const validatedData = teamMemberSchema.parse(body)

    const updatedMember = await TeamMember.findByIdAndUpdate(id, validatedData, {
      new: true,
    })

    if (!updatedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(JSON.stringify(updatedMember)))
  } catch (error: any) {
    if (error?.name === 'ZodError' || error?.issues) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('TeamMember update error:', error)
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
    await connectDB()
    const deletedMember = await TeamMember.findByIdAndDelete(id)

    if (!deletedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Member deleted successfully' })
  } catch (error) {
    console.error('TeamMember delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
