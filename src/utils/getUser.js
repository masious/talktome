import CurrentUser from '../lib/Chat/CurrentUser';

export default function getUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }

  const userData = JSON.parse(userStr);

  return new CurrentUser(userData);
}
