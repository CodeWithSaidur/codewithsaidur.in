import Link from "next/link"

interface FooterProps {
  name?: string
}

export default function Footer({ name = "Developer" }: FooterProps) {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-gray-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-blue-600 transition-colors">Projects</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
          </div>
          <p className="text-sm font-medium text-gray-400">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
