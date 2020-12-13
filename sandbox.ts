import { config } from 'dotenv';
import { connect } from 'mongoose';
import UserModel from './src/model/User';

config();

export const main = async () => {
  // await connect(
  //   `mongodb://${process.env.DB_URL}`,
  //   { dbName: 'main' },
  // );
  // const newUser = new UserModel({
  //   email: 'testUser3',
  // });
  // const email = 'testUser3';
  //
  // const foundUser = await UserModel.updateOne(
  //   { email },
  //   { refreshToken: '42' },
  // );

  //
  // const foundUser = await UserModel.findOne({ email: 'testUser3' });

  // const res = await newUser.updateOne(
  //   { email: 'testUser3' },
  //   { $set: R.omit(['_id'], itemToPut) },
  // );

  // console.log(foundUser);
  console.log(process.env.ACCESS_TOKEN_SECRET);
};

main();
