import Link from 'next/link'
import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import TechStack from '@/models/TechStack'

export const metadata = {
  title: 'Tech Stack & Tools | Portfolio',
  description: 'Technologies and tools I use for development'
}

// Force dynamic rendering to prevent build-time database connection issues
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function TechStackPage() {
  let techStack: any[] = []
  let techByCategory: Record<string, typeof techStack> = {}

  try {
    await connectDB()
    const techStackData = await TechStack.find().sort({ createdAt: -1 }).lean()
    techStack = techStackData.map((t: any) => ({
      ...t,
      id: t._id.toString()
    }))

    techByCategory = techStack.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = []
      }
      acc[tech.category].push(tech)
      return acc
    }, {} as Record<string, typeof techStack>)
  } catch (error: any) {
    // During build, if database connection is skipped, just continue with empty data
    if (error?.skipBuild) {
      console.log('Database connection skipped during build')
    } else {
      console.error('Error fetching tech stack:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Portfolio
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="ghost">Projects</Button>
              </Link>
              <Link href="/skills">
                <Button variant="ghost">Skills</Button>
              </Link>
              <Link href="/tech-stack">
                <Button variant="ghost">Tech Stack</Button>
              </Link>
              <Link href="/admin/login">
                <Button>Admin Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold">Tech Stack & Tools</h1>
        {techStack.length === 0 ? (
          <div className="rounded-lg border bg-white p-12 text-center">
            <p className="text-gray-600">No tech stack items available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(techByCategory).map(([category, categoryTech]) => (
              <div key={category} className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 text-2xl font-semibold">{category}</h2>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {(categoryTech as typeof techStack).map((tech: any) => (
                    <div
                      key={tech.id}
                      className="flex items-center space-x-3 rounded-lg border p-3">
                      {tech.icon && (
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="h-8 w-8"
                        />
                      )}
                      <span className="font-medium">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
