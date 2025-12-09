import { create } from 'zustand';

export const useProfileStore = create((set) => ({
  activeComponent: null,
  showComponent: (component) => set({ activeComponent: component }),
  hideComponent: () => set({ activeComponent: null }),
}));