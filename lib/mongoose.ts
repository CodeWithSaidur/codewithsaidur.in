import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL!

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB() {
  // Check if we're in a build environment
  const isBuildTime = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV

  if (isBuildTime && !MONGODB_URI) {
    const error = new Error('Database connection skipped during build')
    ;(error as any).skipBuild = true
    throw error
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // Shorter timeout for faster failure during build
      connectTimeoutMS: 3000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    }).catch((err) => {
      cached.promise = null
      // Mark as build-time error if connection fails quickly
      if (isBuildTime) {
        const buildError = new Error('Database connection failed during build')
        ;(buildError as any).skipBuild = true
        throw buildError
      }
      throw err
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e: any) {
    cached.promise = null
    // If it's a connection error during build, mark it as skipBuild
    if (isBuildTime && (e.name === 'MongooseServerSelectionError' || e.message?.includes('MongoDB'))) {
      const buildError = new Error('Database connection failed during build')
      ;(buildError as any).skipBuild = true
      throw buildError
    }
    throw e
  }

  return cached.conn
}

export default connectDB
