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

            <h2 className="text-2xl font-bold text-gray-900">You're all set!</h2>

            {!isDone ? (
                <>
                    <p className="mt-2 text-sm text-gray-600">
                        Let's see how Stoka works. Hit send to test your first chat transaction.
                    </p>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left my-6 mx-auto max-w-sm shadow-inner shadow-gray-100">
                        <p className="text-sm font-medium italic text-gray-800">
                            "I just bought 50 boxes of paracetamol for ₦200 each"
                        </p>
                    </div>

                    <button
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
