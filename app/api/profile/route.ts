import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import connectDB from '@/lib/mongoose'
import { getAdminFromRequest } from '@/lib/auth'
import { profileSchema } from '@/lib/validations'
import Profile from '@/models/Profile'

export async function GET() {
  try {
    await connectDB()
    const profile = await Profile.findOne()
    if (!profile) return NextResponse.json(null)
    return NextResponse.json(JSON.parse(JSON.stringify(profile)))
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
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
    const validatedData = profileSchema.parse(body)

    // Convert empty strings to null for database
    const cleanData = {
      name: validatedData.name,
      bio: validatedData.bio,
      avatar: validatedData.avatar?.trim() || null,
      github: validatedData.github?.trim() || null,
      linkedin: validatedData.linkedin?.trim() || null,
      twitter: validatedData.twitter?.trim() || null,
      website: validatedData.website?.trim() || null,
      email: validatedData.email?.trim() || null,
      whatsapp: validatedData.whatsapp?.trim() || null,
      phone: validatedData.phone?.trim() || null,
    }

    const existingProfile = await Profile.findOne()

    const profile = existingProfile
      ? await Profile.findByIdAndUpdate(existingProfile._id, cleanData, { new: true })
      : await Profile.create(cleanData)

    revalidatePath('/')
    revalidatePath('/projects')
    
    return NextResponse.json(JSON.parse(JSON.stringify(profile)))
  } catch (error: any) {
    if (error?.name === 'ZodError' || error?.issues) {
      const zodError = error.issues || []
      const errorMessages = zodError.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
      console.error('Validation error:', errorMessages)
      return NextResponse.json(
        { error: 'Invalid input data', details: errorMessages || error.message },
        { status: 400 }
      )
    }
    console.error('Profile save error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
