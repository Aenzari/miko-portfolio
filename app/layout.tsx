import type { Metadata } from 'next'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { SiteDataProvider } from '@/components/providers/SiteDataProvider'

export const metadata: Metadata = {
  title: 'Michael Angelou C. Quinit — Full-Stack Web Engineer & Database Systems Specialist',
  description: 'Bridging complex distributed data architectures with breathtaking, high-performance web applications. Academic major in Database Systems at MSU-IIT.',
  keywords: ['Full-Stack Developer', 'Junior Web Developer', 'Database Systems', 'Next.js', 'PostgreSQL', 'Neo4j', 'Redis', 'Supabase'],
  authors: [{ name: 'Michael Angelou C. Quinit' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#05080F] text-gray-100 antialiased overflow-x-hidden selection:bg-accent/40 selection:text-white">
        <SiteDataProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </SiteDataProvider>
      </body>
    </html>
  )
}
