import { faker } from "@faker-js/faker";
import { Badge, MessageModel, User, Cheer } from "./models";
import { getNextCachedMessage, getNextCachedUsername } from './openaiHelper';

export const generateMessage = (options?: {
  content?: string;
  author?: User;
  context?: string;
}): MessageModel => {
  const isAction = options?.content ? 
    options.content.startsWith('/me ') : 
    Math.random() < 0.1; // 10% chance of action messages

  const content = options?.content ?? generateRandomSentence(options?.context);
  
  // Parse cheers if present
  const cheers = parseCheerBits(content);

  return {
    id: faker.datatype.uuid(),
    author: options?.author ?? generateUser(),
    content: content,
    cheers,
    isAction,
    timestamp: Date.now(),
  };
};

export const generateUser = (): User => {
  const subTier = Math.random() < 0.3 ? // 30% chance of being a subscriber
    (Math.random() < 0.8 ? 1 : Math.random() < 0.8 ? 2 : 3) : 
    undefined;

  return {
    rgbColor: faker.internet.color(250, 250, 250),
    username: getNextCachedUsername(),
    badges: generateRandomBadges(),
    subscriber: subTier ? {
      months: Math.floor(Math.random() * 24) + 1,
      tier: subTier as 1 | 2 | 3,
    } : undefined,
  };
};

const generateRandomBadges = (): Badge[] => {
  const badges: Badge[] = [];
  
  if (Math.random() < 0.1) badges.push("moderator");
  if (Math.random() < 0.1) badges.push("vip");
  if (Math.random() < 0.2) badges.push("prime");
  if (Math.random() < 0.15) badges.push("bits");
  if (Math.random() < 0.3) badges.push("subscriber");
  if (Math.random() < 0.05) badges.push("founder");

  return badges;
};

function parseCheerBits(content: string): Cheer[] {
  const cheerRegex = /Cheer(\d+)/g;
  const cheers: Cheer[] = [];
  let match;
  
  while ((match = cheerRegex.exec(content)) !== null) {
    cheers.push({
      bits: parseInt(match[1]),
      positions: [[match.index, match.index + match[0].length - 1]]
    });
  }
  
  return cheers;
}

const generateRandomSentence = (context?: string) => {
  return getNextCachedMessage(context);
};

/**
 * Returns a random interval between 2-15 seconds, with a 20% chance of a "burst" mode
 * where messages come more frequently
 */
export function getRandomInterval(): number {
  const isBurst = Math.random() < 0.2; // 20% chance of burst mode
  
  if (isBurst) {
    // During burst mode, return between 0.5 to 3 seconds
    return Math.floor(Math.random() * 2500) + 500;
  } else {
    // Normal mode: return between 2 to 15 seconds
    return Math.floor(Math.random() * 13000) + 2000;
  }
}
