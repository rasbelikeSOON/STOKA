'use client'

import { useUIStore } from '@/stores/useUIStore'
import { X } from 'lucide-react'

export function ContextPanel({ children }: { children?: React.ReactNode }) {
    const { isContextPanelOpen, toggleContextPanel } = useUIStore()

    if (!isContextPanelOpen) return null

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Details</h2>
                    <button onClick={toggleContextPanel} className="text-gray-400 hover:text-gray-500 rounded-md p-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {children || <p className="text-sm text-gray-500 text-center mt-10">No context selected.</p>}
                </div>
            </div>
        </div>
    )
}
