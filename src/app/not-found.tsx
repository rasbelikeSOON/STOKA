import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] p-4 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200 dark:border-blue-900/50">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link href="/app/dashboard" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm">
                Return to Dashboard
            </Link>
        </div>
    )
}
