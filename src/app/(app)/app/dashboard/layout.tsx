export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // We use standard 'dark' class applied to the container so only the dashboard is dark mode
    // The global app layout remains light mode default.
    return (
        <div className="dark bg-gray-50 dark:bg-[#0f1115] min-h-full">
            <div className="max-w-7xl mx-auto pb-12">
                {children}
            </div>
        </div>
    )
}
