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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) handleDialogClose()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register("title")} className="mt-1" />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  className="mt-1"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  {...register("image")}
                  className="mt-1"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    {...register("githubUrl")}
                    className="mt-1"
                  />
                  {errors.githubUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.githubUrl.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    {...register("liveUrl")}
                    className="mt-1"
                  />
                  {errors.liveUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.liveUrl.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="techStack">Tech Stack</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="techStack"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTechStack()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTechStack}>
                    Add
                  </Button>
                </div>
                {techStack.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechStack(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.techStack && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.techStack.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked: boolean) =>
                    setValue("featured", checked)
                  }
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Project
                </Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No projects found. Add your first project!
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-gray-100 px-2 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
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
