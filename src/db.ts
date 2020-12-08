const Db = ({ mainDb }) => {
  const updateUser = async userObj => {
    try {
      const collection = mainDb.collection('users');
      await collection.updateOne(
        { _id: userObj.email },
        { $set: userObj },
        { upsert: true },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async email => {
    const collection = mainDb.collection('users');
    return await collection.findOne({ _id: { $eq: email } });
  };

  return { updateUser, getUser };
};

export default Db;
