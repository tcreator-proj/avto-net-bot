import {TgBot} from "./TgBot.js";
import TelegramBot, {SendBasicOptions} from "node-telegram-bot-api";

export class BotController {

  //@ts-ignore
  private botModule: TgBot;

  start(key: string) {
    this.botModule = new TgBot(key);
  }

  on(name: string, callback: (msg: TelegramBot.Message) => void ) {
    this.botModule.bot.on(name, callback);
  }

  onText(text: RegExp, callback: (msg: TelegramBot.Message) => void, options?: SendBasicOptions) {
    this.botModule.bot.onText(text, callback);
  }

  onStart(callback: (msg: TelegramBot.Message) => void, options?: SendBasicOptions) {
    this.onText(/\/start/, callback, options);
  }

  sendMessage(chatId: number, text: string, options?: SendBasicOptions): Promise<TelegramBot.Message> {
    return this.botModule.bot.sendMessage(chatId, text, options);
  }
}
