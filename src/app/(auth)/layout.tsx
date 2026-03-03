export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[--surface-muted] py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-[--brand-primary] tracking-tight">Stoka</h1>
                <p className="mt-2 text-[--text-muted] font-medium italic">Inventory management you just talk to.</p>
            </div>
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-[--border] animate-in fade-in zoom-in duration-500">
                {children}
            </div>
            <div className="mt-8 text-center text-xs text-[--text-muted]">
                &copy; {new Date().getFullYear()} Stoka Inc. All rights reserved.
            </div>
        </div>
    )
}
