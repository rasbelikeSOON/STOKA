import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null;
    businessId: string | null;
    role: 'owner' | 'manager' | 'staff' | null;
    setUser: (user: User | null) => void;
    setBusiness: (id: string, role: string) => void;
    clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    businessId: null,
    role: null,
    setUser: (user) => set({ user }),
    setBusiness: (businessId, role) => set({ businessId, role: role as 'owner' | 'manager' | 'staff' }),
    clear: () => set({ user: null, businessId: null, role: null }),
}))
