"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Login failed")
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      // Redirect to admin panel after successful login
      // Using window.location.href ensures cookie is properly set and middleware recognizes auth
      window.location.href = "/admin"
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50 blur-3xl" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-gradient-to-tl from-purple-100/50 to-pink-100/50 blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <div>
          <h2 className="bg-clip-text text-center text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-gray-500">
            Sign in to manage your professional presence
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="h-11 rounded-xl border-gray-200 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="Password" className="text-sm font-semibold text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-11 rounded-xl border-gray-200 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" variant="gradient" className="h-11 w-full rounded-xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : "Sign in to Dashboard"}
          </Button>
          
          <div className="text-center">
            <Link href="/" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
