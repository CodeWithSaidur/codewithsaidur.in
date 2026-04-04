"use client"

import { useState } from "react"
import { Search, CheckCircle2, Calculator, ArrowRight, ExternalLink, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const services = [
  { name: "Domain Name (.com) + SSL", cost: 932, type: "fixed" }, 
  { name: "Web Hosting (Cloud/VPS)", cost: 3333, type: "fixed" }, 
  { name: "Managed Database (Atlas/PlanetScale)", cost: 12000, type: "fixed" },
  { name: "Cloud Storage (AWS S3/GCS)", cost: 4500, type: "fixed" },
  { name: "File Processing (PDF/Image/Compression)", cost: 6000, type: "usage" },
  { name: "User Auth & Security (Clerk/Auth0)", cost: 24000, type: "usage" },
  { name: "Email Infrastructure (Resend/SendGrid)", cost: 14000, type: "usage" },
  { name: "SMS & WhatsApp API (Twilio/Meta)", cost: 22000, type: "usage" },
  { name: "Payment Gateway (2.9% / transaction)", cost: 12000, type: "usage" },
  { name: "Dynamic Maps & Geocoding (Google/Mapbox)", cost: 8000, type: "usage" },
  { name: "AI Integration (GPT-4o/Claude APIs)", cost: 18000, type: "usage" },
  { name: "Video Processing & CDN (Mux/AWS)", cost: 42000, type: "usage" },
  { name: "Advanced Analytics (Mixpanel/Amplitude)", cost: 15000, type: "usage" },
  { name: "High-Performance Search (Algolia)", cost: 12000, type: "usage" },
  { name: "Logging & Observability (BetterStack)", cost: 7500, type: "usage" },
  { name: "Customer Support (Loom/Intercom/Zendesk)", cost: 28000, type: "usage" },
];

export default function ThirdPartyServiceCosts() {
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [expectedUsers, setExpectedUsers] = useState(1000)
  const [domainQuery, setDomainQuery] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [availability, setAvailability] = useState<{ available: boolean; domain: string } | null>(null)

  const getServiceCost = (service: typeof services[0]) => {
    if (service.type === "fixed") return service.cost
    // Usage-based cost scaling (assuming base cost is for 1000 users)
    const factor = Math.max(1, expectedUsers / 1000)
    return Math.round(service.cost * factor)
  }

  const checkDomain = async () => {
    // ... (rest of checkDomain)
    let query = domainQuery.trim()
    if (!query) return

    if (!query.toLowerCase().endsWith('.com') && !query.toLowerCase().endsWith('.in')) {
      query += '.com'
      setDomainQuery(query)
    }

    setIsChecking(true)
    setAvailability(null)

    try {
      const response = await fetch(`/api/check-domain?domain=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (!data.error) {
        setAvailability({ available: data.available, domain: data.domain })
      }
    } catch (err) {
      console.error("Domain check error:", err)
    } finally {
      setIsChecking(false)
    }
  }

  const toggleService = (index: number) => {
    setSelectedServices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const calculateTotal = () => {
    return selectedServices.reduce((acc, index) => {
      return acc + getServiceCost(services[index])
    }, 0)
  }

  const total = calculateTotal()

  return (
    <section id="third-party-costs" className="relative overflow-hidden py-24 bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50/50 -skew-x-12 translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center lg:text-left lg:flex lg:items-end lg:justify-between">
          <div className="lg:max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 px-4 lg:px-0">
              Infrastructure Costs
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-black sm:text-5xl px-4 lg:px-0">
              Third-party service costs
            </h3>
          </div>
          <div className="mt-8 lg:mt-0 px-4 lg:px-0">
            <p className="text-zinc-600 font-medium max-w-md">
              Estimate your ongoing operational expenses for third-party tools and platforms.
            </p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Domain Search & Selection */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              {/* Domain Search */}
              <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-1 transition-all hover:border-black hover:shadow-xl hover:shadow-black/5">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                    {isChecking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </div>
                  <Input
                    type="text"
                    placeholder="Find your perfect domain name..."
                    className="border-0 bg-transparent text-lg font-bold placeholder:text-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={domainQuery}
                    onChange={(e) => setDomainQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkDomain()}
                  />
                  <Button
                    onClick={checkDomain}
                    disabled={isChecking || !domainQuery}
                    className="flex rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold h-12 px-4 sm:px-6 disabled:opacity-50 shrink-0"
                  >
                    Check
                  </Button>
                </div>
              </div>

              {/* Expected Users Input */}
              <div className="rounded-3xl border border-zinc-100 bg-zinc-50/50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-black uppercase tracking-wider">Projected Monthly Users</label>
                    <p className="text-xs text-zinc-500 font-medium">Costs will scale based on this number (min 1,000)</p>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <Input
                      type="number"
                      value={expectedUsers}
                      onChange={(e) => setExpectedUsers(parseInt(e.target.value) || 0)}
                      onBlur={() => {
                        if (expectedUsers < 1000) setExpectedUsers(1000)
                      }}
                      className="bg-white border-zinc-200 rounded-2xl font-bold text-center h-12 focus:border-black transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold pointer-events-none text-xs">
                      Users
                    </div>
                  </div>
                </div>
              </div>

              {availability && (
                <div className={`mt-4 flex items-center gap-3 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 ${availability.available
                  ? "bg-green-50 border border-green-100 text-green-700"
                  : "bg-red-50 border border-red-100 text-red-700 font-bold"
                  }`}>
                  {availability.available ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase tracking-tight">
                        {availability.domain} is available for registration!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase tracking-tight">
                        {availability.domain} is already taken
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Services Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service, index) => {
                const currentCost = getServiceCost(service)
                return (
                  <div
                    key={index}
                    onClick={() => toggleService(index)}
                    className={`cursor-pointer group flex items-center justify-between rounded-2xl border p-4 transition-all ${selectedServices.includes(index)
                      ? "border-black bg-black text-white shadow-lg scale-[1.02]"
                      : "border-zinc-100 bg-zinc-50 hover:border-black hover:bg-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${selectedServices.includes(index)
                        ? "border-white bg-white text-black"
                        : "border-zinc-300 bg-white group-hover:border-black"
                        }`}>
                        {selectedServices.includes(index) && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{service.name}</span>
                        {service.type === "usage" && (
                          <span className={`text-[9px] font-bold uppercase tracking-tight ${selectedServices.includes(index) ? "text-zinc-400" : "text-zinc-500"}`}>
                            Usage Based
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${selectedServices.includes(index) ? "text-white" : "text-black"
                        }`}>
                        ₹{currentCost.toLocaleString()}
                      </div>
                      <div className={`text-[10px] font-medium uppercase opacity-60`}>
                        per year
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Calculator Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 rounded-3xl border border-black bg-black p-8 text-white shadow-2xl shadow-black/20 overflow-hidden">
              {/* Abstract pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <h4 className="text-xl font-bold">Estimated Total</h4>
                </div>

                <div className="space-y-6">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-6">
                    <span className="text-zinc-400 font-medium">Annual Projection</span>
                    <div className="text-right">
                      <span className="text-4xl font-extrabold tracking-tighter">
                        ₹{total.toLocaleString()}
                      </span>
                      <span className="ml-2 text-zinc-400 font-bold">/yr</span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedServices.length === 0 ? (
                      <p className="text-sm text-zinc-500 italic">No services selected. Click on services to calculate your cost.</p>
                    ) : (
                      selectedServices.map(index => {
                        const currentCost = getServiceCost(services[index])
                        return (
                          <div key={index} className="flex items-center justify-between group">
                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                              {services[index].name}
                            </span>
                            <span className="text-sm font-bold text-white">
                              ₹{currentCost.toLocaleString()}
                              <span className="text-[10px] text-zinc-500 font-medium ml-1">
                                /yr
                              </span>
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className="pt-6">
                    <Button
                      variant="outline"
                      className="w-full h-14 rounded-2xl border-white/20 bg-white/5 hover:bg-white hover:text-black font-bold text-white transition-all group"
                    >
                      Discuss with me
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
                    Costs scaled for {expectedUsers.toLocaleString()} monthly active users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
