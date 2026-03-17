import Link from 'next/link'
import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import Skill from '@/models/Skill'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Skills & Expertise | Portfolio',
  description: 'Technical skills and areas of expertise'
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
    <div className="min-h-screen bg-white">
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-purple-50/50 blur-3xl" />
        
        <h1 className="mb-10 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-900 sm:text-5xl">
          Technical Expertise
        </h1>

        {skills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-gray-500">No skills available yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(categorySkills as any[]).map((skill: any) => (
                    <div key={skill.id} className="group/skill relative flex items-center space-x-4 rounded-xl border border-gray-50 bg-gray-50/30 p-5 transition-all hover:border-purple-100 hover:bg-white hover:shadow-sm">
                      {skill.icon && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100 group-hover/skill:ring-purple-100">
                          <span className="text-2xl">{skill.icon}</span>
                        </div>
                      )}
                      <span className="font-bold text-gray-700 group-hover/skill:text-purple-600">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
