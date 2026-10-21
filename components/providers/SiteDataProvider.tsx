'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface SiteConfigState {
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

export const DEFAULT_SITE_CONFIG: SiteConfigState = {
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

interface SiteContextType {
  config: SiteConfigState
  updateConfig: (newConfig: Partial<SiteConfigState>) => void
}

const SiteContext = createContext<SiteContextType>({
  config: DEFAULT_SITE_CONFIG,
  updateConfig: () => {}
})

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfigState>(DEFAULT_SITE_CONFIG)

  useEffect(() => {
    async function fetchLiveConfig() {
      try {
        const res = await fetch('/api/public/config')
        if (res.ok) {
          const data = await res.json()
          if (data.config) {
            setConfig((prev) => ({ ...prev, ...data.config }))
          }
        }
      } catch {
        // graceful static fallback
      }
    }
    fetchLiveConfig()
  }, [])

  const updateConfig = (newConfig: Partial<SiteConfigState>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  return (
    <SiteContext.Provider value={{ config, updateConfig }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSiteConfig() {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteDataProvider')
  }
  return context
}
