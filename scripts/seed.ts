import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from '../models/Admin'

const MONGODB_URI = process.env.DATABASE_URL!

async function main() {
  if (!MONGODB_URI) {
    throw new Error('Please define the DATABASE_URL environment variable')
  }

  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await Admin.findOneAndUpdate(
    { email: adminEmail },
    {
      email: adminEmail,
      password: hashedPassword,
    },
    {
      upsert: true,
      new: true,
    }
  )

  console.log('Admin created/updated:', admin.email)
}

main()
  .then(async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await mongoose.connection.close()
    process.exit(1)
  })
