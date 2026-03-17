"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle, Sparkles } from "lucide-react"
import Footer from "@/components/Footer"

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [whatsapp, setWhatsapp] = useState<string>("")
  const [headerText, setHeaderText] = useState<React.ReactNode>("Launch your business online faster with me")

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
      <>Launch your business online <br /> faster with me</>,
      <>Make your business <br /> online today</>
    ]
    setHeaderText(headers[Math.floor(Math.random() * headers.length)])
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <main className="relative overflow-hidden pt-16 pb-24">
        {/* Background Decorations */}
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-3xl animate-blob" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-gradient-to-tl from-purple-100/40 to-pink-100/40 blur-3xl animate-blob animation-delay-2000" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              {headerText}
            </h1>
          </div>

          {/* Plans Grid */}
          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {isLoading ? (
              // Loading Skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-3xl border border-gray-100 bg-gray-50 animate-pulse" />
              ))
            ) : (
              plans.map((plan) => (
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
                        {!isNaN(Number(plan.price)) ? "₹" : ""}
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
              ))
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-32">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-4 text-gray-500 italic">Have a different question? Feel free to reach out directly.</p>
            </div>
            <div className="mx-auto mt-16 max-w-3xl space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md">
                  <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    {faq.q}
                  </h4>
                  <p className="mt-3 ml-8 font-medium text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-32 rounded-3xl bg-gray-900 p-12 text-center text-white">
            <Sparkles className="mx-auto h-12 w-12 text-yellow-400" />
            <h2 className="mt-6 text-3xl font-extrabold">Ready to start your project?</h2>
            <p className="mt-4 text-gray-400">Join 50+ clients who transformed their digital presence.</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a 
                href={whatsapp 
                  ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi, I'm interested in booking a consultation for my project.")}` 
                  : "/#contact"}
                target={whatsapp ? "_blank" : "_self"}
                rel={whatsapp ? "noopener noreferrer" : ""}
              >
                <Button variant="gradient" className="h-14 px-8 rounded-full text-lg">
                  Book a Consultation
                </Button>
              </a>
              <Link href="/projects">
                <Button variant="outline" className="h-14 px-8 rounded-full text-lg border-white/20 hover:bg-white/10 text-white">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer name="Saidur" />
    </div>
  )
}
