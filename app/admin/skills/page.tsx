"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { skillSchema, type SkillInput } from "@/lib/validations"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Skill = {
  id: string
  name: string
  category: string
  level: number
  icon: string | null
}

export default function AdminSkillsPage() {
  const { toast } = useToast()
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      level: 1,
    },
  })

  const level = watch("level")

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills")
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: SkillInput) => {
    try {
      const url = editingSkill
        ? `/api/skills/${editingSkill.id}`
        : "/api/skills"
      const method = editingSkill ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save skill")
      }

      toast({
        title: "Success",
        description: `Skill ${editingSkill ? "updated" : "created"} successfully`,
      })

      setIsDialogOpen(false)
      setEditingSkill(null)
      reset()
      fetchSkills()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    reset({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete skill")
      }

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      })

      fetchSkills()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingSkill(null)
    reset()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skills</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) handleDialogClose()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Edit Skill" : "Add New Skill"}
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
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={level?.toString()}
                  onValueChange={(value) => setValue("level", parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <SelectItem key={lvl} value={lvl.toString()}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.level.message}
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
                  {editingSkill ? "Update" : "Create"}
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
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No skills found. Add your first skill!
                </TableCell>
              </TableRow>
            ) : (
              skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell>{skill.level}/5</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(skill.id)}
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
