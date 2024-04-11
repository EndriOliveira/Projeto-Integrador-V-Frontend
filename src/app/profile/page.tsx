"use client";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import Header from "../../components/header";
import { User } from "../../interfaces/User";
import makeToast from "../../shared/toaster";
import styles from "../styles.module.css";
import profileStyles from "./profile.module.css";

export default function Profile() {
  const [user, setUser] = React.useState<User>(null);
  const password = React.useRef<HTMLInputElement>(null);
  const newPassword = React.useRef<HTMLInputElement>(null);
  const confirmNewPassword = React.useRef<HTMLInputElement>(null);

  const handleChangePassword = () => {
    if (
      !password.current.value ||
      !newPassword.current.value ||
      !confirmNewPassword.current.value
    ) {
      makeToast("error", "Preencha todos os campos!");
      return;
    }

    if (newPassword.current.value !== confirmNewPassword.current.value) {
      makeToast("error", "As senhas não coincidem!");
      return;
    }

    api
      .put(
        "/auth/change-password",
        {
          password: password.current.value,
          newPassword: newPassword.current.value,
          newPasswordConfirmation: confirmNewPassword.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
          },
        }
      )
      .then(() => {
        makeToast("success", "Senha alterada com sucesso!");
        password.current.value = "";
        newPassword.current.value = "";
        confirmNewPassword.current.value = "";
      })
      .catch((error) => {
        if (
          error.response.data.message &&
          typeof error.response.data.message === "object"
        ) {
          makeToast("error", `${error.response.data.message[0].message}`);
        } else if (
          error.response.data.message &&
          typeof error.response.data.message === "string"
        ) {
          makeToast("error", error.response.data.message);
        } else {
          makeToast("error", "Erro ao alterar senha!");
        }
      });
  };

  useEffect(() => {
    setUser(
      localStorage.getItem("DT_User")
        ? JSON.parse(localStorage.getItem("DT_User"))
        : null
    );
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={`${styles.card} ${profileStyles.card}`}>
          <div>
            <h2 className={styles.title}>Perfil</h2>
            <hr />
          </div>
          <div className={profileStyles.rows}>
            <div className={`${profileStyles.row} ${profileStyles.firstRow}`}>
              <p>Nome: {user?.name}</p>
              <p>Email: {user?.email}</p>
              <p>
                CPF:{" "}
                {user?.cpf.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/,
                  "$1.$2.$3-$4"
                )}
              </p>
              <p>
                Data de nascimento:{" "}
                {new Date(user?.birthDate).toLocaleDateString()}
              </p>
              <p>
                Telefone:{" "}
                {user?.phone.replace(
                  /(\d{2})(\d{2})(\d{5})(\d{4})/,
                  "+$1 ($2) $3-$4"
                )}
              </p>
              <p>Departamento: {user?.department}</p>
              <p>
                Banco de horas: {user?.hourBalance.toString().replace("-", "")}{" "}
                minutos{" "}
                <span
                  className={
                    user?.hourBalance < 0 ? styles.negative : styles.positive
                  }
                >
                  {user?.hourBalance < 0 ? "negativos" : "positivos"}
                </span>
              </p>
            </div>
            <div className={`${profileStyles.row} ${profileStyles.secondRow}`}>
              <h2 className={`${styles.title} ${profileStyles.title}`}>
                Alterar senha
              </h2>
              <div className={profileStyles.form}>
                <input
                  className={`${styles.input} ${profileStyles.input}`}
                  type="password"
                  placeholder="Senha Atual"
                  ref={password}
                />
                <input
                  className={`${styles.input} ${profileStyles.input}`}
                  type="password"
                  placeholder="Nova Senha"
                  ref={newPassword}
                />
                <input
                  className={`${styles.input} ${profileStyles.input}`}
                  type="password"
                  placeholder="Confirme a Senha"
                  ref={confirmNewPassword}
                />
              </div>
              <button
                className={`${styles.button} ${profileStyles.button}`}
                onClick={handleChangePassword}
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
