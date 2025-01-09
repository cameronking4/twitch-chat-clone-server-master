import { EmoteData } from './constants/emotes';

export type Badge = "moderator" | "vip" | "prime" | "turbo" | "subscriber" | "bits" | "founder";

export interface Cheer {
  bits: number;
  positions: [number, number][]; // Start and end positions in the message
}

export interface User {
  rgbColor: string;
  username: string;
  badges: Badge[];
  subscriber?: {
    months: number;
    tier: 1 | 2 | 3;
  };
}

export type MessageModel = {
  id: string;
  author: User;
  content: string;
  cheers?: Cheer[];
  isAction?: boolean; // For /me messages
  timestamp: number;
};
