import { Role } from '../../common/interface/Constants';
import { User } from '../model/User';

const hasRole = async (email: string, role: Role) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  return user.roles.includes(role);
};

export { hasRole };
