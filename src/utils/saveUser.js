/* Saves current logged in user */
export default function saveUser (user) {
  const { _id, username, email, welcomeMessage, photoUrl, jwt } = user.data
  const userData = { _id, username, email, welcomeMessage, photoUrl, jwt }

  const userDataStr = JSON.stringify(userData)
  localStorage.setItem('user', userDataStr)
}
