export function KPIGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {children}
        </div>
    )
}
