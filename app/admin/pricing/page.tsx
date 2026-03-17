"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Check } from "lucide-react"
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

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
  order: number
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  
  // Form states
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState<string[]>([""])
  const [cta, setCta] = useState("Work With Me")
  const [featured, setFeatured] = useState(false)
  const [order, setOrder] = useState(0)

  const { toast } = useToast()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/pricing")
      const data = await response.json()
      setPlans(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pricing plans",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan)
      setName(plan.name)
      setPrice(plan.price)
      setDescription(plan.description)
      setFeatures(plan.features.length > 0 ? plan.features : [""])
      setCta(plan.cta)
      setFeatured(plan.featured)
      setOrder(plan.order)
    } else {
      setEditingPlan(null)
      setName("")
      setPrice("")
      setDescription("")
      setFeatures([""])
      setCta("Work With Me")
      setFeatured(false)
      setOrder(plans.length)
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

    const planData = {
      name,
      price,
      description,
      features: filteredFeatures,
      cta,
      featured,
      order,
    }

    try {
      const url = editingPlan ? `/api/pricing/${editingPlan.id}` : "/api/pricing"
      const method = editingPlan ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Plan ${editingPlan ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        fetchPlans()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingPlan ? "update" : "create"} plan`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/pricing/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Plan deleted successfully",
        })
        fetchPlans()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan",
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
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-500">Manage your service packages and plans.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-6 transition-all hover:shadow-md ${
              plan.featured ? "border-blue-200 bg-blue-50/30" : "bg-white"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              {plan.featured && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  FEATURED
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-extrabold text-gray-900">₹{plan.price}</span>
            </div>
            
            <p className="mb-6 text-sm text-gray-500 line-clamp-2">{plan.description}</p>
            
            <div className="mb-8 flex-1 space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Features</p>
              {plan.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <p className="text-xs text-gray-400">+{plan.features.length - 3} more features</p>
              )}
            </div>

            <div className="flex gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full"
                onClick={() => handleOpenDialog(plan)}
              >
                <Pencil className="mr-2 h-3 w-3" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(plan.id)}
              >
                <Trash2 className="mr-2 h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Professional"
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
                    placeholder="e.g. 15000"
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
                placeholder="What is this plan best for?"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                  <Plus className="mr-2 h-3 w-3" /> Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
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
                  placeholder="e.g. Work With Me"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
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
                  Featured Plan
                </label>
                <p className="text-xs text-gray-500">
                  This plan will be highlighted with a "Most Popular" badge.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full rounded-full h-12 text-base font-bold">
                {isLoading ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
