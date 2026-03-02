import { create } from 'zustand'

interface UIState {
    isSidebarOpen: boolean;
    activeMobileTab: string;
    isContextPanelOpen: boolean;
    toggleSidebar: () => void;
    setMobileTab: (tab: string) => void;
    toggleContextPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: false,
    activeMobileTab: 'chat',
    isContextPanelOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setMobileTab: (tab) => set({ activeMobileTab: tab }),
    toggleContextPanel: () => set((state) => ({ isContextPanelOpen: !state.isContextPanelOpen })),
}))
