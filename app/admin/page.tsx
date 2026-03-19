"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Briefcase, 
  Code, 
  Layers, 
  Plus,
  Edit,
  CheckCircle2,
  XCircle
} from "lucide-react"

type Stats = {
  profile: {
    exists: boolean
    name: string | null
  }
  projects: number
  featuredProjects: number
  skills: number
  techStack: number
  teamMembers: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    profile: { exists: false, name: null },
    projects: 0,
    featuredProjects: 0,
    skills: 0,
    techStack: 0,
    teamMembers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [profileRes, projectsRes, skillsRes, techStackRes, teamRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/projects"),
        fetch("/api/skills"),
        fetch("/api/tech-stack"),
        fetch("/api/team-members"),
      ])

      const profile = await profileRes.json()
      const projects = await projectsRes.json()
      const skills = await skillsRes.json()
      const techStack = await techStackRes.json()
      const team = await teamRes.json()

      setStats({
        profile: {
          exists: !!profile,
          name: profile?.name || null,
        },
        projects: projects.length || 0,
        featuredProjects: projects.filter((p: any) => p.featured).length || 0,
        skills: skills.length || 0,
        techStack: techStack.length || 0,
        teamMembers: team.length || 0,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Profile",
      value: stats.profile.exists ? "Configured" : "Not Set",
      icon: User,
      color: "bg-blue-500",
      href: "/admin/profile",
      status: stats.profile.exists,
      description: stats.profile.name || "No profile created",
    },
    {
      title: "Projects",
      value: stats.projects.toString(),
      icon: Briefcase,
      color: "bg-green-500",
      href: "/admin/projects",
      featured: stats.featuredProjects,
      description: `${stats.featuredProjects} featured`,
    },
    {
      title: "Skills",
      value: stats.skills.toString(),
      icon: Code,
      color: "bg-purple-500",
      href: "/admin/skills",
      description: "Total skills",
    },
    {
      title: "Tech Stack",
      value: stats.techStack.toString(),
      icon: Layers,
      color: "bg-orange-500",
      href: "/admin/tech-stack",
      description: "Technologies",
    },
  ]

  const quickActions = [
    { label: "Add Project", href: "/admin/projects", icon: Plus },
    { label: "Add Skill", href: "/admin/skills", icon: Plus },
    { label: "Add Tech", href: "/admin/tech-stack", icon: Plus },
    { label: "Edit Profile", href: "/admin/profile", icon: Edit },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-10">


      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-blue-100 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-gray-400">{card.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">{card.value}</span>
                    {card.status !== undefined && (
                      card.status ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )
                    )}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{card.description}</p>
                </div>
                <div className={`${card.color} flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:rotate-12`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Overview */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 italic">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.label} href={action.href}>
                    <Button
                      variant="outline"
                      className="h-14 w-full justify-center gap-3 rounded-2xl border-gray-100 font-bold transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-600"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-blue-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      {action.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Manage Content</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/admin/profile" className="group rounded-2xl border border-gray-50 bg-gray-50/30 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900">Personal Info</span>
                      <span className="text-xs font-medium text-gray-500">{stats.profile.exists ? "Configured" : "Needs setup"}</span>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-gray-300 transition-colors group-hover:text-blue-500" />
                </div>
              </Link>
              <Link href="/admin/projects" className="group rounded-2xl border border-gray-50 bg-gray-50/30 p-4 transition-all hover:border-green-100 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <Briefcase className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900">Projects</span>
                      <span className="text-xs font-medium text-gray-500">{stats.projects} Items</span>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-gray-300 transition-colors group-hover:text-green-500" />
                </div>
              </Link>
              <Link href="/admin/skills" className="group rounded-2xl border border-gray-50 bg-gray-50/30 p-4 transition-all hover:border-purple-100 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <Code className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900">Skills</span>
                      <span className="text-xs font-medium text-gray-500">{stats.skills} Items</span>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-gray-300 transition-colors group-hover:text-purple-500" />
                </div>
              </Link>
              <Link href="/admin/tech-stack" className="group rounded-2xl border border-gray-50 bg-gray-50/30 p-4 transition-all hover:border-orange-100 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <Layers className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900">Tech Stack</span>
                      <span className="text-xs font-medium text-gray-500">{stats.techStack} Items</span>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-gray-300 transition-colors group-hover:text-orange-500" />
                </div>
              </Link>
              <Link href="/admin/team-members" className="group rounded-2xl border border-gray-50 bg-gray-50/30 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <User className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900">Team Members</span>
                      <span className="text-xs font-medium text-gray-500">{stats.teamMembers} Members</span>
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-gray-300 transition-colors group-hover:text-pink-500" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Performance Snapshot</h2>
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 p-6">
              <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Visibility</p>
              <p className="text-4xl font-extrabold text-indigo-900">
                {stats.projects + stats.skills + stats.techStack}
              </p>
              <p className="text-xs font-semibold text-gray-400 mt-1">Total active entries</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-bold text-gray-600">Featured Work</span>
                <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{stats.featuredProjects}</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-bold text-gray-600">Profile Health</span>
                {stats.profile.exists ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Optimal</span>
                ) : (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase">Action Required</span>
                )}
              </div>
            </div>

            <Link href="/" target="_blank">
              <Button variant="gradient" className="w-full h-14 rounded-2xl text-lg font-bold shadow-indigo-200">
                Live Site View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
