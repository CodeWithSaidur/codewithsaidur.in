import { NextRequest, NextResponse } from 'next/server'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Get credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL 
    const adminPassword = process.env.ADMIN_PASSWORD

    // Compare email and password directly from .env
    if (
      validatedData.email !== adminEmail ||
      validatedData.password !== adminPassword
    ) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token with admin email (using email as adminId since we're not using DB)
    const token = generateToken({
      adminId: adminEmail,
      email: adminEmail
    })

    const response = NextResponse.json({ success: true })
    setAuthCookie(response, token)

    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
