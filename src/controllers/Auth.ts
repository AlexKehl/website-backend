import { login, register } from '../services/Auth';
import { Controller } from '../types';
import { evaluateHttpObject } from '../utils/HttpResponses';
import { LoginDto } from '../../common/interface/Dto';

const registerController: Controller<LoginDto> = async ({ req, res }) => {
  evaluateHttpObject(res, await register(req.body));
};

const loginController: Controller<LoginDto> = async ({ req, res }) => {
  evaluateHttpObject(res, await login(req.body));
};

export { registerController, loginController };
