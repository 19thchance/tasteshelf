export interface Dialog {
  action: null | Action;
  setAction: (action: Action | null) => void;
}

export enum Action {
  Searching,
  Listing,
  Reviewing,
}

export enum ReviewingStep {
  Review,
  Email,
  Code,
}
