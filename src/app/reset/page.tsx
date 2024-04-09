"use client";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import { redirect } from "../../shared/redirect";
import styles from "../styles.module.css";
import resetStyles from "./reset.module.css";

export default function Reset() {
  const validateRefreshToken = () => {
    if (
      !localStorage.getItem("DT_Access_Token") ||
      !localStorage.getItem("DT_Refresh_Token")
    ) {
      localStorage.removeItem("DT_Access_Token");
      localStorage.removeItem("DT_Refresh_Token");
      localStorage.removeItem("DT_User");
      return;
    }

    api
      .post(
        "/refresh-token/new-access-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("DT_Refresh_Token")}`,
          },
        }
      )
      .then((response) => {
        localStorage.setItem("DT_Access_Token", response.data.accessToken);
        validateAccessToken();
      })
      .catch(() => {});
  };

  const validateAccessToken = () => {
    if (
      !localStorage.getItem("DT_Access_Token") ||
      !localStorage.getItem("DT_Refresh_Token")
    ) {
      localStorage.removeItem("DT_Access_Token");
      localStorage.removeItem("DT_Refresh_Token");
      localStorage.removeItem("DT_User");
      return;
    }

    api
      .get("/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
        },
      })
      .then((response) => {
        localStorage.setItem("DT_User", JSON.stringify(response.data));
        redirect("/");
      })
      .catch(() => {
        validateRefreshToken();
      });
  };

  useEffect(() => {
    if (
      !localStorage.getItem("DT_Access_Token") ||
      !localStorage.getItem("DT_Refresh_Token")
    ) {
      localStorage.removeItem("DT_Access_Token");
      localStorage.removeItem("DT_Refresh_Token");
      localStorage.removeItem("DT_User");
      return;
    }
    validateAccessToken();
  }, []);

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
