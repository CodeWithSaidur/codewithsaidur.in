import Footer from '@/components/Footer'
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
    <div className="min-h-screen bg-white">
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl" />
        
        <h1 className="mb-10 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 sm:text-5xl">
          Tech Stack & Tools
        </h1>

        {techStack.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-gray-500">No tech stack items available yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(techByCategory).map(([category, categoryTech]) => (
              <div key={category} className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                </div>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {(categoryTech as typeof techStack).map((tech: any) => (
                    <div
                      key={tech.id}
                      className="group/tech flex flex-col items-center space-y-3 rounded-xl border border-gray-50 bg-gray-50/30 p-6 transition-all hover:border-blue-100 hover:bg-white hover:shadow-sm">
                      {tech.icon && (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition-transform group-hover/tech:scale-110">
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                      <span className="font-bold text-gray-700 group-hover/tech:text-blue-600">{tech.name}</span>
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
