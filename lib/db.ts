import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'Data')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR)
}

export class JsonDB<T extends { id?: string; _id?: string }> {
  private filePath: string

  constructor(collectionName: string) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`)
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2))
    }
  }

  private read(): T[] {
    const data = fs.readFileSync(this.filePath, 'utf-8')
    return JSON.parse(data)
  }

  private write(data: T[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2))
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    let data = this.read()
    if (Object.keys(filter).length > 0) {
      data = data.filter(item => {
        return Object.entries(filter).every(([key, value]) => (item as any)[key] === value)
      })
    }
    return data
  }

  async findOne(filter: Partial<T> = {}): Promise<T | null> {
    const data = await this.find(filter)
    return data.length > 0 ? data[0] : null
  }

  async findById(id: string): Promise<T | null> {
    const data = this.read()
    return data.find(item => item.id === id || item._id === id) || null
  }

  async create(item: Omit<T, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const data = this.read()
    const now = new Date().toISOString()
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      _id: crypto.randomUUID(), // Keep _id for compatibility
      createdAt: now,
      updatedAt: now,
    } as unknown as T
    data.push(newItem)
    this.write(data)
    return newItem
  }

  async findByIdAndUpdate(id: string, update: Partial<T>, options: { new?: boolean } = {}): Promise<T | null> {
    const data = this.read()
    const index = data.findIndex(item => item.id === id || item._id === id)
    if (index === -1) return null

    const updatedItem = {
      ...data[index],
      ...update,
      updatedAt: new Date().toISOString(),
    }
    data[index] = updatedItem
    this.write(data)
    return updatedItem
  }

  async findByIdAndDelete(id: string): Promise<boolean> {
    const data = this.read()
    const newData = data.filter(item => item.id !== id && item._id !== id)
    if (newData.length === data.length) return false
    this.write(newData)
    return true
  }

  // To match Project.find().sort(...)
  async findSorted(sort: { [key: string]: number }): Promise<T[]> {
    const data = this.read()
    const [key, direction] = Object.entries(sort)[0]
    return data.sort((a, b) => {
      const valA = (a as any)[key]
      const valB = (b as any)[key]
      if (valA < valB) return direction === -1 ? 1 : -1
      if (valA > valB) return direction === -1 ? -1 : 1
      return 0
    })
  }
}

export const db = {
  projects: new JsonDB<any>('projects'),
  profiles: new JsonDB<any>('profiles'),
  skills: new JsonDB<any>('skills'),
  techStacks: new JsonDB<any>('techstacks'),
  admins: new JsonDB<any>('admins'),
}
