import Image from "next/image";
import React from "react";
import logo from "../../assets/img/logo.png";
import styles from "../styles.module.css";
import loginStyles from "./login.module.css";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={loginStyles.logo}>
        <Image src={logo} alt="Logo" />
      </div>
      <div className={loginStyles.loginContainer}>
        <div className={loginStyles.loginForm}>
          <h1 className={styles.title}>Login</h1>
          <div>
            <input className={styles.input} type="text" placeholder="E-mail" />
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
            />
            <a className={loginStyles.forgotPassword} href="/forget">
              Esqueci minha senha
            </a>
          </div>
          <button className={`${styles.button} ${loginStyles.button}`}>
            Acessar
          </button>
        </div>
      </div>
    </div>
  );
}
