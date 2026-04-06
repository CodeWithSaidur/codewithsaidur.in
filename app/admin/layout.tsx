"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AdminSaveProvider, useAdminSave } from "./AdminSaveContext"
import { Check, ExternalLink } from "lucide-react"

function SmartActionButton() {
  const { triggerSave, isSaving, hasSaveAction } = useAdminSave()
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    try {
      await triggerSave()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      // Error handled by page's toast
    }
  }

  if (!hasSaveAction && !showSuccess) {
    return (
      <Button
        variant="outline"
        className="rounded-full border-gray-200 flex items-center gap-2"
        onClick={() => window.open("/", "_blank")}
      >
        <ExternalLink className="h-4 w-4" />
        Site Preview
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="rounded-full border-gray-200 px-6 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      onClick={handleSave}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Saving...
        </>
      ) : showSuccess ? (
        <>
          <Check className="h-4 w-4" />
          Saved!
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  )
}

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        router.push("/admin/login")
      }
    } catch {
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const navItems = [
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/plans-pricing", label: "Plans" },
    { href: "/admin/service-costs", label: "Services" },
    { href: "/admin/feature-costs", label: "Features" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/courses", label: "Courses" },
    { href: "/admin/skills", label: "Skills" },
    { href: "/admin/tech-stack", label: "Tech Stack" },
    { href: "/admin/team-members", label: "Team" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <SmartActionButton />
              <Button variant="ghost" className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Nav */}
      <div className="flex overflow-x-auto border-b bg-gray-50 px-4 py-2 md:hidden">
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${pathname === item.href
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl animation-blob" />
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminSaveProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminSaveProvider>
  )
}

