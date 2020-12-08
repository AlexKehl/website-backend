import * as mongodb from 'mongodb';
const Db = ({ mainDb }: { mainDb: mongodb.Db }) => {
  const updateUser = async (user: { email: string }) => {
    try {
      const collection = mainDb.collection('users');
      await collection.updateOne(
        { _id: user.email },
        { $set: user },
        { upsert: true },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async (email: string) => {
    const collection = mainDb.collection('users');
    return await collection.findOne({ _id: { $eq: email } });
  };

  return { updateUser, getUser };
};

export default Db;
