'use client'

import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export default function OnboardingPage() {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
            <OnboardingWizard />
        </div>
    )
}
