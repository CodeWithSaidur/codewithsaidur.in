import Link from "next/link"

interface FooterProps {
  name?: string
}

export default function Footer({ name = "Developer" }: FooterProps) {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">

          <p className="text-sm font-medium text-gray-500">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}
