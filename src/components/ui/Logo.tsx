import Link from 'next/link'

export function Logo({ className = '' }: { className?: string }) {
    return (
        <Link href="/" className={`font-bold text-xl tracking-tight text-blue-600 ${className}`}>
            Stoka
        </Link>
    )
}
