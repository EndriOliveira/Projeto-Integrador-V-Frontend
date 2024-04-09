"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import logo from "../../assets/img/logo.png";
import { redirect } from "../../shared/redirect";
import makeToast from "../../shared/toaster";
import styles from "../styles.module.css";
import loginStyles from "./login.module.css";

export default function Login() {
  const emailLogin = React.useRef<HTMLInputElement>(null);
  const passwordLogin = React.useRef<HTMLInputElement>(null);

  const handleSignIn = () => {
    if (!emailLogin.current.value || !passwordLogin.current.value) {
      makeToast("error", "Preencha todos os campos!");
      return;
    }
    api
      .post("/auth/sign-in", {
        email: emailLogin.current.value,
        password: passwordLogin.current.value,
      })
      .then((response) => {
        makeToast("success", "Autenticado com sucesso!");
        localStorage.setItem("DT_Access_Token", response.data.accessToken);
        localStorage.setItem("DT_Refresh_Token", response.data.refreshToken);
        api
          .get("/auth/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "DT_Access_Token"
              )}`,
            },
          })
          .then((response) => {
            localStorage.setItem("DT_User", JSON.stringify(response.data));
          })
          .catch(() => {
            validateRefreshToken();
          });
        redirect("/");
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
          makeToast("error", "Erro ao autenticar usuário!");
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
      <div className={loginStyles.logo}>
        <Image src={logo} alt="Logo" />
      </div>
      <div className={loginStyles.loginContainer}>
        <div className={loginStyles.loginForm}>
          <h1 className={styles.title}>Login</h1>
          <div>
            <input
              className={styles.input}
              type="text"
              placeholder="E-mail"
              ref={emailLogin}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              ref={passwordLogin}
            />
            <a className={loginStyles.forgotPassword} href="/forget">
              Esqueci minha senha
            </a>
          </div>
          <button
            className={`${styles.button} ${loginStyles.button}`}
            onClick={handleSignIn}
          >
            Acessar
          </button>
        </div>
      </div>
    </div>
  );
}
