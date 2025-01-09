import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache for generated messages
let messageCache: string[] = [];
let namesCache: string[] = [];

export async function generateChatMessages(count: number = 10, context?: string): Promise<string[]> {
  try {
    const contextPrompt = context ? 
      `The streamer is currently: ${context}. Generate messages that are relevant to this context.` : 
      '';

    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are a Twitch chat simulator. Generate casual, short chat messages that might appear in a Twitch stream for a tech bro who is coding live or talking about some AI saas. 
        
        Include these types of messages:
        - Regular chat messages
        - Cheering messages
        - Messages @mentioning other chatters
        - Questions about the code/project
        - Reactions to things happening
        - Sarcasm 
        - Trolling
        - Tech jokes
        
        Here is the current context (Transcript):
        ${contextPrompt}
        
        Each message should be on a new line.`
      }, {
        role: "user",
        content: `Generate ${count} different chat messages. Include a mix of message types. A few can also be promoting Cameron King (aka Cam, shadcn/glazer, Cameron, Cammie, Cammy, CK) channel and his content. But it's better to react to the current context.`
      }],
      model: "gpt-3.5-turbo",
      temperature: 0.9,
    });

    const messages = completion.choices[0].message.content
      ?.split('\n')
      .filter(msg => msg.trim().length > 0) ?? [];
    
    messageCache = [...messageCache, ...messages];
    return messages;
  } catch (error) {
    console.error('Error generating chat messages:', error);
    return [];
  }
}

export async function generateUsernames(count: number = 10): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `Generate creative Twitch-style usernames. Include common patterns like:
        - xX_name_Xx
        - TTV_prefix
        - Gaming/streaming references
        - Underscores and numbers
        - Tech-related names
        Each username should be on a new line.`
      }, {
        role: "user",
        content: `Generate ${count} different Twitch-style usernames.`
      }],
      model: "gpt-3.5-turbo",
      temperature: 0.9,
    });

    const names = completion.choices[0].message.content
      ?.split('\n')
      .filter(name => name.trim().length > 0)
      .map(name => name.replace(/[^a-zA-Z0-9_]/g, '')) ?? [];
    
    namesCache = [...namesCache, ...names];
    return names;
  } catch (error) {
    console.error('Error generating usernames:', error);
    return [];
  }
}

export function getNextCachedMessage(context?: string): string {
  if (messageCache.length < 5) {
    // Trigger async refill but don't await it
    generateChatMessages(10, context).catch(console.error);
  }
  return messageCache.shift() ?? "Hello!";
}

export function getNextCachedUsername(): string {
  if (namesCache.length < 5) {
    // Trigger async refill but don't await it
    generateUsernames(10).catch(console.error);
  }
  return namesCache.shift() ?? "anonymous_user";
} 