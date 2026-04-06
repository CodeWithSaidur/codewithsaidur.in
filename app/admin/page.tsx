"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin/profile")
  }, [router])

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-lg text-gray-600">Redirecting to profile...</div>
    </div>
  )
}
