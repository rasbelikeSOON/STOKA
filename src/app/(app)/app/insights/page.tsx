'use client'

import { useEffect, useState } from 'react'
import { InsightCard } from '@/components/insights/InsightCard'
import { toast } from 'sonner'
import { Filter } from 'lucide-react'

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadOnly, setUnreadOnly] = useState(false)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (unreadOnly) query.set('unread_only', 'true')

      const res = await fetch(`/api/insights?${query.toString()}`)
      const data = await res.json()
      setInsights(data.data || [])
    } catch (e) {
      toast.error("Failed to load insights")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [unreadOnly])

  const handleRead = async (id: string) => {
    try {
      await fetch(`/api/insights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true })
      })
      setInsights(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i))
    } catch (e) { /* silent fall */ }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/insights/${id}`, { method: 'DELETE' })
      setInsights(prev => prev.filter(i => i.id !== id))
      toast.success("Insight dismissed")
    } catch (e) { /* silent fail */ }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Smart recommendations based on your store's data.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition border ${unreadOnly ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50' : 'bg-white text-gray-700 border-gray-200 dark:bg-[#16191f] dark:text-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            <Filter className="w-4 h-4" />
            Unread Only
          </button>
          {/* Development utility to trigger cron */}
          {(process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) && (
            <button
              onClick={async () => {
                toast.loading("Generating insights...")
                await fetch('/api/cron/insights')
                fetchInsights()
                toast.success("Generation complete")
              }}
              className="text-xs text-gray-400 hover:text-gray-600 underline ml-2"
            >
              Run Cron (Dev)
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#16191f] rounded-xl border border-gray-200 dark:border-gray-800 border-dashed">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            No new insights right now. As sales and inventory change, Stoka will bubble up important alerts here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} onRead={handleRead} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
