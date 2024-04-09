"use client";
import React, { useEffect } from "react";
import { api } from "../api/api";
import Header from "../components/header";
import makeToast from "../shared/toaster";
import homeStyles from "./home.module.css";
import styles from "./styles.module.css";

export default function Home() {
  const [user, setUser] = React.useState<User>(null);

  const handleRegister = () => {
    api
      .post(
        "/schedule",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
          },
        }
      )
      .then(() => {
        makeToast("success", "Ponto registrado com sucesso!");
        window.location.reload();
      })
      .catch(() => {
        makeToast("error", "Erro ao registrar ponto, tente novamente.");
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
        <div className={homeStyles.home}>
          <div className={`${homeStyles.row} ${homeStyles.firstRow}`}>
            <div className={homeStyles.avatar}>
              <p>Nome: {user?.name}</p>
              <p>Email: {user?.email}</p>
              <p>
                Telefone:{" "}
                {user?.phone.replace(
                  /(\d{2})(\d{2})(\d{5})(\d{4})/,
                  "+$1 ($2) $3-$4"
                )}
              </p>
              <p>Departamento: {user?.department}</p>
            </div>
            <button className={styles.button} onClick={handleRegister}>
              REGISTRAR PONTO
            </button>
          </div>
          <div className={`${homeStyles.row} ${homeStyles.secondRow}`}>
            <h2>Apontamentos:</h2>
            <div className={homeStyles.appointments}>
              <ul>
                <li>
                  Entrada:{" "}
                  {user?.schedule?.entry
                    ? new Date(user?.schedule?.entry).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""}
                </li>
                <li>
                  Pausa/Almoço:{" "}
                  {user?.schedule?.intervalEntry
                    ? new Date(
                        user?.schedule?.intervalEntry
                      ).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </li>
                <li>
                  Retorno Pausa:{" "}
                  {user?.schedule?.intervalExit
                    ? new Date(user?.schedule?.intervalExit).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""}
                </li>
                <li>
                  Saída:{" "}
                  {user?.schedule?.exit
                    ? new Date(user?.schedule?.exit).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
