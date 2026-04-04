import { NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'

const resolveAny = promisify(dns.resolveAny)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
  }

  // Simple validation to ensure we have a valid-looking domain
  if (!domain.includes('.') || domain.split('.').some(part => part.length === 0)) {
    return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
  }

  try {
    // 1. RDAP check (Most official way to check registration)
    // We set a timeout to keep the response fast
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    try {
      const rdapResponse = await fetch(`https://rdap.org/domain/${domain}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      })
      clearTimeout(timeoutId)
      
      // RDAP 200 means registered. 404 usually means available or not found in RDAP yet.
      if (rdapResponse.status === 200) {
        return NextResponse.json({ available: false, domain })
      }
    } catch (err) {
      console.warn('RDAP check failed, falling back to DNS:', err)
    }

    // 2. DNS check as fallback (if any record exists, it's taken)
    try {
      await resolveAny(domain)
      return NextResponse.json({ available: false, domain })
    } catch (dnsErr: any) {
      // ENOTFOUND/ENODATA usually means it doesn't have records yet, possible availability
      if (dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'ENODATA') {
        return NextResponse.json({ available: true, domain })
      }
      // If we have some other error (like timeout), we can't be sure
      console.error('DNS check failed:', dnsErr)
    }

    // Default to available if we reach here and check results were negative
    return NextResponse.json({ available: true, domain })

  } catch (error) {
    console.error('Domain check unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error while checking' }, { status: 500 })
  }
}
