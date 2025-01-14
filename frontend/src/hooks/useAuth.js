import TokenService from '../services/auth.service.js';
const useAuth = () => {
  const user = TokenService.getUser('user');
  return user;
};

export default useAuth;
