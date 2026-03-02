export async function sendInvite(email: string, token: string, businessName: string) {
    // In a real application, you would use a service like Resend, SendGrid, or Supabase's built-in email service to send this template.

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const inviteLink = `${appUrl}/invite/${token}`

    console.log(`
    === INVITATION EMAIL ===
    To: ${email}
    Subject: You have been invited to join ${businessName} on Stoka
    
    Hi there,
    
    You've been invited to join ${businessName}'s workspace on Stoka, the AI-powered conversational inventory management platform.
    
    Accept your invitation here:
    ${inviteLink}
    
    If you did not expect this invitation, you can safely ignore this email.
    ========================
  `)

    return { success: true }
}
