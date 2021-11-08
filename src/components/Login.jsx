import React from 'react';
import '../sass/main.scss';

const Login = (props) => {
  return (
    <div className="login-content">
    <section className="login-content__login-box">

      <aside className="login-box__banner">
        <p className="banner__titel">Broadseg access</p>
      </aside>

      <main className="login-box__main">

        <div className="main__greetings">
          <p>Hello,</p>
          <p>Welcome back!</p>
        </div>
        <form className="main__login-form" {...props} >

          <input type="text" placeholder="Username" className="login-form__username-input" name="username" required />

          <div className="login-form__pwd-field">
            <input type="password" placeholder="Password" className="pwd-field__pwd-input" name="password" required />
            <a href="/password/reset" className="pwd-field__pwd-reset">Forgot ?</a>
          </div>

          <div className="login-form__remmber-me">
            <label className="remmber-me__label">Remember me</label>
            <input type="checkbox" name="remember" className="remmber-me__checkbox" id="remember" />
          </div>

          <button type="submit" className="login-form__submit-btn">Login</button>
          <div className="loader" aria-busy="true" style={{ display: 'none' }}></div>
        </form>

      </main>

      <footer className="login-box__footer">
        <a className="footer__link-about" href="/about">About us</a>
        <a className="footer__link-policy" href="/policy">Policy</a>
        <a className="footer__link-home" href="/">Home</a>

      </footer>

    </section>
    </div>
  );
}

export default Login;
