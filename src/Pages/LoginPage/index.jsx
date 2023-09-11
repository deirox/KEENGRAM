import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUserStore } from "../../store/useUserStore";

const LoginPage = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const setAuthorizedUser = useUserStore((state) => state.setAuthorizedUser);
  const getAuthorizedUser = useUserStore((state) => state.getAuthorizedUser);
  const authorizedUserData = useUserStore((state) => state.authorizedUserData);

  const navigate = useNavigate();

  useEffect(() => {
    if (authorizedUserData.isAuth) {
      navigate("/");
    }
  }, []);

  const isBtnDisabled = () => {
    if (emailValue.length > 0 && passwordValue.length > 5) {
      return false;
    }
    return true;
  };

  const handleLogin = async (email, password) => {
    try {
      const auth = getAuth();
      const { user } = await setPersistence(auth, browserLocalPersistence).then(
        () => {
          return signInWithEmailAndPassword(auth, email, password);
        }
      );
      setAuthorizedUser({
        uid: user.uid,
        accessToken: user.accessToken,
        email: user.email,
      });
      getAuthorizedUser(user);
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode: ", errorCode, "errorMessage: ", errorMessage);
    }
  };
  const onFormSubmit = (e) => {
    e.preventDefault();
    handleLogin(emailValue, passwordValue);
  };

  return (
    <div className={styles.login_page__root}>
      <div className={styles.login_page__wrapper}>
        <div className={styles.login_page__box}>
          <div className={styles.login_page__logo}>
            <img src="/img/logo.png" alt="black logo keengram" />
          </div>
          <form
            className={styles.login_page__form}
            onSubmit={(e) => onFormSubmit(e)}
          >
            {/* <label className="_aa48">
              <span className="_aa4a">Пароль</span>
              <input
                className={styles.login_page__form__input}
                placeholder="Имя пользователя"
                type="text"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                aria-required={true}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </label> */}
            <input
              className={styles.login_page__form__input}
              placeholder="Эл.адрес"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              aria-required={true}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <input
              className={styles.login_page__form__input}
              placeholder="Пароль"
              type="password"
              minLength={5}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              aria-required={true}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <button
              className={styles.login_page__form__btn}
              type="submit"
              disabled={isBtnDisabled()}
            >
              Войти
            </button>
          </form>
        </div>
        <div className={styles.login_page__box}>
          <p>
            У вас ещё нет аккаунта?{" "}
            <Link to="/accounts/emailsignup">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
