'use client'

import { useState } from 'react'
import { StepBusinessInfo } from './StepBusinessInfo'
import { StepCurrencyLocation } from './StepCurrencyLocation'
import { StepFirstChat } from './StepFirstChat'

export function OnboardingWizard() {
    const [step, setStep] = useState(1)
    const [businessData, setBusinessData] = useState<any>({})

    const nextStep = (data?: any) => {
        if (data) {
            setBusinessData((prev: any) => ({ ...prev, ...data }))
        }
        setStep((s) => s + 1)
    }

    return (
        <div className="max-w-xl mx-auto py-12 w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full min-w-[320px]">
                {step === 1 && <StepBusinessInfo onNext={nextStep} />}
                {step === 2 && <StepCurrencyLocation onNext={nextStep} data={businessData} />}
                {step === 3 && <StepFirstChat />}
            </div>
        </div>
    )
}
