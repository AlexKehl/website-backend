process.env.NTBA_FIX_319 = 1 as any;
import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM } from '../../config';

let bot: TelegramBot;

export const startTelegramBot = () => {
  if (!TELEGRAM.TOKEN || !TELEGRAM.CHAT_ID) {
    throw new Error('Please specify token and chatId in config');
  }
  bot = new TelegramBot(TELEGRAM.TOKEN, { polling: true });
};

export const sendMessage = (text: string) => {
  if (!bot) {
    throw new Error('Bot needs to be started first');
  }
  bot.sendMessage(TELEGRAM.CHAT_ID, text);
};
