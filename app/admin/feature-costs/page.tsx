"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface FeatureCost {
  id: string
  name: string
  usdCost: string
  inrCost: string
  order: number
}

export default function AdminFeatureCostsPage() {
  const [costs, setCosts] = useState<FeatureCost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCost, setEditingCost] = useState<FeatureCost | null>(null)
  
  // Form states
  const [name, setName] = useState("")
  const [usdCost, setUsdCost] = useState("")
  const [inrCost, setInrCost] = useState("")
  const [order, setOrder] = useState(0)

  const { toast } = useToast()

  useEffect(() => {
    fetchCosts()
  }, [])

  const fetchCosts = async () => {
    try {
      const response = await fetch("/api/feature-costs")
      const data = await response.json()
      setCosts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch feature costs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (cost?: FeatureCost) => {
    if (cost) {
      setEditingCost(cost)
      setName(cost.name)
      setUsdCost(cost.usdCost)
      setInrCost(cost.inrCost)
      setOrder(cost.order)
    } else {
      setEditingCost(null)
      setName("")
      setUsdCost("")
      setInrCost("")
      setOrder(costs.length)
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const costData = {
      name,
      usdCost,
      inrCost,
      order,
    }

    try {
      const url = editingCost ? `/api/feature-costs/${editingCost.id}` : "/api/feature-costs"
      const method = editingCost ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Feature cost ${editingCost ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        fetchCosts()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCost ? "update" : "create"} feature cost`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature cost?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/feature-costs/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Feature cost deleted successfully",
        })
        fetchCosts()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete feature cost",
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
          <h1 className="text-3xl font-bold text-gray-900">Feature Cost Management</h1>
          <p className="text-gray-500">Manage development roles and feature costs (Team-wise project investment).</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add Feature/Role
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {costs.map((cost) => (
          <div
            key={cost.id}
            className={`flex flex-col rounded-2xl border bg-white p-6 transition-all hover:shadow-md`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{cost.name}</h3>
            </div>
            
            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">USD:</span>
                <span className="font-bold text-gray-900">{cost.usdCost}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">INR:</span>
                <span className="font-bold text-blue-600">{cost.inrCost}</span>
              </div>
            </div>
            
            <div className="flex gap-2 border-t pt-4 mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full"
                onClick={() => handleOpenDialog(cost)}
                disabled={isLoading}
              >
                <Pencil className="mr-2 h-3 w-3" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(cost.id)}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCost ? "Edit Feature Cost" : "Add New Feature/Role"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role / Feature Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Solution Architect"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usdCost">USD Cost Range</Label>
              <Input
                id="usdCost"
                value={usdCost}
                onChange={(e) => setUsdCost(e.target.value)}
                placeholder="e.g. $4,500–$12,000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inrCost">INR Cost Range</Label>
              <Input
                id="inrCost"
                value={inrCost}
                onChange={(e) => setInrCost(e.target.value)}
                placeholder="e.g. ₹3.8L–₹10.2L"
                required
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

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full rounded-full h-12 text-base font-bold">
                {isLoading ? "Saving..." : editingCost ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
