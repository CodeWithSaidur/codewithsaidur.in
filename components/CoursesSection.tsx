"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, BookOpen, Clock, User } from "lucide-react"

interface Course {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [whatsapp, setWhatsapp] = useState<string>("")

  const faqs = [
    {
      q: "Is there any prerequisite for these courses?",
      a: "Requirements vary by course, but most are designed for beginners to intermediate learners. Specific prerequisites are listed in the course details.",
    },
    {
      q: "Will I get a certificate?",
      a: "Yes, upon successful completion of the course and its projects, you will receive a certificate of completion.",
    },
    {
      q: "Is there any support available during the course?",
      a: "Absolutely! You'll have access to a dedicated community/mentor support for any questions or roadblocks you face.",
    },
  ]

  useEffect(() => {
    // Fetch courses
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           setCourses(data)
        }
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
  }, [])

  if (isLoading) {
    return (
      <section id="courses" className="py-24 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 mx-auto rounded-full" />
          <div className="h-12 w-96 bg-gray-200 mx-auto rounded-lg" />
        </div>
      </section>
    )
  }

  if (courses.length === 0) return null

  return (
    <section id="courses" className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gray-50/50">
      <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-gradient-to-br from-indigo-100/30 to-purple-100/30 blur-3xl animate-blob" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center px-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Level Up Your Skills
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto font-medium">Join our comprehensive courses and master modern technologies.</p>
        </div>

        {/* Courses Grid */}
        <div className="mt-12 md:mt-20 grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative flex flex-col rounded-3xl border p-4 md:p-6 transition-all hover:translate-y-[-8px] hover:shadow-2xl ${
                course.featured
                  ? "border-indigo-200 bg-white shadow-xl ring-1 ring-indigo-100"
                  : "border-gray-100 bg-white/50 backdrop-blur-sm"
              }`}
            >
              {course.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                  BEST VALUE
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                   <BookOpen className="h-4 w-4 text-indigo-600" />
                   <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
                </div>
                <div className="mt-3 flex items-baseline">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {isNaN(Number(course.price)) ? "" : "₹"}
                    {course.price}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-gray-500 line-clamp-3">{course.description}</p>
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">What's included</p>
                {course.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                      <Check className="h-2.5 w-2.5 text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 italic">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href={whatsapp 
                  ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in enrolling in the ${course.name} course. Can you provide more details?`)}` 
                  : "/#contact"}
                target={whatsapp ? "_blank" : "_self"}
                rel={whatsapp ? "noopener noreferrer" : ""}
                className="mt-6"
              >
                <Button
                  variant={course.featured ? "gradient" : "outline"}
                  className={`w-full h-10 rounded-xl text-sm font-bold shadow-lg ${!course.featured ? 'border-indigo-100 text-indigo-600 hover:bg-indigo-50' : ''}`}
                >
                  {course.cta || "Enroll Now"}
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-32">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Course FAQs</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md">
                <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
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
