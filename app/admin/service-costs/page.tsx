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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAdminSave } from "../AdminSaveContext"

interface ServiceCost {
  id: string
  name: string
  cost: number
  type: 'fixed' | 'usage'
  order: number
}

export default function AdminServiceCostsPage() {
  const [costs, setCosts] = useState<ServiceCost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCost, setEditingCost] = useState<ServiceCost | null>(null)
  
  // Form states
  const [name, setName] = useState("")
  const [cost, setCost] = useState<number>(0)
  const [type, setType] = useState<'fixed' | 'usage'>('fixed')
  const [order, setOrder] = useState(0)

  const { toast } = useToast()
  const { registerSaveAction } = useAdminSave()

  useEffect(() => {
    fetchCosts()
  }, [])

  useEffect(() => {
    if (isDialogOpen) {
      registerSaveAction(async () => {
        // Trigger manual form submission since it's not a hook-form
        const element = document.getElementById("service-cost-form") as HTMLFormElement
        if (element) element.requestSubmit()
      })
    } else {
      registerSaveAction(null)
    }
    return () => registerSaveAction(null)
  }, [isDialogOpen, registerSaveAction])

  const fetchCosts = async () => {
    try {
      const response = await fetch("/api/service-costs")
      const data = await response.json()
      setCosts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch service costs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (cost?: ServiceCost) => {
    if (cost) {
      setEditingCost(cost)
      setName(cost.name)
      setCost(cost.cost)
      setType(cost.type)
      setOrder(cost.order)
    } else {
      setEditingCost(null)
      setName("")
      setCost(0)
      setType('fixed')
      setOrder(costs.length)
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const costData = {
      name,
      cost,
      type,
      order,
    }

    try {
      const url = editingCost ? `/api/service-costs/${editingCost.id}` : "/api/service-costs"
      const method = editingCost ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Service cost ${editingCost ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        fetchCosts()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCost ? "update" : "create"} service cost`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service cost?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/service-costs/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Service cost deleted successfully",
        })
        fetchCosts()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service cost",
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
          <h1 className="text-3xl font-bold text-gray-900">Service Cost Management</h1>
          <p className="text-gray-500">Manage third-party infrastructure and service costs.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add Service Cost
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
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cost.type === 'usage' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                {cost.type.toUpperCase()}
              </span>
            </div>
            
            <div className="mb-8">
              <span className="text-3xl font-extrabold text-gray-900">₹{cost.cost.toLocaleString()}</span>
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
            <DialogTitle>{editingCost ? "Edit Service Cost" : "Add New Service Cost"}</DialogTitle>
          </DialogHeader>
          <form id="service-cost-form" onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AWS Hosting"
                required
              />
            </div>
            
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (Base / Annual)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  placeholder="e.g. 15000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Cost Type</Label>
                <Select value={type} onValueChange={(val: 'fixed' | 'usage') => setType(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                {isLoading ? "Saving..." : editingCost ? "Update Service Cost" : "Create Service Cost"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
