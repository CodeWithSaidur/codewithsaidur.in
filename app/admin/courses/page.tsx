"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Check, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface Course {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
  order: number
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  
  // Form states
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState<string[]>([""])
  const [cta, setCta] = useState("Enroll Now")
  const [featured, setFeatured] = useState(false)
  const [order, setOrder] = useState(0)

  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course)
      setName(course.name)
      setPrice(course.price)
      setDescription(course.description)
      setFeatures(course.features.length > 0 ? course.features : [""])
      setCta(course.cta)
      setFeatured(course.featured)
      setOrder(course.order)
    } else {
      setEditingCourse(null)
      setName("")
      setPrice("")
      setDescription("")
      setFeatures([""])
      setCta("Enroll Now")
      setFeatured(false)
      setOrder(courses.length)
    }
    setIsDialogOpen(true)
  }

  const handleAddFeature = () => {
    setFeatures([...features, ""])
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index)
    setFeatures(newFeatures.length > 0 ? newFeatures : [""])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const filteredFeatures = features.filter(f => f.trim() !== "")

    const courseData = {
      name,
      price,
      description,
      features: filteredFeatures,
      cta,
      featured,
      order,
    }

    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses"
      const method = editingCourse ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Course ${editingCourse ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        fetchCourses()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? "update" : "create"} course`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/courses/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Course deleted successfully",
        })
        fetchCourses()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
          <p className="text-gray-500">Manage your learning modules and courses.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`flex flex-col rounded-2xl border p-6 transition-all hover:shadow-md ${
              course.featured ? "border-blue-200 bg-blue-50/30" : "bg-white"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <BookOpen className="h-5 w-5 text-blue-600" />
                 <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
              </div>
              {course.featured && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  FEATURED
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-extrabold text-gray-900">₹{course.price}</span>
            </div>
            
            <p className="mb-6 text-sm text-gray-500 line-clamp-2">{course.description}</p>
            
            <div className="mb-8 flex-1 space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modules / Features</p>
              {course.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
              {course.features.length > 3 && (
                <p className="text-xs text-gray-400">+{course.features.length - 3} more</p>
              )}
            </div>

            <div className="flex gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full"
                onClick={() => handleOpenDialog(course)}
                disabled={isLoading}
              >
                <Pencil className="mr-2 h-3 w-3" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(course.id)}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {courses.length === 0 && !isLoading && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No courses available. Click "Add Course" to create one.</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Masterclass in Web Dev"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (Amount only)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                  <Input
                    id="price"
                    className="pl-7"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will students learn?"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Features / Modules</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                  <Plus className="mr-2 h-3 w-3" /> Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Item ${index + 1}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cta">Call to Action Button Text</Label>
                <Input
                  id="cta"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g. Enroll Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <Checkbox
                id="featured"
                checked={featured}
                onCheckedChange={(checked) => setFeatured(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="featured"
                  className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Featured Course
                </label>
                <p className="text-xs text-gray-500">
                  This course will be highlighted as a top pick.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full rounded-full h-12 text-base font-bold">
                {isLoading ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
