'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    ShoppingCart,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    AlertCircle,
    CheckCircle2,
    Package
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

interface ConfirmationCardProps {
    data: any // The aiResponse metadata blob containing confirmation_card block
    onConfirm: (data: any) => void
}

export function ConfirmationCard({ data, onConfirm }: ConfirmationCardProps) {
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // The new LLM schema returns everything nicely packaged in 'confirmation_card'
    const card = data.confirmation_card || {}
    const actionType = data.pending_action?.type || 'UNKNOWN'

    const isSale = actionType === 'RECORD_SALE'
    const isPurchase = actionType === 'RECORD_PURCHASE'

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            await onConfirm(data)
            setIsConfirmed(true)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isConfirmed) {
        return (
            <Card className="bg-emerald-50 border-emerald-100 p-4 flex items-center gap-3 animate-in zoom-in duration-300">
                <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-bold text-emerald-900">Action Confirmed</h4>
                    <p className="text-sm text-emerald-700">Database updated successfully.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-0 overflow-hidden shadow-lg border-[--border] bg-white animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Header */}
            <div className={cn(
                "px-4 py-3 flex items-center justify-between border-b",
                isSale ? "bg-emerald-50 border-emerald-100" :
                    isPurchase ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"
            )}>
                <div className="flex items-center gap-2">
                    {isSale ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> :
                        isPurchase ? <ShoppingCart className="h-4 w-4 text-blue-600" /> :
                            <RefreshCcw className="h-4 w-4 text-gray-600" />}
                    <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isSale ? "text-emerald-700" : isPurchase ? "text-blue-700" : "text-gray-700"
                    )}>
                        {card.title || 'Confirm Action'}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
                {card.summary_lines?.map((line: any, idx: number) => (
                    <div key={idx} className={cn(
                        "flex items-center justify-between py-2",
                        idx !== card.summary_lines.length - 1 ? "border-b border-dashed border-gray-100" : ""
                    )}>
                        <span className="text-sm text-[--text-muted] font-medium">{line.label}</span>
                        <span className="font-bold text-[--text-primary] text-right">{line.value}</span>
                    </div>
                ))}

                {card.uncertainty_flags?.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-yellow-800 space-y-1">
                            {card.uncertainty_flags.map((flag: string, i: number) => <p key={i}>{flag}</p>)}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 h-10 bg-white border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:text-blue-600 transition-all active:scale-95"
                    onClick={() => toast.info('Feature coming soon: Refine details in the input box!')}
                    disabled={isLoading}
                >
                    {card.cancel_button_label || 'Edit'}
                </Button>
                <Button
                    className={cn(
                        "flex-[2] h-10 shadow-lg font-black text-white uppercase tracking-tighter active:scale-[0.98] transition-all",
                        isSale ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800" : "bg-[#1D4ED8] hover:bg-blue-700 active:bg-blue-800"
                    )}
                    onClick={handleConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (card.confirm_button_label || 'Confirm Action')}
                </Button>
            </div>
        </Card>
    )
}
