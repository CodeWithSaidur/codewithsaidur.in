"use client"

import { HelpCircle } from "lucide-react"

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

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Common Questions
          </h2>
          <h3 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h3>
        </div>
        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.q} 
              className="group rounded-3xl border border-zinc-100 bg-white p-8 transition-all hover:border-black hover:shadow-xl hover:shadow-black/5"
            >
              <h4 className="flex items-center gap-3 text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
                <HelpCircle className="h-5 w-5 text-zinc-400 group-hover:text-black" />
                {faq.q}
              </h4>
              <p className="mt-4 ml-8 font-medium text-zinc-600 text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
