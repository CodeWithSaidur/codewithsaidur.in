import Link from 'next/link'
import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import Project from '@/models/Project'
import Image from 'next/image'

export const metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse through my portfolio of projects and applications'
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
        <h1 className="mb-8 text-4xl font-bold">Projects</h1>
        {projects.length === 0 ? (
          <div className="rounded-lg border bg-white p-12 text-center">
            <p className="text-gray-600">No projects available yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg">
                {project.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-gray-600">{project.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded bg-gray-100 px-2 py-1 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline">
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
