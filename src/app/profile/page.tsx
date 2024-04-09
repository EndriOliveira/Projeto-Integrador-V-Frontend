"use client";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import Header from "../../components/header";
import makeToast from "../../shared/toaster";
import styles from "../styles.module.css";
import profileStyles from "./profile.module.css";

export default function Profile() {
  const [user, setUser] = React.useState<User>(null);

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
        <div className={styles.card}>
          <h2 className={styles.title}>Perfil</h2>
          <hr />
        </div>
      </div>
    </>
  );
}
