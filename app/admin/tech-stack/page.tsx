"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { techStackSchema, type TechStackInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

type TechStack = {
  id: string
  name: string
  category: string
  icon: string | null
}

export default function AdminTechStackPage() {
  const { toast } = useToast()
  const [techStack, setTechStack] = useState<TechStack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<TechStack | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TechStackInput>({
    resolver: zodResolver(techStackSchema),
  })

  useEffect(() => {
    fetchTechStack()
  }, [])

  const fetchTechStack = async () => {
    try {
      const response = await fetch("/api/tech-stack")
      const data = await response.json()
      setTechStack(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tech stack",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: TechStackInput) => {
    try {
      const url = editingTech
        ? `/api/tech-stack/${editingTech.id}`
        : "/api/tech-stack"
      const method = editingTech ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save tech stack item")
      }

      toast({
        title: "Success",
        description: `Tech stack item ${editingTech ? "updated" : "created"} successfully`,
      })

      setIsDialogOpen(false)
      setEditingTech(null)
      reset()
      fetchTechStack()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tech stack item",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (tech: TechStack) => {
    setEditingTech(tech)
    reset({
      name: tech.name,
      category: tech.category,
      icon: tech.icon || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/tech-stack/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tech stack item")
      }

      toast({
        title: "Success",
        description: "Tech stack item deleted successfully",
      })

      fetchTechStack()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tech stack item",
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingTech(null)
    reset()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tech Stack & Tools</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) handleDialogClose()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tech Stack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTech ? "Edit Tech Stack" : "Add New Tech Stack"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register("name")} className="mt-1" />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  {...register("category")}
                  className="mt-1"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="icon">Icon URL</Label>
                <Input
                  id="icon"
                  type="url"
                  {...register("icon")}
                  className="mt-1"
                />
                {errors.icon && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.icon.message}
                  </p>
                )}
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
                  {editingTech ? "Update" : "Create"}
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
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {techStack.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No tech stack items found. Add your first item!
                </TableCell>
              </TableRow>
            ) : (
              techStack.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>{tech.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tech)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tech.id)}
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
