import { BuyImageDto } from '../../common/interface/Dto';
import { createStripeSession } from '../services/Stripe/Checkout';
import { handleWebHook } from '../services/Stripe/Webhooks';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

export const checkoutController: Controller<BuyImageDto> = async ({
  req,
  res,
}) => {
  evaluateHttpObject(res, await createStripeSession(req.body));
};

export const webHookController: Controller<any> = async ({ req, res }) => {
  evaluateHttpObject(res, await handleWebHook(req.headers, req.body));
};
