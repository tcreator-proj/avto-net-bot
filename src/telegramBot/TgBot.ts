import TelegramBot from 'node-telegram-bot-api';

export class TgBot {
  readonly bot: TelegramBot;
  constructor(key: string) {
    this.bot = new TelegramBot(key, {
      polling: {
        interval: 300,
        autoStart: true
      }
    });
  }
}