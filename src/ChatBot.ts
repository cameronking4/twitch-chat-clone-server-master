import { Server } from "socket.io";
import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";
import { generateMessage } from "./helpers";
import { generateChatMessages, generateUsernames } from './openaiHelper';

export default class ChatBot {
  private readonly MIN_DELAY_SECONDS = 0;
  private readonly MAX_DELAY_SECONDS = 4;
  private readonly BURST_CHANCE = 0.45; // 15% chance of burst messages
  private readonly BURST_MIN_MESSAGES = 3;
  private readonly BURST_MAX_MESSAGES = 10;

  private socket: Server;
  private scheduler: ToadScheduler;
  private currentJobId: number = 0;
  private lastMessageTime: number = Date.now();
  private currentContext?: string;

  constructor(socket: Server) {
    this.socket = socket;
    this.scheduler = new ToadScheduler();
    // Preload some messages and usernames
    this.preloadMessages();
  }

  private async preloadMessages() {
    try {
      await Promise.all([
        generateChatMessages(20),
        generateUsernames(20)
      ]);
    } catch (error) {
      console.error('Error preloading messages:', error);
    }
  }

  private getRandomDelay(): number {
    return Math.floor(
      Math.random() * (this.MAX_DELAY_SECONDS - this.MIN_DELAY_SECONDS) + 
      this.MIN_DELAY_SECONDS
    );
  }

  private async sendBurstMessages() {
    const messageCount = Math.floor(
      Math.random() * (this.BURST_MAX_MESSAGES - this.BURST_MIN_MESSAGES) + 
      this.BURST_MIN_MESSAGES
    );

    for (let i = 0; i < messageCount; i++) {
      const botMessage = generateMessage({ context: this.currentContext });
      this.socket.emit("new-message", botMessage);
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    }
  }

  private scheduleNextMessage() {
    // Clear existing job if any
    if (this.currentJobId) {
      this.scheduler.removeById(this.currentJobId.toString());
    }

    const task = new Task("emit bot message", () => {
      // Decide if this should be a burst of messages
      if (Math.random() < this.BURST_CHANCE) {
        this.sendBurstMessages();
      } else {
        const botMessage = generateMessage({ context: this.currentContext });
        this.socket.emit("new-message", botMessage);
      }

      // Schedule the next message with a new random delay
      const nextDelay = this.getRandomDelay();
      if (this.currentJobId) {
        this.scheduler.removeById(this.currentJobId.toString());
      }
      this.currentJobId++;
      const newJob = new SimpleIntervalJob({ seconds: nextDelay }, task, this.currentJobId.toString());
      this.scheduler.addSimpleIntervalJob(newJob);
    });

    this.currentJobId++;
    const job = new SimpleIntervalJob({ seconds: this.getRandomDelay() }, task, this.currentJobId.toString());
    this.scheduler.addSimpleIntervalJob(job);
  }

  public start() {
    this.scheduleNextMessage();
  }

  public stop() {
    if (this.currentJobId) {
      this.scheduler.removeById(this.currentJobId.toString());
    }
    this.scheduler.stop();
  }

  public setContext(context: string) {
    this.currentContext = context;
  }

  public getCurrentContext(): string | undefined {
    return this.currentContext;
  }
}
