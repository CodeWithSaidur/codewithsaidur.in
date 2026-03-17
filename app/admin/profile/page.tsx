"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

type Profile = {
  id: string
  name: string
  bio: string
  avatar: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
  website: string | null
  email: string | null
  whatsapp: string | null
  phone: string | null
}

export default function AdminProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()
      if (data) {
        setProfile(data)
        reset({
          name: data.name,
          bio: data.bio,
          avatar: data.avatar || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          website: data.website || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          phone: data.phone || "",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProfileInput) => {
    setIsSaving(true)
    try {
      // Clean up empty strings - convert to empty string or keep as is
      const payload = {
        name: data.name,
        bio: data.bio,
        avatar: data.avatar?.trim() || '',
        github: data.github?.trim() || '',
        linkedin: data.linkedin?.trim() || '',
        twitter: data.twitter?.trim() || '',
        website: data.website?.trim() || '',
        email: data.email?.trim() || '',
        whatsapp: data.whatsapp?.trim() || '',
        phone: data.phone?.trim() || '',
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.details || "Failed to save profile")
      }

      const updatedProfile = result
      setProfile(updatedProfile)

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save profile"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-white p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} className="mt-1" />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className="mt-1"
                rows={4}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                type="url"
                {...register("avatar")}
                className="mt-1"
              />
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.avatar.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                {...register("website")}
                className="mt-1"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.website.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                type="url"
                {...register("github")}
                className="mt-1"
              />
              {errors.github && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.github.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                {...register("linkedin")}
                className="mt-1"
              />
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.linkedin.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                type="url"
                {...register("twitter")}
                className="mt-1"
              />
              {errors.twitter && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.twitter.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="e.g., +1234567890"
                {...register("whatsapp")}
                className="mt-1"
              />
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +1234567890"
                {...register("phone")}
                className="mt-1"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
