export interface MovieGenre {
  id: number;
  name: string;
}

export interface WatchProvider {
  type: 'subscription' | 'rent' | 'buy';
  providerID: number;
  name: string;
}
