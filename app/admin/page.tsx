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
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    profile: { exists: false, name: null },
    projects: 0,
    featuredProjects: 0,
    skills: 0,
    techStack: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [profileRes, projectsRes, skillsRes, techStackRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/projects"),
        fetch("/api/skills"),
        fetch("/api/tech-stack"),
      ])

      const profile = await profileRes.json()
      const projects = await projectsRes.json()
      const skills = await skillsRes.json()
      const techStack = await techStackRes.json()

      setStats({
        profile: {
          exists: !!profile,
          name: profile?.name || null,
        },
        projects: projects.length || 0,
        featuredProjects: projects.filter((p: any) => p.featured).length || 0,
        skills: skills.length || 0,
        techStack: techStack.length || 0,
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
    <div className="space-y-8">
      <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-700">
          {stats.profile.exists && stats.profile.name
            ? `Welcome back, ${stats.profile.name}! Manage your portfolio information below.`
            : "Welcome! Start by setting up your profile, then add your projects, skills, and tech stack."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{card.value}</p>
                    {card.status !== undefined && (
                      card.status ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{card.description}</p>
                </div>
                <div
                  className={`${card.color} rounded-lg p-3 text-white transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <p className="mb-4 text-sm text-gray-600">
          Quickly add new content or edit existing information
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 transition-all hover:bg-gray-50 hover:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Manage Your Information</h2>
          <p className="mb-4 text-sm text-gray-600">
            Click on any section to view, create, edit, or delete content
          </p>
          <div className="space-y-3">
            <Link href="/admin/profile">
              <div className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Profile</span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats.profile.exists ? "Edit" : "Create"}
                </span>
              </div>
            </Link>
            <Link href="/admin/projects">
              <div className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Projects</span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats.projects} items
                </span>
              </div>
            </Link>
            <Link href="/admin/skills">
              <div className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Skills</span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats.skills} items
                </span>
              </div>
            </Link>
            <Link href="/admin/tech-stack">
              <div className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Tech Stack</span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats.techStack} items
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Content Items</p>
              <p className="text-2xl font-bold">
                {stats.projects + stats.skills + stats.techStack}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Featured Projects</p>
              <p className="text-2xl font-bold">{stats.featuredProjects}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Profile Status</p>
              <p className="text-lg font-semibold">
                {stats.profile.exists ? (
                  <span className="text-green-600">✓ Configured</span>
                ) : (
                  <span className="text-red-600">✗ Not Set</span>
                )}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="w-full">
                View Public Site
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
