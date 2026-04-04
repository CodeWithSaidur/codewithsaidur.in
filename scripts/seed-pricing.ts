import mongoose from 'mongoose'
import Pricing from '../models/Pricing'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL!

const plans = [
  {
    name: "Starter Package",
    price: "15,000",
    description: "Perfect for personal brands and small businesses looking for a professional presence.",
    features: [
      "Up to 5 Responsive Pages",
      "Basic SEO Optimization",
      "Contact Form Integration",
      "WhatsApp Chat Integration",
      "1 Month Free Support",
      "Social Media Linking"
    ],
    cta: "Start Your Brand",
    featured: false,
    order: 1
  },
  {
    name: "Business Growth",
    price: "45,000",
    description: "Full-featured e-commerce or business platform designed to scale your operations.",
    features: [
      "Unlimited Products/Pages",
      "Payment Gateway Integration",
      "Admin Dashboard / CMS",
      "Sales Analytics & Tracking",
      "Email Marketing Setup",
      "3 Months Premium Support",
      "Fast Page Load Speed"
    ],
    cta: "Scale Your Business",
    featured: true,
    order: 2
  },
  {
    name: "Enterprise Custom",
    price: "1,20,000",
    description: "Complex SaaS, AI-driven applications, or custom enterprise solutions built from scratch.",
    features: [
      "Custom SaaS Architecture",
      "AI / Machine Learning Integration",
      "Scalable Cloud Backend",
      "Advanced Security Protocols",
      "Dedicated Project Manager",
      "12 Months Tech Support",
      "Performance Optimization"
    ],
    cta: "Build Your Vision",
    featured: false,
    order: 3
  }
]

async function main() {
  if (!MONGODB_URI) {
    throw new Error('Please define the DATABASE_URL environment variable in .env')
  }

  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clear existing pricing to avoid duplicates if re-running
  await Pricing.deleteMany({})
  console.log('Cleared existing pricing plans')

  const createdPlans = await Pricing.insertMany(plans)
  console.log(`Successfully seeded ${createdPlans.length} pricing plans!`)
}

main()
  .then(async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error('Error seeding pricing:', e)
    await mongoose.connection.close()
    process.exit(1)
  })
