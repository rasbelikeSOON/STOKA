'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, MessageSquare } from 'lucide-react'

export function StepFirstChat() {
    const router = useRouter()
    const [isSimulating, setIsSimulating] = useState(false)
    const [isDone, setIsDone] = useState(false)

    const handleSimulate = () => {
        setIsSimulating(true)
        setTimeout(() => {
            setIsSimulating(false)
            setIsDone(true)
        }, 2000)
    }

    const finish = () => {
        // Navigate straight to the chat area after onboarding finishes
        window.location.href = '/app/chat'
    }

    return (
        <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {isDone ? (
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                ) : (
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">You're ready to fly!</h2>

            {!isDone ? (
                <>
                    <p className="mt-3 text-gray-600 leading-relaxed max-w-sm mx-auto">
                        Managing stock should be as easy as sending a text. Try it out now—send a test message to see the magic.
                    </p>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-left my-8 mx-auto max-w-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <MessageSquare className="w-12 h-12" />
                        </div>
                        <p className="text-sm font-medium text-blue-900 italic leading-relaxed">
                            "I just bought 50 boxes of paracetamol for ₦200 each"
                        </p>
                    </div>

                    <button
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                    >
                        {isSimulating ? 'Processing with AI...' : 'Send Test Message'}
                    </button>
                </>
            ) : (
                <>
                    <p className="mt-2 text-sm text-gray-600">
                        Stoka AI instantly parsed that into a transaction! You're ready to start building your inventory.
                    </p>

                    <button
                        onClick={finish}
                        className="w-full flex justify-center py-2 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Go to My Workspace
                    </button>
                </>
            )}
        </div>
    )
}
