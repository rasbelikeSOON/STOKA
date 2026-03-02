export default function PrivacyPage() {
    return (
        <div className="py-24 px-4 max-w-3xl mx-auto prose prose-blue">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: March 2, 2026</p>

            <h3>1. Data Collection</h3>
            <p>We collect information you provide directly to us when you create an account, update your profile, use our chat interface, or communicate with us.</p>

            <h3>2. Use of Information</h3>
            <p>We use the information we collect to operate, maintain, and improve our services, communicate with you, and personalize your experience.</p>

            <h3>3. AI Processing</h3>
            <p>Your chat input is processed by Anthropic's Claude API to extract inventory intents. No PII is used to train open models.</p>
        </div>
    )
}
