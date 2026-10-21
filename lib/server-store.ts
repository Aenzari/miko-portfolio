import fs from 'fs'
import path from 'path'
import { PROJECTS_WITH_ARCH } from './projects-data'

export interface ServerProject {
  id: string
  slug: string
  name: string
  tagline: string
  stack: string[]
  category: string
  featured: boolean
  db_heavy: boolean
  demo_url?: string
  repo_url?: string
  display_order: number
}

export interface ServerSiteConfig {
  first_name: string
  last_name: string
  nickname: string
  brand_name: string
  brand_subtitle: string
  title: string
  specialization: string
  status_pill: string
  hook: string
  city: string
  email: string
  github_url: string
  linkedin_url: string
  onlinejobs_url: string
  resume_url: string
  avatar_url?: string
  bio?: string
  coordinates?: string
}

export interface ServerInquiry {
  id: string
  name: string
  email: string
  company?: string
  message: string
  is_read: boolean
  created_at: string
}

export interface StoreData {
  config: ServerSiteConfig
  projects: ServerProject[]
  inquiries: ServerInquiry[]
}

const STORE_PATH = path.join(process.cwd(), 'data', 'store.json')

export const DEFAULT_CONFIG: ServerSiteConfig = {
  first_name: 'Michael Angelou',
  last_name: 'C. Quinit',
  nickname: 'Miko / Mayk',
  brand_name: '//MAYK',
  brand_subtitle: 'SYSTEMS ARCHITECT',
  title: 'Full-Stack Web Engineer & Database Systems Specialist',
  specialization: 'BS Information Technology · Database Systems Major (MSU-IIT)',
  status_pill: 'Available for Junior / Full-Stack Roles',
  hook: 'Bridging complex distributed data architectures with breathtaking, high-performance user interfaces.',
  city: 'Iligan City, Philippines',
  email: 'michaelquinit@gmail.com',
  github_url: 'https://github.com/mikoquinit',
  linkedin_url: 'https://linkedin.com/in/mikoquinit',
  onlinejobs_url: 'https://www.onlinejobs.ph/jobseekers/info/michaelquinit',
  resume_url: '/resume.pdf',
  avatar_url: '',
  bio: '4th-year BS Information Technology student majoring in Database Systems at Mindanao State University – Iligan Institute of Technology (MSU-IIT). I engineer high-performance web applications that bridge mission-critical database architectures (Postgres ACID serializable transactions, Neo4j graph topologies, and Redis in-memory caches) with fluid, 60 FPS user interfaces. I build resilient software with architectural discipline, clean state management, and production-tested data integrity.',
  coordinates: '8.2280° N, 124.2452° E · ILIGAN CITY'
}

export function getDefaultProjects(): ServerProject[] {
  return PROJECTS_WITH_ARCH.map((p, index) => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return {
      id: slug,
      slug,
      name: p.name,
      tagline: p.tagline,
      stack: p.stack,
      category: p.category,
      featured: !!p.featured,
      db_heavy: !!p.dbHeavy,
      demo_url: p.demoUrl || '',
      repo_url: p.repoUrl || '',
      display_order: index + 1
    }
  })
}

export function getStore(): StoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8')
      const parsed = JSON.parse(raw) as Partial<StoreData>

      // Validate projects array is not empty
      const projects = (parsed.projects && parsed.projects.length > 0)
        ? parsed.projects
        : getDefaultProjects()

      const config: ServerSiteConfig = {
        ...DEFAULT_CONFIG,
        ...(parsed.config || {})
      }

      const inquiries = parsed.inquiries || []

      return { config, projects, inquiries }
    }
  } catch (err) {
    console.error('Failed to read store.json, re-initializing:', err)
  }

  // Fallback to fresh defaults
  const fresh: StoreData = {
    config: { ...DEFAULT_CONFIG },
    projects: getDefaultProjects(),
    inquiries: [
      {
        id: 'sample-inquiry-1',
        name: 'Alex Rivera (Tech Lead @ DataScale)',
        email: 'alex@datascale.io',
        company: 'DataScale Systems',
        message: 'Loved your EpiGraph Neo4j vector visualization and PostgreSQL ACID escrow architecture. Are you available for a Junior Full-Stack Engineer role?',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ]
  }

  saveStore(fresh)
  return fresh
}

export function saveStore(store: StoreData): void {
  try {
    const dir = path.dirname(STORE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save store.json:', err)
  }
}

export function getConfig(): ServerSiteConfig {
  return getStore().config
}

export function updateConfig(updates: Partial<ServerSiteConfig>): ServerSiteConfig {
  const store = getStore()
  store.config = { ...store.config, ...updates }
  saveStore(store)
  return store.config
}

export function getProjects(): ServerProject[] {
  const store = getStore()
  return store.projects.sort((a, b) => a.display_order - b.display_order)
}

export function createProject(project: Omit<ServerProject, 'id' | 'display_order'> & { id?: string; display_order?: number }): ServerProject {
  const store = getStore()
  const slug = project.slug || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const id = project.id || `${slug}-${Date.now()}`
  const newProject: ServerProject = {
    ...project,
    id,
    slug,
    display_order: project.display_order ?? (store.projects.length + 1)
  }

  store.projects.push(newProject)
  saveStore(store)
  return newProject
}

export function updateProject(id: string, updates: Partial<ServerProject>): ServerProject | null {
  const store = getStore()
  const index = store.projects.findIndex((p) => p.id === id || p.slug === id)
  if (index === -1) return null

  store.projects[index] = { ...store.projects[index], ...updates }
  saveStore(store)
  return store.projects[index]
}

export function deleteProject(id: string): boolean {
  const store = getStore()
  const initialLen = store.projects.length
  store.projects = store.projects.filter((p) => p.id !== id && p.slug !== id)
  if (store.projects.length !== initialLen) {
    saveStore(store)
    return true
  }
  return false
}

export function resetProjectsToDefault(): ServerProject[] {
  const store = getStore()
  store.projects = getDefaultProjects()
  saveStore(store)
  return store.projects
}

export function getInquiries(): ServerInquiry[] {
  const store = getStore()
  return store.inquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function addInquiry(inquiry: Omit<ServerInquiry, 'id' | 'is_read' | 'created_at'>): ServerInquiry {
  const store = getStore()
  const newInq: ServerInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    is_read: false,
    created_at: new Date().toISOString()
  }
  store.inquiries.unshift(newInq)
  saveStore(store)
  return newInq
}

export function updateInquiry(id: string, updates: Partial<ServerInquiry>): ServerInquiry | null {
  const store = getStore()
  const index = store.inquiries.findIndex((i) => i.id === id)
  if (index === -1) return null

  store.inquiries[index] = { ...store.inquiries[index], ...updates }
  saveStore(store)
  return store.inquiries[index]
}

export function deleteInquiry(id: string): boolean {
  const store = getStore()
  const initialLen = store.inquiries.length
  store.inquiries = store.inquiries.filter((i) => i.id !== id)
  if (store.inquiries.length !== initialLen) {
    saveStore(store)
    return true
  }
  return false
}
