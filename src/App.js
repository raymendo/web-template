import { API_URL } from "./config";
import Login from "./components/Login";
import UserPage from "./components/UserPage";

const auth = {
  get isLogin() {
    const jwt = window.localStorage.getItem('jwt')
    let user = window.localStorage.getItem('user')

    try {
      user = JSON.parse(user) ?? '';
    } catch(err) { return false }

    if (typeof jwt === 'string' && typeof user === 'object') {
      return Object.keys(user).includes('id') &&
        Object.keys(user).includes('username')
    }
    return false;
  }
}

void (auth && Login);

function App() {
  function handleSubmit(ev) {
    ev.preventDefault()

    const button = ev.target.querySelector('[type=submit]')
    const loader = document.querySelector('[aria-busy=true]')

    button.style = 'display: none'
    loader.style = 'display: inline-block'

    fetch(API_URL + '/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: ev.target['username'].value,
        password: ev.target['password'].value
      })
    })
    .then(
      res => {
        if (!res.ok) {
          throw res.json()
        }
        return res.json()
      })
      .then(data => {
        window.localStorage.setItem('jwt', JSON.stringify(data.jwt))
        window.localStorage.setItem('user', JSON.stringify(data.user))
        window.location.replace('/')
      })
      .catch(err => {
        if (err.then)
          err.then(content => {
            document.getElementById('error').innerHTML = `
            <p>${content.message[0].messages[0].message}</p>
            `
          })
        else {
          document.getElementById('error').innerHTML = `
          <p>${err.message}</p>
          `
        }
      })
      .finally(() => {
        button.style = 'display: inline-block';
        loader.style = 'display: none'
      })
  }
  if (window.location.pathname === '/login')
    return <Login onSubmit={handleSubmit} />

  if (auth.isLogin) {
    return <UserPage />
  } else {
    window.location.pathname = '/login'
  }
}

export default App;
