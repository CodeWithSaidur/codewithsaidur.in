import Link from 'next/link'
import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import Profile from '@/models/Profile'
import Project from '@/models/Project'
import Skill from '@/models/Skill'
import TechStack from '@/models/TechStack'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Phone, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Portfolio | Home',
  description:
    'Full-stack developer portfolio showcasing projects, skills, and experience'
}

// Force dynamic rendering to prevent build-time database connection issues
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

interface ProfileData {
  id: string
  name?: string
  bio?: string
  avatar?: string
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  email?: string
  whatsapp?: string
  phone?: string
}

export default async function HomePage() {
  let profile: ProfileData | null = null
  let projects: any[] = []
  let skills: any[] = []
  let techStack: any[] = []
  let skillsByCategory: Record<string, Array<any>> = {}
  let techByCategory: Record<string, Array<any>> = {}

  try {
    await connectDB()
    const profileData = await Profile.findOne().lean()
    const projectsData = await Project.find().sort({ createdAt: -1 }).lean()
    const skillsData = await Skill.find().sort({ createdAt: -1 }).lean()
    const techStackData = await TechStack.find().sort({ createdAt: -1 }).lean()

    // Convert _id to id for frontend compatibility
    profile =
      profileData && '_id' in profileData
        ? {
            ...(profileData as any),
            id: (profileData._id as any).toString()
          }
        : null
    projects = projectsData.map((p: any) => ({
      ...p,
      id: p._id.toString()
    }))
    skills = skillsData.map((s: any) => ({
      ...s,
      id: s._id.toString()
    }))
    techStack = techStackData.map((t: any) => ({
      ...t,
      id: t._id.toString()
    }))

    // Group skills by category
    skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, Array<any>>)

    // Group tech stack by category
    techByCategory = techStack.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = []
      }
      acc[tech.category].push(tech)
      return acc
    }, {} as Record<string, Array<any>>)
  } catch (error: any) {
    // During build, if database connection is skipped, just continue with empty data
    if (error?.skipBuild) {
      console.log('Database connection skipped during build')
    } else {
      console.error('Error fetching data:', error)
    }
    // Continue with empty data - page will still render with fallback content
  }

  return (
    <div className="min-h-screen">
      <main>
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              {profile?.avatar &&
                typeof profile.avatar === 'string' &&
                profile.avatar.trim() !== '' && (
                  <div className="mb-6 sm:mb-8">
                    <Image
                      src={profile.avatar}
                      alt={profile.name || 'Profile avatar'}
                      width={120}
                      height={120}
                      className="rounded-full sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
                    />
                  </div>
                )}
              <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">
                {profile?.name || 'Full-Stack Developer'}
              </h1>
              <p className="mb-6 max-w-2xl text-base text-gray-600 sm:mb-8 sm:text-lg md:text-xl">
                {profile?.bio ||
                  'Passionate developer building modern web applications'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
                    aria-label="GitHub">
                    <Github className="h-5 w-5" />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
                    aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                )}
                {profile?.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
                    aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                    <span className="hidden sm:inline">Twitter</span>
                  </a>
                )}
                {profile?.whatsapp && (
                  <a
                    href={`https://wa.me/${profile.whatsapp.replace(
                      /[^0-9]/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
                    aria-label="WhatsApp">
                    <MessageCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}
                {profile?.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
                    aria-label="Phone">
                    <Phone className="h-5 w-5" />
                    <span className="hidden sm:inline">Phone</span>
                  </a>
                )}
                {profile?.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
                    aria-label="Website">
                    <span className="hidden sm:inline">Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {skills.length > 0 && (
          <section id="skills" className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl">
                Skills
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {(
                  Object.entries(skillsByCategory) as Array<
                    [string, Array<(typeof skills)[number]>]
                  >
                ).map(([category, categorySkills]) => (
                  <div
                    key={category}
                    className="rounded-lg border bg-white p-4 sm:p-6">
                    <h3 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
                      {category}
                    </h3>
                    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categorySkills.map((skill: any) => (
                        <div key={skill.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium sm:text-base">
                              {skill.name}
                            </span>
                            <span className="text-xs text-gray-600 sm:text-sm">
                              {skill.level}/5
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${(skill.level / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section id="projects" className="bg-gray-50 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl">
                Projects
              </h2>
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg">
                    {project.image &&
                      typeof project.image === 'string' &&
                      project.image.trim() !== '' && (
                        <div className="relative h-40 w-full sm:h-48">
                          <Image
                            src={project.image}
                            alt={project.title || 'Project image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    <div className="p-4 sm:p-6">
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-lg font-semibold sm:text-xl">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="w-fit rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base">
                        {project.description}
                      </p>
                      <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
                        {project.techStack.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded bg-gray-100 px-2 py-1 text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3 sm:gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 transition-colors hover:underline sm:text-sm">
                            GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 transition-colors hover:underline sm:text-sm">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {techStack.length > 0 && (
          <section id="tech-stack" className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl">
                Tech Stack & Tools
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {(
                  Object.entries(techByCategory) as Array<
                    [string, Array<(typeof techStack)[number]>]
                  >
                ).map(([category, categoryTech]) => (
                  <div
                    key={category}
                    className="rounded-lg border bg-white p-4 sm:p-6">
                    <h3 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {categoryTech.map((tech: any) => (
                        <div
                          key={tech.id}
                          className="flex items-center space-x-2 rounded-lg border p-2 sm:space-x-3 sm:p-3">
                          {tech.icon && (
                            <img
                              src={tech.icon}
                              alt={tech.name}
                              className="h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8"
                            />
                          )}
                          <span className="text-sm font-medium sm:text-base">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>


    </div>
  )
}
