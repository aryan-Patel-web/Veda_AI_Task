import { create } from "zustand"

type UserProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type AuthState = {
  user: UserProfile | null
  status: "idle" | "loading" | "ready" | "error"
  setUser: (user: UserProfile | null) => void
  clearUser: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) => set({ user, status: "ready" }),
  clearUser: () => set({ user: null, status: "ready" }),
  loadUser: async () => {
    set({ status: "loading" })
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })
      if (response.status === 401) {
        set({ user: null, status: "ready" })
        return
      }
      if (!response.ok) {
        throw new Error("Failed to load user")
      }
      const payload = await response.json()
      set({ user: payload?.data || null, status: "ready" })
    } catch (error) {
      console.error(error)
      set({ status: "error" })
    }
  },
}))
