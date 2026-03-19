"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle, BookOpen } from "lucide-react"
import Footer from "@/components/Footer"

interface Course {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured: boolean
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [whatsapp, setWhatsapp] = useState<string>("")

  const faqs = [
    {
      q: "How do I enroll in a course?",
      a: "Simply click the 'Enroll Now' button on any course card to initiate a chat on WhatsApp, where we'll discuss the payment and enrollment process.",
    },
    {
      q: "Are these courses recorded or live?",
      a: "Most are self-paced with recorded high-quality videos, but we also offer live Q&A sessions and dedicated project review weeks for certain courses.",
    },
    {
      q: "Do you offer group discounts?",
      a: "Yes, for groups of 3 or more, we offer significant discounts. Please contact us via WhatsApp to get a custom quote.",
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

  return (
    <div className="min-h-screen bg-white">
      <main className="relative overflow-hidden pt-16 pb-24">
        {/* Background Decorations */}
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-3xl animate-blob" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-gradient-to-tl from-blue-100/40 to-teal-100/40 blur-3xl animate-blob animation-delay-2000" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-6">
                <BookOpen className="h-4 w-4" /> Comprehensive Learning
             </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Master New Skills with <br className="hidden sm:block" /> Our Professional Courses
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">Learn from industry experts and build real-world projects that get you hired.</p>
          </div>

          {/* Courses Grid */}
          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {isLoading ? (
              // Loading Skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-3xl border border-gray-100 bg-gray-50 animate-pulse" />
              ))
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className={`relative flex flex-col rounded-3xl border p-6 transition-all hover:translate-y-[-8px] hover:shadow-2xl ${
                    course.featured
                    ? "border-indigo-200 bg-white shadow-xl ring-1 ring-indigo-100"
                    : "border-gray-100 bg-white/50 backdrop-blur-sm"
                    }`}
                >
                  {course.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-xs font-bold text-white shadow-md uppercase tracking-wider">
                      Best Value
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3rem]">{course.name}</h3>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                        {isNaN(Number(course.price)) ? "" : "₹"}
                        {course.price}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-medium text-gray-500 line-clamp-3 h-[2.5rem]">{course.description}</p>
                  </div>

                  <div className="flex-1 space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-3">Course Highlights</p>
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-50 transition-colors">
                          <Check className="h-2.5 w-2.5 text-indigo-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-600 line-clamp-1 italic">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={whatsapp 
                      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in enrolling in the ${course.name} course. Can we discuss the next steps?`)}` 
                      : "/#contact"}
                    target={whatsapp ? "_blank" : "_self"}
                    rel={whatsapp ? "noopener noreferrer" : ""}
                    className="mt-6"
                  >
                    <Button
                      variant={course.featured ? "gradient" : "outline"}
                      className={`w-full h-10 rounded-xl text-sm font-bold shadow-lg ${!course.featured ? 'border-indigo-200 text-indigo-600 hover:bg-indigo-50' : ''}`}
                    >
                      {course.cta || "Enroll Now"}
                    </Button>
                  </a>
                </div>
              ))
            )}
            {courses.length === 0 && !isLoading && (
               <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed">
                  <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-xl font-bold text-gray-500">Coming Soon!</p>
                  <p className="text-gray-400">We are currently preparing some amazing courses for you.</p>
               </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-32">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Education FAQ</h2>
              <p className="mt-4 text-gray-500 italic">Clear your doubts before you start your learning journey.</p>
            </div>
            <div className="mx-auto mt-16 max-w-3xl space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md">
                  <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                    <HelpCircle className="h-5 w-5 text-indigo-500" />
                    {faq.q}
                  </h4>
                  <p className="mt-3 ml-8 font-medium text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </main>

      <Footer name="Saidur" />
    </div>
  )
}
