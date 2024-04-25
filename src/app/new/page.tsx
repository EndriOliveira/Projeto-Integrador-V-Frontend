"use client";
import React from "react";
import Header from "../../components/header";
import UserForm from "../../components/userForm";
import styles from "../styles.module.css";

export default function New() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <UserForm />
        </div>
      </div>
    </>
  );
}
