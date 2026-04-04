import Link from 'next/link'
import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import Profile from '@/models/Profile'
import Project from '@/models/Project'
import Skill from '@/models/Skill'
import TechStack from '@/models/TechStack'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Phone, MessageCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import PricingSection from '@/components/PricingSection'
import CoursesSection from '@/components/CoursesSection'
import DevelopmentTeamPricing from '@/components/DevelopmentTeamPricing'
import ThirdPartyServiceCosts from '@/components/ThirdPartyServiceCosts'
import FAQSection from '@/components/FAQSection'
import Pricing from '@/models/Pricing'

export const metadata = {
  title: 'Portfolio | Home',
  description:
    'Full-stack developer portfolio showcasing projects, skills, and experience'
}

// Optimize for performance with Incremental Static Regeneration (ISR)
export const revalidate = 3600 // Revalidate every hour
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
  let plans: any[] = []

  try {
    await connectDB()
    const profileData = await Profile.findOne().lean()
    const projectsData = await Project.find().sort({ createdAt: -1 }).lean()
    const skillsData = await Skill.find().sort({ createdAt: -1 }).lean()
    const techStackData = await TechStack.find().sort({ createdAt: -1 }).lean()
    const pricingData = await Pricing.find().sort({ order: 1, createdAt: -1 }).lean()
    plans = JSON.parse(JSON.stringify(pricingData)).map((p: any) => ({
      ...p,
      id: p._id
    }))

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
        <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-20 lg:py-28">
          {/* Background Gradient Decorations */}
          <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/40 blur-3xl animate-blob" />
          <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-gradient-to-tl from-purple-200/40 to-pink-200/40 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-[20%] right-[10%] h-[40%] w-[40%] rounded-full bg-gradient-to-tr from-yellow-100/30 to-orange-100/30 blur-3xl animate-blob animation-delay-4000" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              {profile?.avatar &&
                typeof profile.avatar === 'string' &&
                profile.avatar.trim() !== '' && (
                  <div className="relative mb-6 sm:mb-8">
                    {/* Glow effect behind avatar */}
                    <Image
                      src={profile.avatar}
                      alt={profile.name || 'Profile avatar'}
                      width={120}
                      height={120}
                      className="relative rounded-full border-4 border-white shadow-xl w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                    />
                  </div>
                )}
              <h1 className="mb-4 text-gray-900 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-tight px-2">
                {profile?.name || 'Full-Stack Developer'}
              </h1>
              <p className="mb-8 max-w-xl text-base text-gray-600 sm:text-lg md:text-xl font-medium px-4 leading-relaxed">
                {profile?.bio ||
                  'Passionate developer building modern web applications'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-2 text-sm text-gray-600 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md sm:text-base"
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
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-2 text-sm text-gray-600 transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-md sm:text-base"
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
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-2 text-sm text-gray-600 transition-all hover:border-sky-400 hover:text-sky-500 hover:shadow-md sm:text-base"
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
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-2 text-sm text-gray-600 transition-all hover:border-green-500 hover:text-green-600 hover:shadow-md sm:text-base"
                    aria-label="WhatsApp">
                    <MessageCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}
                {profile?.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-2 text-sm text-gray-600 transition-all hover:border-gray-900 hover:text-gray-900 hover:shadow-md sm:text-base"
                    aria-label="Phone">
                    <Phone className="h-5 w-5" />
                    <span className="hidden sm:inline">Phone</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
        <PricingSection 
          initialPlans={plans} 
          whatsappNumber={profile?.whatsapp?.replace(/[^0-9]/g, "")} 
        />
        <ThirdPartyServiceCosts />
        <DevelopmentTeamPricing />
        <FAQSection />
        <CoursesSection />


        {projects.length > 0 && (
          <section id="projects" className="relative overflow-hidden bg-white py-12 sm:py-16">
            <div className="absolute top-1/2 left-0 h-[30%] w-[30%] -translate-y-1/2 rounded-full bg-blue-50/50 blur-3xl" />
            
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Featured Projects
                </h2>
                <Link href="/projects">
                  <Button variant="gradient" className="rounded-full">
                    View All Projects
                  </Button>
                </Link>
              </div>
              
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-blue-100 hover:shadow-xl">
                    {project.image &&
                      typeof project.image === 'string' &&
                      project.image.trim() !== '' && (
                        <div className="relative h-48 w-full overflow-hidden sm:h-56">
                          <Image
                            src={project.image}
                            alt={project.title || 'Project image'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="inline-flex rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600">
                        {project.description}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.techStack.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center gap-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600">
                            GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700">
                            Live Demo →
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

        {skills.length > 0 && (
          <section id="skills" className="bg-gray-50/50 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Technical Expertise
              </h2>
              <div className="grid gap-6 sm:gap-8">
                {(
                  Object.entries(skillsByCategory) as Array<
                    [string, Array<(typeof skills)[number]>]
                  >
                ).map(([category, categorySkills]) => (
                  <div
                    key={category}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        {category}
                      </h3>
                      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categorySkills.map((skill: any) => (
                        <div key={skill.id} className="group/skill relative flex items-center space-x-3 rounded-xl border border-gray-50 bg-gray-50/30 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-sm">
                          {skill.icon && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-100 group-hover/skill:ring-blue-100">
                              <span className="text-2xl">{skill.icon}</span>
                            </div>
                          )}
                          <span className="font-semibold text-gray-700 group-hover/skill:text-blue-600">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


        {techStack.length > 0 && (
          <section id="tech-stack" className="bg-gray-50/50 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Tech Stack
              </h2>
              <div className="grid gap-6 sm:gap-8">
                {(
                  Object.entries(techByCategory) as Array<
                    [string, Array<(typeof techStack)[number]>]
                  >
                ).map(([category, categoryTech]) => (
                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-gray-900">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {categoryTech.map((tech: any) => (
                        <div
                          key={tech.id}
                          className="group/tech flex flex-col items-center space-y-2 rounded-xl border border-transparent p-4 transition-all hover:bg-gray-50 hover:shadow-sm">
                          {tech.icon && (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-100 transition-transform group-hover/tech:scale-110">
                              <img
                                src={tech.icon}
                                alt={tech.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <span className="text-sm font-semibold text-gray-700">
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
      <Footer name={profile?.name} />
    </div>
  )
}
