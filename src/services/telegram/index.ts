process.env.NTBA_FIX_319 = 1 as any;
import TelegramBot from 'node-telegram-bot-api';
import Stripe from 'stripe';
import { TELEGRAM } from '../../../config';
import { findGalleryImage } from '../../model/GalleryImage';
import { findOrderImageForPaymentIntent } from '../../model/OrderImage';
import { formatImageBuyedMessage } from './Formatting';

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
  bot.sendMessage(TELEGRAM.CHAT_ID, text, { parse_mode: 'HTML' });
};

export const sendImageBuyedMessage = async (event: Stripe.Event) => {
  const order = await findOrderImageForPaymentIntent(event);
  const correspondingImages = await Promise.all(
    order.itemIds.map((itemId) => findGalleryImage(itemId))
  );
  const messages = correspondingImages.map((image) =>
    formatImageBuyedMessage(order, image)
  );
  messages.forEach(sendMessage);
};
