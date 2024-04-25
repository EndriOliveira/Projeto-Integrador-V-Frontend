"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { api } from "../../../api/api";
import Header from "../../../components/header";
import UserForm from "../../../components/userForm";
import { User } from "../../../interfaces/User";
import makeToast from "../../../shared/toaster";
import styles from "../../styles.module.css";

export default function Edit() {
  const [user, setUser] = React.useState<User>(null);
  const params = useParams();

  useEffect(() => {
    api
      .get(`/user/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
        },
      })
      .then((response) => {
        setUser(response.data);
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
          makeToast("error", "Erro ao buscar usuário!");
        }
      });
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <UserForm user={user} />
        </div>
      </div>
    </>
  );
}
