"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle } from "lucide-react"

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
}

export default function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [whatsapp, setWhatsapp] = useState<string>("")
  const [headerText, setHeaderText] = useState("Launch your business online faster with me")

  const faqs = [
    {
      q: "What technologies do you use?",
      a: "I primarily work with Next.js, React, Node.js, and modern CSS frameworks like Tailwind. For databases, I use MongoDB, PostgreSQL, and Redis.",
    },
    {
      q: "Do you offer maintenance?",
      a: "Yes, all my plans include a support period. I also offer separate maintenance packages for long-term updates and security monitoring.",
    },
    {
      q: "Can I upgrade my plan later?",
      a: "Absolutely. You can start with basic and scale as your business grows. We'll simply adjust the scope of work and timeline.",
    },
  ]

  useEffect(() => {
    // Fetch plans
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        setPlans(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))

    // Fetch profile for whatsapp number
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        if (data && data.whatsapp) {
          setWhatsapp(data.whatsapp.replace(/[^0-9]/g, ""))
        }
      })
      .catch(err => console.error("Error fetching profile:", err))
    // Randomize header
    const headers = [
      "Launch your business online faster with me",
      "Make your business online today"
    ]
    setHeaderText(headers[Math.floor(Math.random() * headers.length)])
  }, [])

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
    <section id="pricing" className="relative overflow-hidden pt-16 pb-24 bg-white/50">
      <div className="absolute top-[10%] right-[10%] h-[40%] w-[40%] rounded-full bg-gradient-to-tr from-blue-100/30 to-indigo-100/30 blur-3xl animate-blob animation-delay-4000" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {headerText}
          </h2>
        </div>

        {/* Plans Grid */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:translate-y-[-8px] hover:shadow-2xl ${
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

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                    {isNaN(Number(plan.price)) ? "" : "₹"}
                    {plan.price}
                  </span>
                  {!isNaN(Number(plan.price)) && Number(plan.price) > 0 && (
                    <span className="ml-1 text-sm font-semibold text-gray-500">/one-time</span>
                  )}
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-blue-100">
                      <Check className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href={whatsapp 
                  ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in the ${plan.name} plan. Could we discuss this further?`)}` 
                  : "/#contact"}
                target={whatsapp ? "_blank" : "_self"}
                rel={whatsapp ? "noopener noreferrer" : ""}
                className="mt-8"
              >
                <Button
                  variant={plan.featured ? "gradient" : "outline"}
                  className="w-full h-12 rounded-xl text-base font-bold shadow-lg"
                >
                  {plan.cta || "Work With Me"}
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">FAQ</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md">
                <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  {faq.q}
                </h4>
                <p className="mt-3 ml-8 font-medium text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
