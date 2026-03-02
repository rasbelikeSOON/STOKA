import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = {
    title: 'Stoka | AI Inventory Management',
    description: 'Manage your inventory completely via chat using Stoka AI.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    // We use standard light mode only for the landing page
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 font-sans selection:text-blue-900 flex flex-col antialiased">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
