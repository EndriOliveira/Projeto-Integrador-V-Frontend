"use client";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import { redirect } from "../../shared/redirect";
import styles from "../styles.module.css";
import forgetStyles from "./forget.module.css";

export default function Forget() {
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
