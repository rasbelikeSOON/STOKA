import { ChatContainer } from '@/components/chat/ChatContainer'

export default function ChatPage() {
  return (
    <div className="h-full bg-white relative">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10 flex items-center px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-gray-900">Stoka AI</h1>
        <div className="ml-3 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-gray-500">Online</span>
        </div>
      </div>

      {/* Spacer for header */}
      <div className="h-14"></div>

      {/* Chat Area */}
      <div className="h-[calc(100vh-56px)] md:h-[calc(100vh-56px)]">
        <ChatContainer />
      </div>
    </div>
  )
}
