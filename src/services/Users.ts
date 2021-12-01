import { User, UserDoc } from '../model/User';

const findUser = async (email: string): Promise<UserDoc> => {
  return User.findOne({ email }).lean()!;
};

const markEmailAsConfirmed = (email: string) => {
  return User.updateOne({ email }, { _isEmailConfirmed: true });
};

const createUser = (user: UserDoc) => {
  return User.create(user);
};

export { findUser, markEmailAsConfirmed, createUser };
