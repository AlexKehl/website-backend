import { User, UserDoc } from '../model/User';

export const markEmailAsConfirmed = (email: string) => {
  return User.updateOne({ email }, { _isEmailConfirmed: true });
};

export const createUser = (user: UserDoc) => {
  return User.create(user);
};
