"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
}

interface PlansPricingSectionProps {
  initialPlans?: Plan[]
  whatsappNumber?: string
}

export default function PlansPricingSection({ initialPlans, whatsappNumber }: PlansPricingSectionProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans || [])
  const [isLoading, setIsLoading] = useState(!initialPlans)
  const [whatsapp, setWhatsapp] = useState<string>(whatsappNumber || "")
  const [headerText, setHeaderText] = useState("Launch your business online faster with me")

  const defaultPlans: Plan[] = [
    // ... default plans ...
  ]

  useEffect(() => {
    // If we already have initial plans, we skip the initial loading fetch
    // But we might want to refresh them in the background
    if (!initialPlans) {
      fetch("/api/plans-pricing")
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setPlans(data)
          } else {
            // setPlans(defaultPlans) // Fallback removed for consistency
          }
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    }

    if (!whatsappNumber) {
      fetch("/api/profile")
        .then(res => res.json())
        .then(data => {
          if (data && data.whatsapp) {
            setWhatsapp(data.whatsapp.replace(/[^0-9]/g, ""))
          }
        })
        .catch(err => console.error("Error fetching profile:", err))
    }
  }, [initialPlans, whatsappNumber])

  if (isLoading) {
    return (
      <section id="pricing" className="py-24 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 mx-auto rounded-full" />
          <div className="h-12 w-96 bg-gray-200 mx-auto rounded-lg" />
        </div>
      </section>
    )
  }

  if (plans.length === 0) return null

  return (
    <section id="pricing" className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-white/50">
      <div className="absolute top-[10%] right-[10%] h-[40%] w-[40%] rounded-full bg-gradient-to-tr from-blue-100/30 to-indigo-100/30 blur-3xl animate-blob animation-delay-4000" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl px-4">
            {headerText}
          </h2>
        </div>

        {/* Plans Grid */}
        <div className="mt-12 md:mt-20 grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-4 md:p-6 transition-all hover:translate-y-[-8px] hover:shadow-2xl ${
                plan.featured
                  ? "border-blue-200 bg-white shadow-xl ring-1 ring-blue-100"
                  : "border-gray-100 bg-white/50 backdrop-blur-sm"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {isNaN(Number(plan.price)) ? "" : "₹"}
                    {plan.price}
                  </span>
                  {!isNaN(Number(plan.price)) && Number(plan.price) > 0 && (
                    <span className="ml-1 text-xs font-semibold text-gray-500">/one-time</span>
                  )}
                </div>
                <p className="mt-3 text-xs font-medium text-gray-500">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-blue-100">
                      <Check className="h-2.5 w-2.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href={whatsapp 
                  ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in the ${plan.name} plan. Could we discuss this further?`)}` 
                  : "/#contact"}
                target={whatsapp ? "_blank" : "_self"}
                rel={whatsapp ? "noopener noreferrer" : ""}
                className="mt-6"
              >
                <Button
                  variant={plan.featured ? "gradient" : "outline"}
                  className="w-full h-10 rounded-xl text-sm font-bold shadow-lg"
                >
                  {plan.cta || "Work With Me"}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
