import { BuyImageDto } from '../../common/interface/Dto';
import { createStripeSession } from '../services/Payments';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

const checkoutController: Controller<BuyImageDto> = async ({ req, res }) => {
  evaluateHttpObject(res, await createStripeSession(req.body));
};

export { checkoutController };
