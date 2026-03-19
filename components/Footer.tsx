"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TeamMember {
  id: string
  name: string
  designation: string
  image: string
}

interface FooterProps {
  name?: string
}

export default function Footer({ name = "Developer" }: FooterProps) {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    fetch("/api/team-members")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembers(data)
        }
      })
      .catch((err) => console.error("Error fetching team members:", err))
  }, [])

  return (
    <footer className="w-full">





      {/* Basic Footer */}
      <div className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-10 sm:flex-row">
            <div className="flex flex-col items-center gap-4 sm:items-start">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <div 
                        key={member.id} 
                        className="group relative h-12 w-12 cursor-pointer transition-transform hover:z-30 hover:scale-110"
                      >
                        {/* Designation Tooltip */}
                        <div className="invisible absolute -top-12 left-1/2 z-50 -translate-x-1/2 translate-y-2 transform rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap shadow-xl">
                          {member.designation}
                          {/* Triangle indicator */}
                          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
                        </div>

                        {/* Name Tooltip (smaller, below) */}
                        <div className="invisible absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 -translate-y-1 transform rounded bg-blue-600 px-2 py-1 text-[10px] font-black text-white opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
                          {member.name}
                        </div>

                        <div className="h-full w-full overflow-hidden rounded-full border-2 border-white bg-gray-50 shadow-sm ring-1 ring-gray-100">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="h-full w-full object-cover grayscale-[0.2] transition-all group-hover:grayscale-0" 
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback placeholders if no members found
                    [1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 animate-pulse" />
                    ))
                  )}
                </div>
              </div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
                Devs and Designers Team
              </p>
            </div>
            
            <p className="text-sm font-medium text-gray-400">
              © {new Date().getFullYear()} {name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
