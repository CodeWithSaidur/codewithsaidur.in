"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations"
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

type TeamMember = {
  id: string
  name: string
  designation: string
  image: string
}

export default function AdminTeamMembersPage() {
  const { toast } = useToast()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/team-members")
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: TeamMemberInput) => {
    try {
      const url = editingMember
        ? `/api/team-members/${editingMember.id}`
        : "/api/team-members"
      const method = editingMember ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save team member")
      }

      toast({
        title: "Success",
        description: `Member ${editingMember ? "updated" : "created"} successfully`,
      })

      setIsDialogOpen(false)
      setEditingMember(null)
      reset()
      fetchMembers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    reset({
      name: member.name,
      designation: member.designation,
      image: member.image,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete team member")
      }

      toast({
        title: "Success",
        description: "Member deleted successfully",
      })

      fetchMembers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingMember(null)
    reset({ name: "", designation: "", image: "" })
  }

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading team members...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Team Members</h1>
          <p className="text-gray-500 font-medium">Manage your team members displayed in the footer.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) handleDialogClose()
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-blue-100 font-bold">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                {editingMember ? "Edit Member" : "Add New Member"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Full Name *</Label>
                <Input id="name" {...register("name")} className="rounded-xl h-11" placeholder="John Doe" />
                {errors.name && <p className="text-xs font-bold text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="font-bold">Designation *</Label>
                <Input id="designation" {...register("designation")} className="rounded-xl h-11" placeholder="Lead Developer" />
                {errors.designation && <p className="text-xs font-bold text-red-500">{errors.designation.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="font-bold">Image URL *</Label>
                <Input id="image" type="url" {...register("image")} className="rounded-xl h-11" placeholder="https://example.com/avatar.jpg" />
                {errors.image && <p className="text-xs font-bold text-red-500">{errors.image.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={handleDialogClose} className="rounded-xl h-11 px-6">
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" className="rounded-xl h-11 px-8 font-bold">
                  {editingMember ? "Update Member" : "Create Member"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Designation</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-gray-400 font-medium">
                  No team members added yet.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100 shadow-sm">
                      <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">{member.name}</TableCell>
                  <TableCell className="font-medium text-gray-600 italic">{member.designation}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(member)} className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-md hover:text-blue-600">
                        <Edit className="h-4.5 w-4.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-md hover:text-red-500">
                        <Trash2 className="h-4.5 w-4.5" />
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
