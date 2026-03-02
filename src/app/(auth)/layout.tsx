export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Stoka</h1>
                </div>
                {children}
            </div>
        </div>
    )
}
