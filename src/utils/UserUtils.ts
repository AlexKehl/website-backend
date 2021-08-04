import { User } from '../model/User';
import { Role } from '../types';

const hasRole = async (email: string, role: Role) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  return user.roles.includes(role);
};

export { hasRole };
