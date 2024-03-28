import React from "react";
import styles from "../styles.module.css";
import forgetStyles from "./forget.module.css";

export default function Forget() {
  return (
    <div className={styles.container}>
      <div className={forgetStyles.forgetContainer}>
        <h1 className={styles.title}>Esqueci minha senha</h1>
        <div>
          <div className={forgetStyles.form}>
            <input
              type="email"
              placeholder="Insira seu e-mail"
              className={`${styles.input} ${styles.lightInput} ${forgetStyles.input}`}
            />
            <button className={`${styles.darkButton} ${forgetStyles.button}`}>
              Enviar código
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
