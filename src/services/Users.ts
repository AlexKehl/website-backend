import { User, UserDoc } from '../model/User';

const findUser = (email: string) => {
  return User.findOne({ email }).exec();
};

const markEmailAsConfirmed = (email: string) => {
  return User.updateOne({ email }, { isEmailConfirmed: true });
};

const createUser = (user: UserDoc) => {
  return User.create(user);
};

export { findUser, markEmailAsConfirmed, createUser };
