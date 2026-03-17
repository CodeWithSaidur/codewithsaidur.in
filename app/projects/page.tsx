import Link from 'next/link'
import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import Project from '@/models/Project'
import Image from 'next/image'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Projects | Portfolio',
  description: 'A showcase of my recent work and projects'
}

// Force dynamic rendering to prevent build-time database connection issues
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function ProjectsPage() {
  let projects: any[] = []

  try {
    await connectDB()
    const projectsData = await Project.find().sort({ createdAt: -1 }).lean()
    projects = projectsData.map((p: any) => ({
      ...p,
      id: p._id.toString()
    }))
  } catch (error: any) {
    // During build, if database connection is skipped, just continue with empty data
    if (error?.skipBuild) {
      console.log('Database connection skipped during build')
    } else {
      console.error('Error fetching projects:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl" />
        
        <h1 className="mb-10 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 sm:text-5xl">
          Projects
        </h1>
        
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-gray-500">No projects available yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <div
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-blue-100 hover:shadow-xl">
                {project.image && (
                  <div className="relative h-48 w-full overflow-hidden sm:h-56">
                    <Image
                      src={project.image}
                      alt={project.title}
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
                  <p className="mb-4 text-sm text-gray-600 line-clamp-3 flex-1">{project.description}</p>
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
        )}
      </main>
      <Footer />
    </div>
  )
}
