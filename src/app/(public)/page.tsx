import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Pricing } from '@/components/landing/Pricing'

export default function LandingPage() {
    return (
        <main className="flex flex-col items-center">
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
        </main>
    )
}
