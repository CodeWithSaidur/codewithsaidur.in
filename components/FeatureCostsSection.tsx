"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Calculator, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [features, setFeatures] = useState<FeatureCost[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([])
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
          setFeatures(data)
        }
      })
      .catch(err => console.error("Error fetching feature costs:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const parseCost = (costStr: string) => {
    const num = parseInt(costStr.replace(/[^0-9]/g, ""))
    return isNaN(num) ? 0 : num
  }

  const toggleFeature = (index: number) => {
    setSelectedFeatures(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const calculateTotal = () => {
    return selectedFeatures.reduce((acc, index) => {
      return acc + parseCost(features[index].inrCost)
    }, 0)
  }

  const total = calculateTotal()

  return (
    <section id="dev-pricing" className="relative overflow-hidden py-24 bg-zinc-50/50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-white -skew-x-12 -translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center lg:text-left lg:flex lg:items-end lg:justify-between">
          <div className="lg:max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 px-4 lg:px-0">
              Feature-wise Project Investment
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-black sm:text-5xl px-4 lg:px-0">
              Build your custom project
            </h3>
          </div>
          <div className="mt-8 lg:mt-0 px-4 lg:px-0">
            <p className="text-zinc-600 font-medium max-w-md">
              Select the features and modules you need to get an instant estimate of your total project investment.
            </p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Feature Selection */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-200/60" />
                ))
              ) : (
                features.map((feature, index) => {
                  const isSelected = selectedFeatures.includes(index)
                  return (
                    <div
                      key={index}
                      onClick={() => toggleFeature(index)}
                      className={`cursor-pointer group flex flex-col justify-between rounded-2xl border p-5 transition-all ${isSelected
                        ? "border-black bg-black text-white shadow-lg scale-[1.02]"
                        : "border-zinc-200 bg-white hover:border-black hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`flex mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${isSelected
                          ? "border-white bg-white text-black"
                          : "border-zinc-300 bg-white group-hover:border-black"
                          }`}>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold leading-snug">{feature.name}</span>
                        </div>
                      </div>
                      <div className="text-left ml-8 mt-auto">
                        <div className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${isSelected ? "bg-white/20 text-white border border-white/10" : "bg-zinc-100 text-zinc-900 border border-zinc-200"
                          }`}>
                          ₹{feature.inrCost}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            
            <div className="mt-8 text-center sm:text-left bg-white p-6 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-xs text-zinc-500 font-medium">
                Prices are estimates and may vary based on specific business logic, tech stack, and overall complexity.
              </p>
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
                  <h4 className="text-xl font-bold">Estimated Investment</h4>
                </div>

                <div className="space-y-6">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-6">
                    <span className="text-zinc-400 font-medium">Project Total</span>
                    <div className="text-right">
                      <span className="text-4xl font-extrabold tracking-tighter">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedFeatures.length === 0 ? (
                      <p className="text-sm text-zinc-500 italic">No features selected. Click on modules to customize your project estimate.</p>
                    ) : (
                      selectedFeatures.map(index => {
                        const feature = features[index]
                        return (
                          <div key={index} className="flex flex-col group py-1 border-b border-white/5 last:border-0">
                            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors mb-1">
                              {feature.name}
                            </span>
                            <span className="text-sm font-bold text-white">
                              ₹{feature.inrCost}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <a
                      href={whatsapp
                        ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I've calculated an estimated project investment of ₹${total.toLocaleString()} using the feature builder and would like to get a finalized custom quote.`)}`
                        : "#contact"}
                      target={whatsapp ? "_blank" : "_self"}
                      rel={whatsapp ? "noopener noreferrer" : ""}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-white/20 bg-white/5 hover:bg-white hover:text-black font-bold text-white transition-all group"
                      >
                        Request Final Quote
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>

                  <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
                    One-time development cost
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
