import { create } from 'zustand';

interface Dialog {
  action: null | Action;
  setAction: (action: Action | null) => void;
}

export enum Action {
  Searching,
  Listing,
  Reviewing,
}

export const useDialog = create<Dialog>((set) => ({
  action: null,
  setAction: (action) => set({ action }),
}));
