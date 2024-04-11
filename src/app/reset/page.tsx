"use client";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import { redirect } from "../../shared/redirect";
import makeToast from "../../shared/toaster";
import styles from "../styles.module.css";
import resetStyles from "./reset.module.css";

export default function Reset() {
  const code = React.useRef<HTMLInputElement>(null);
  const password = React.useRef<HTMLInputElement>(null);
  const confirmPassword = React.useRef<HTMLInputElement>(null);

  const handleResetPassword = () => {
    if (
      !code.current.value ||
      !password.current.value ||
      !confirmPassword.current.value
    ) {
      makeToast("error", "Preencha todos os campos!");
      return;
    }

    if (password.current.value !== confirmPassword.current.value) {
      makeToast("error", "As senhas não coincidem!");
      return;
    }

    api
      .post("/auth/reset-password", {
        code: code.current.value,
        password: password.current.value,
        passwordConfirmation: confirmPassword.current.value,
      })
      .then(() => {
        makeToast("success", "Senha alterada com sucesso!");
        redirect("/login");
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
          makeToast("error", "Erro ao solicitar atualização de senha!");
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
      <div className={resetStyles.resetContainer}>
        <h1 className={styles.title}>Alterar senha</h1>
        <div>
          <div className={resetStyles.form}>
            <input
              type="text"
              placeholder="Insira seu código de recuperação"
              className={`${styles.input} ${styles.lightInput} ${resetStyles.input} ${resetStyles.codeInput}`}
              ref={code}
            />
            <input
              type="password"
              placeholder="Nova senha"
              className={`${styles.input} ${styles.lightInput} ${resetStyles.input}`}
              ref={password}
            />
            <input
              type="password"
              placeholder="Confirme sua nova senha"
              className={`${styles.input} ${styles.lightInput} ${resetStyles.input}`}
              ref={confirmPassword}
            />
            <button
              className={`${styles.darkButton} ${resetStyles.button}`}
              onClick={handleResetPassword}
            >
              Alterar senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
