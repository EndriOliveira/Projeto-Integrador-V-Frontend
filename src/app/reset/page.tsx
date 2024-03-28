import React from "react";
import styles from "../styles.module.css";
import resetStyles from "./reset.module.css";

export default function Reset() {
  return (
    <div className={styles.container}>
      <div className={resetStyles.resetContainer}>
        <h1 className={styles.title}>Alterar senha</h1>
        <div>
          <div className={resetStyles.form}>
            <input
              type="text"
              placeholder="Insira seu código de recuperação"
              className={`${styles.input} ${styles.lightInput} ${resetStyles.input} ${resetStyles.codeInput}`}
            />
            <input
              type="password"
              placeholder="Nova senha"
              className={`${styles.input} ${styles.lightInput} ${resetStyles.input}`}
            />
            <input
              type="password"
              placeholder="Confirme sua nova senha"
              className={`${styles.input} ${styles.lightInput} ${resetStyles.input}`}
            />
            <button className={`${styles.darkButton} ${resetStyles.button}`}>
              Alterar senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
