"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, type ProjectInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash2, Edit } from "lucide-react"

type Project = {
  id: string
  title: string
  description: string
  image: string | null
  githubUrl: string | null
  liveUrl: string | null
  techStack: string[]
  featured: boolean
}

export default function AdminProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [techStackInput, setTechStackInput] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      techStack: [],
      featured: false,
    },
  })

  const techStack = watch("techStack")
  const featured = watch("featured")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProjectInput) => {
    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      toast({
        title: "Success",
        description: `Project ${editingProject ? "updated" : "created"} successfully`,
      })

      setIsDialogOpen(false)
      setEditingProject(null)
      reset()
      setTechStackInput("")
      fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    reset({
      title: project.title,
      description: project.description,
      image: project.image || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      techStack: project.techStack,
      featured: project.featured,
    })
    setTechStackInput(project.techStack.join(", "))
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      toast({
        title: "Success",
        description: "Project deleted successfully",
      })

      fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const handleAddTechStack = () => {
    if (!techStackInput.trim()) return
    const items = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setValue("techStack", [...techStack, ...items])
    setTechStackInput("")
  }

  const handleRemoveTechStack = (index: number) => {
    const newStack = techStack.filter((_, i) => i !== index)
    setValue("techStack", newStack)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    reset()
    setTechStackInput("")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-clip-text text-3xl font-extrabold text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900">
            Portfolio Projects
          </h1>
          <p className="text-sm font-medium text-gray-500">Manage and showcase your professional work</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) handleDialogClose()
        }}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="rounded-xl shadow-lg shadow-blue-100">
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl border-gray-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {editingProject ? "Edit Project Details" : "Create New Showcase"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-bold text-gray-700">Project Title</Label>
                    <Input id="title" {...register("title")} className="h-11 rounded-xl border-gray-200 focus:ring-blue-500" placeholder="e.g., E-commerce Dashboard" />
                    {errors.title && (
                      <p className="text-xs font-bold text-red-500">{errors.title.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-gray-700">Detailed Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      className="rounded-2xl border-gray-200 focus:ring-blue-500 min-h-[120px]"
                      placeholder="Describe the problem, solution, and your impact..."
                    />
                    {errors.description && (
                      <p className="text-xs font-bold text-red-500">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-bold text-gray-700">Display Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    {...register("image")}
                    className="h-11 rounded-xl border-gray-200"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl" className="text-sm font-bold text-gray-700">GitHub Repository</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    {...register("githubUrl")}
                    className="h-11 rounded-xl border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liveUrl" className="text-sm font-bold text-gray-700">Live Production Link</Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    {...register("liveUrl")}
                    className="h-11 rounded-xl border-gray-200"
                  />
                </div>

                <div className="space-y-2 pt-6">
                  <div className="flex items-center space-x-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                    <Checkbox
                      id="featured"
                      checked={featured}
                      onCheckedChange={(checked: boolean) =>
                        setValue("featured", checked)
                      }
                      className="h-5 w-5 border-gray-300 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="featured" className="cursor-pointer text-sm font-bold text-gray-700">
                      Promote as Featured Project
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-700">Core Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    id="techStack"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, Tailwind, Node.js..."
                    className="h-11 rounded-xl border-gray-200"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTechStack()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTechStack} className="h-11 rounded-xl bg-gray-900">
                    Add
                  </Button>
                </div>
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="group/tag inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-100"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechStack(index)}
                          className="text-blue-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="h-11 rounded-xl border-gray-200 px-6 font-bold"
                >
                  Discard
                </Button>
                <Button type="submit" variant="gradient" className="h-11 rounded-xl px-8 font-bold shadow-lg shadow-blue-100">
                  {editingProject ? "Update Changes" : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-100/50">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-5 font-bold text-gray-900">Project Details</TableHead>
              <TableHead className="font-bold text-gray-900">Technologies</TableHead>
              <TableHead className="font-bold text-gray-900">Visibility</TableHead>
              <TableHead className="text-right font-bold text-gray-900">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-bold text-gray-400">No projects found</p>
                    <p className="text-sm text-gray-500">Add your first project to get started!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="group transition-colors hover:bg-blue-50/20">
                  <TableCell className="py-4 font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      {project.image && (
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                          <img src={project.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      )}
                      {project.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-gray-100 bg-white px-2 py-1 text-[10px] font-extrabold uppercase tracking-tight text-gray-500"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[10px] font-bold text-gray-400">
                          +{project.techStack.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-yellow-700 shadow-sm ring-1 ring-inset ring-yellow-200/50">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                        className="h-9 w-9 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                        className="h-9 w-9 rounded-lg hover:bg-white hover:text-red-500 hover:shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
