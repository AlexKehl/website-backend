import { object, string } from 'joi';

export default object({
  email: string(),
  password: string(),
});
