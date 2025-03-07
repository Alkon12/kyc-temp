import { create } from 'zustand'

interface BackofficeLoginModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useBackofficeLoginModal = create<BackofficeLoginModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useBackofficeLoginModal
