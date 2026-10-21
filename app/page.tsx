import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { AboutProfile } from '@/components/AboutProfile'
import { TechStack } from '@/components/TechStack'
import { DatabaseParadigmExplorer } from '@/components/DatabaseParadigmExplorer'
import { Projects } from '@/components/Projects'
import { EngineeringStandards } from '@/components/EngineeringStandards'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { CustomCursor } from '@/components/CustomCursor'

export default function Home() {
  return (
    <main className="relative selection:bg-accent/40 selection:text-white bg-[#05080F]">
      <CustomCursor />
      <Navbar />
      <Hero />
      <AboutProfile />
      <TechStack />
      <DatabaseParadigmExplorer />
      <Projects />
      <EngineeringStandards />
      <Contact />
      <Footer />
    </main>
  )
}
