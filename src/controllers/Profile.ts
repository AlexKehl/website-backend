import { getUserInfo } from '../services/Profile';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';

export const getContactInformationController: Controller = async ({
  req,
  res,
}) => {
  evaluateHttpObject(res, await getUserInfo(req.query.email as string));
};
