"use client"

import { useState, useEffect } from "react"
import { Check, Info, DollarSign, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeatureCost {
  id: string
  name: string
  usdCost: string
  inrCost: string
}

interface FeatureCostsSectionProps {
  whatsappNumber?: string
}

export default function FeatureCostsSection({ whatsappNumber }: FeatureCostsSectionProps) {
  const [pricingData, setPricingData] = useState<FeatureCost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [whatsapp, setWhatsapp] = useState(whatsappNumber || "")

  useEffect(() => {
    if (!whatsappNumber) {
      fetch("/api/profile")
        .then(res => res.json())
        .then(data => {
          if (data && data.whatsapp) {
            setWhatsapp(data.whatsapp.replace(/[^0-9]/g, ""))
          }
        })
    }
  }, [whatsappNumber])

  useEffect(() => {
    fetch("/api/feature-costs")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setPricingData(data)
        }
      })
      .catch(err => console.error("Error fetching feature costs:", err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section id="dev-pricing" className="relative overflow-hidden py-24 bg-zinc-50/50">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-black/[0.03] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-black/[0.03] rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 px-4">
            Development Team Plans Pricing
          </h2>
          <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl px-4">
            Feature-wise project investment
          </h3>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-lg font-medium px-4 leading-relaxed">
            Based on the features you choose, we will provide you with the total investment required for your project.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-black/5 overflow-hidden">
          {/* Header - Desktop Only */}
          <div className="hidden md:grid md:grid-cols-12 bg-gradient-to-r from-black via-zinc-900 to-black text-white px-6 py-5">
            <div className="col-span-6 text-sm font-bold uppercase tracking-wider">Feature / Module</div>
            <div className="col-span-3 text-sm font-bold uppercase tracking-wider text-center">Price (USD)</div>
            <div className="col-span-3 text-sm font-bold uppercase tracking-wider text-center">Price (INR)</div>
          </div>

          <div className="divide-y divide-gray-100">
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse bg-zinc-50 p-6 md:grid md:grid-cols-12">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-200" />
                    <div className="h-4 w-48 rounded bg-zinc-200" />
                  </div>
                  <div className="col-span-3 h-4 w-24 rounded bg-zinc-200 mx-auto hidden md:block" />
                  <div className="col-span-3 h-8 w-32 rounded-full bg-zinc-200 ml-auto hidden md:block" />
                </div>
              ))
            ) : (
              pricingData.map((item, index) => (
                <div
                  key={index}
                  className="group p-6 md:px-6 md:py-5 transition-all hover:bg-zinc-50/80 md:grid md:grid-cols-12 md:items-center"
                >
                  {/* Role Column */}
                  <div className="col-span-6 mb-4 md:mb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-xs transition-transform group-hover:scale-110">
                        {index + 1}
                      </div>
                      <span className="text-base md:text-sm font-bold text-gray-900 transition-colors group-hover:text-black leading-tight">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  {/* USD Column */}
                  <div className="col-span-3 mb-4 md:mb-0 md:text-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5 md:justify-center">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-600" />
                        {item.usdCost}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter md:justify-center">
                        Estimated Project Cost
                      </span>
                    </div>
                  </div>

                  {/* INR Column */}
                  <div className="col-span-3 text-left md:text-right">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-bold text-zinc-900 ring-1 ring-inset ring-black/10 group-hover:bg-black group-hover:text-white transition-all transform group-hover:scale-105">
                      {item.inrCost}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-12 text-center p-8 rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50">
          <p className="text-gray-600 font-medium mb-6">
            Prices are estimates and may vary based on complexity, technology stack, and specific business logic.
          </p>
          <a
            href={whatsapp
              ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in getting a custom project quote. I've been looking at the feature-wise investment chart on your website.`)}`
              : "#contact"}
            target={whatsapp ? "_blank" : "_self"}
            rel={whatsapp ? "noopener noreferrer" : ""}
          >
            <Button
              className="rounded-full bg-black hover:bg-zinc-800 text-white px-8 py-6 text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Get a Custom Quote
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
