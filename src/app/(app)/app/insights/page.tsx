'use client'

import { useEffect, useState } from 'react'
import { InsightCard } from '@/components/insights/InsightCard'
import { toast } from 'sonner'
import { Filter, Sparkles, RefreshCw, Brain } from 'lucide-react'

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [generating, setGenerating] = useState(false)

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
    } catch (e) { /* silent */ }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/insights/${id}`, { method: 'DELETE' })
      setInsights(prev => prev.filter(i => i.id !== id))
      toast.success("Insight dismissed")
    } catch (e) { /* silent */ }
  }

  const runCron = async () => {
    setGenerating(true)
    toast.loading("Analyzing your data...")
    try {
      await fetch('/api/cron/insights')
      await fetchInsights()
      toast.dismiss()
      toast.success("Analysis complete — new insights generated!")
    } catch {
      toast.dismiss()
      toast.error("Failed to generate insights")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-[--brand-primary] uppercase tracking-[0.2em] mb-3">
            <Brain className="w-3 h-3" />
            AI-Powered
          </div>
          <h1 className="text-4xl font-black text-[--text-primary] tracking-tight">Insights</h1>
          <p className="mt-2 text-[--text-muted] font-medium max-w-xl text-sm leading-relaxed">
            Smart recommendations powered by your store's real-time data.
            Stock alerts, trend analysis, and revenue milestones — all automated.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`h-12 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${unreadOnly ? 'bg-[--brand-primary]/10 text-[--brand-primary] border-[--brand-primary]/30' : 'bg-white text-[--text-muted] border-[--border] hover:text-[--text-primary]'}`}
          >
            <Filter className="w-4 h-4" />
            Unread
          </button>
          <button
            onClick={runCron}
            disabled={generating}
            className="h-12 px-8 bg-[#1D4ED8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1e40af] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            Analyze Now
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-[--border] animate-pulse" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-[--border]">
          <div className="h-16 w-16 bg-[--brand-primary]/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-[--brand-primary] rotate-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-[--text-primary] tracking-tight mb-2">All clear!</h3>
          <p className="text-sm text-[--text-muted] font-medium max-w-sm mx-auto leading-relaxed">
            No new insights right now. As sales and inventory change, Stoka will automatically surface important alerts here.
          </p>
          <button
            onClick={runCron}
            disabled={generating}
            className="mt-8 h-12 px-8 bg-[#1D4ED8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1e40af] transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            Run Analysis
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} onRead={handleRead} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
