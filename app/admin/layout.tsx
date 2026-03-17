"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function AdminLayout({
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
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/skills", label: "Skills" },
    { href: "/admin/tech-stack", label: "Tech Stack" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/pricing", label: "Pricing" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="bg-clip-text text-xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Admin Panel
              </h1>
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                      pathname === item.href
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
              <Link href="/" target="_blank">
                <Button variant="outline" className="rounded-full border-gray-200">
                  Site Preview
                </Button>
              </Link>
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
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                pathname === item.href
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
