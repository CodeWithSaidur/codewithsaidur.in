import Link from 'next/link'
import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import Skill from '@/models/Skill'

export const metadata = {
  title: 'Skills | Portfolio',
  description: 'My technical skills and expertise'
}

// Force dynamic rendering to prevent build-time database connection issues
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function SkillsPage() {
  let skills: any[] = []
  let skillsByCategory: Record<string, typeof skills> = {}

  try {
    await connectDB()
    const skillsData = await Skill.find().sort({ createdAt: -1 }).lean()
    skills = skillsData.map((s: any) => ({
      ...s,
      id: s._id.toString()
    }))

    skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, typeof skills>)
  } catch (error: any) {
    // During build, if database connection is skipped, just continue with empty data
    if (error?.skipBuild) {
      console.log('Database connection skipped during build')
    } else {
      console.error('Error fetching skills:', error)
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
        <h1 className="mb-8 text-4xl font-bold">Skills</h1>
        {skills.length === 0 ? (
          <div className="rounded-lg border bg-white p-12 text-center">
            <p className="text-gray-600">No skills available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="rounded-lg border bg-white p-6">
                <h2 className="mb-4 text-2xl font-semibold">{category}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(categorySkills as any[]).map((skill: any) => (
                    <div key={skill.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                      {skill.icon && (
                        <div className="flex h-6 w-6 items-center justify-center">
                          <span className="text-xl">{skill.icon}</span>
                        </div>
                      )}
                      <span className="font-medium">{skill.name}</span>
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
