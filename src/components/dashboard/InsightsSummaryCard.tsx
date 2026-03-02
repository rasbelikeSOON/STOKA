import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function InsightsSummaryCard({ count }: { count: number }) {
    if (count === 0) return null

    return (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg leading-tight">{count} New {count === 1 ? 'Insight' : 'Insights'}</h3>
                        <p className="text-indigo-100 text-sm opacity-90">AI has detected patterns in your stock.</p>
                    </div>
                </div>

                <Link
                    href="/app/insights"
                    className="shrink-0 flex items-center justify-center p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    )
}
