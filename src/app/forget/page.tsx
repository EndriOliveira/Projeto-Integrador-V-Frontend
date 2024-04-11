"use client";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import { redirect } from "../../shared/redirect";
import makeToast from "../../shared/toaster";
import styles from "../styles.module.css";
import forgetStyles from "./forget.module.css";

export default function Forget() {
  const email = React.useRef<HTMLInputElement>(null);

  const handleForgotPassword = () => {
    if (!email.current.value) {
      makeToast("error", "Preencha todos os campos!");
      return;
    }
    api
      .post("/auth/forgot-password", {
        email: email.current.value,
      })
      .then(() => {
        makeToast("success", "Acesse seu email para mais informações!");
        redirect("/reset");
      })
      .catch((error) => {
        if (
          error.response.data.message &&
          typeof error.response.data.message === "object"
        ) {
          makeToast(
            "error",
            `${error.response.data.message[0].path[0]} : ${error.response.data.message[0].message}`
          );
        } else if (
          error.response.data.message &&
          typeof error.response.data.message === "string"
        ) {
          makeToast("error", error.response.data.message);
        } else {
          makeToast("error", "Erro ao solicitar recuperação de senha!");
        }
      });
  };

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
              ref={email}
            />
            <button
              className={`${styles.darkButton} ${forgetStyles.button}`}
              onClick={handleForgotPassword}
            >
              Enviar código
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
