"use client"

import { Check, Info, DollarSign, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const pricingData = [
  { role: "Project Manager", usd: "$2,500–$6,500", inr: "₹2.1L–₹5.5L" },
  { role: "Business Analyst", usd: "$1,800–$4,500", inr: "₹1.5L–₹3.8L" },
  { role: "Domain Expert", usd: "$3,000–$8,000", inr: "₹2.5L–₹6.8L" },
  { role: "Solution Architect", usd: "$4,500–$12,000", inr: "₹3.8L–₹10.2L" },
  { role: "UI/UX Designer", usd: "$2,000–$7,500", inr: "₹1.7L–₹6.4L" },
  { role: "Database Designer", usd: "$2,500–$8,000", inr: "₹2.1L–₹6.8L" },
  { role: "Frontend Developer", usd: "$4,000–$15,000", inr: "₹3.4L–₹12.7L" },
  { role: "Backend Developer", usd: "$4,500–$18,000", inr: "₹3.8L–₹15.3L" },
  { role: "Mobile Developer", usd: "$5,000–$20,000", inr: "₹4.2L–₹17.0L" },
  { role: "QA Engineer (Quality Assurance)", usd: "$1,200–$4,000", inr: "₹1.0L–₹3.4L" },
  { role: "DevOps Engineer", usd: "$3,000–$8,500", inr: "₹2.5L–₹7.2L" },
  { role: "AI Expert / Machine Learning", usd: "$6,000–$25,000", inr: "₹5.1L–₹21.2L" },
]

export default function DevelopmentTeamPricing() {
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
            Development team Pricing
          </h2>
          <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl px-4">
            Team-wise project investment
          </h3>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-lg font-medium px-4 leading-relaxed">
            Estimate the total investment required for dedicated roles over a standard project lifecycle (3–6 months).
          </p>
        </div>
 
        <div className="rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-black/5 overflow-hidden">
          {/* Header - Desktop Only */}
          <div className="hidden md:grid md:grid-cols-12 bg-gradient-to-r from-black via-zinc-900 to-black text-white px-6 py-5">
            <div className="col-span-6 text-sm font-bold uppercase tracking-wider">Specialized Role</div>
            <div className="col-span-3 text-sm font-bold uppercase tracking-wider text-center">Per Project (USD)</div>
            <div className="col-span-3 text-sm font-bold uppercase tracking-wider text-right">INR (approx.)</div>
          </div>
 
          <div className="divide-y divide-gray-100">
            {pricingData.map((item, index) => (
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
                      {item.role}
                    </span>
                  </div>
                </div>
 
                {/* USD Column */}
                <div className="col-span-3 mb-4 md:mb-0 md:text-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5 md:justify-center">
                      <DollarSign className="w-3.5 h-3.5 text-zinc-600" />
                      {item.usd}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter md:justify-center">
                      Estimated Project Cost
                    </span>
                  </div>
                </div>

                {/* INR Column */}
                <div className="col-span-3 text-left md:text-right">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-bold text-zinc-900 ring-1 ring-inset ring-black/10 group-hover:bg-black group-hover:text-white transition-all transform group-hover:scale-105">
                    {item.inr}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center p-8 rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50">
          <p className="text-gray-600 font-medium mb-6">
            Prices are estimates and may vary based on complexity, technology stack, and specific business logic.
          </p>
          <Link 
            href="#contact" 
          >
            <Button 
              className="rounded-full bg-black hover:bg-zinc-800 text-white px-8 py-6 text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Get a Custom Quote
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
