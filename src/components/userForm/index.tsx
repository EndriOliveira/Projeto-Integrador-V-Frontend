"use client";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import styles from "../../app/styles.module.css";
import history from "../../assets/img/icons/history.png";
import logout from "../../assets/img/icons/logout.png";
import profile from "../../assets/img/icons/profile.png";
import users from "../../assets/img/icons/users.png";
import logo from "../../assets/img/logo.png";
import { User } from "../../interfaces/User";
import { redirect } from "../../shared/redirect";
import makeToast from "../../shared/toaster";
import userFormStyles from "./userForm.module.css";

export type UserFormProps = {
  user?: User;
};

export default function UserForm({ user }: UserFormProps) {
  const cpfInput = React.useRef<HTMLInputElement>(null);
  const phoneInput = React.useRef<HTMLInputElement>(null);
  const [body, setBody] = React.useState<any>({
    email: "",
    name: "",
    cpf: "",
    phone: "",
    department: "",
    isHumanResources: false,
    birthDate: new Date(),
    hourBalance: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody({
      ...body,
      [name]: value,
    });
  };

  const handleCreateUser = () => {
    if (
      !body.name ||
      !body.email ||
      !body.cpf ||
      !body.phone ||
      !body.department ||
      !body.birthDate
    ) {
      makeToast("error", "Preencha todos os campos!");
      return;
    }
    delete body.hourBalance;
    api
      .post(
        "/user",
        {
          ...body,
          birthDate: dayjs(body.birthDate).format("MM/DD/YYYY"),
          isHumanResources: body.department
            .trim()
            .toLowerCase()
            .includes("recursos humanos"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
          },
        }
      )
      .then(() => {
        makeToast("success", "Usuário cadastrado com sucesso!");
        redirect("/users");
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
          makeToast("error", "Erro ao criar usuário!");
        }
      });
  };

  const handleUpdateUser = () => {
    if (
      !body.name ||
      !body.email ||
      !body.cpf ||
      !body.phone ||
      !body.department ||
      !body.birthDate
    ) {
      makeToast("error", "Preencha todos os campos!");
      return;
    }
    delete body.email;
    api
      .put(
        `/user/${user.id}`,
        {
          ...body,
          birthDate: dayjs(body.birthDate).format("MM/DD/YYYY"),
          hourBalance: Number(body.hourBalance),
          isHumanResources: body.department
            .trim()
            .toLowerCase()
            .includes("recursos humanos"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
          },
        }
      )
      .then(() => {
        makeToast("success", "Usuário atualizado com sucesso!");
        redirect("/users");
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
          makeToast("error", "Erro ao criar usuário!");
        }
      });
  };

  useEffect(() => {
    if (user) {
      setBody({
        email: user.email,
        name: user.name,
        cpf: user.cpf,
        phone: user.phone,
        department: user.department,
        isHumanResources: user.isHumanResources,
        birthDate: user.birthDate,
        hourBalance: user.hourBalance,
      });
    }
  }, [user]);

  return (
    <div className={userFormStyles.col}>
      <h1 className={`${styles.title} ${userFormStyles.title}`}>
        {user ? "Editar Usuário" : "Novo Usuário"}
      </h1>
      <div className={userFormStyles.row}>
        <p>Email: </p>
        {user ? (
          <p>{body.email}</p>
        ) : (
          <input
            className={styles.input}
            type="text"
            name="email"
            value={body.email}
            onChange={handleInputChange}
          />
        )}
      </div>
      <div className={userFormStyles.row}>
        <p>Nome: </p>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={body.name}
          onChange={handleInputChange}
        />
      </div>
      <div className={userFormStyles.row}>
        <p>CPF: </p>
        <input
          className={styles.input}
          type="text"
          name="cpf"
          value={body.cpf.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
          )}
          ref={cpfInput}
          onChange={handleInputChange}
        />
      </div>
      <div className={userFormStyles.row}>
        <p>Telefone: </p>
        <input
          className={styles.input}
          type="text"
          name="phone"
          value={body.phone.replace(
            /(\d{2})(\d{2})(\d{5})(\d{4})/,
            "+$1 ($2) $3-$4"
          )}
          ref={phoneInput}
          onChange={handleInputChange}
        />
      </div>
      <div className={userFormStyles.row}>
        <p>Departamento: </p>
        <input
          className={styles.input}
          type="text"
          name="department"
          value={body.department}
          onChange={handleInputChange}
        />
      </div>
      <div className={userFormStyles.row}>
        <p>Data de Nascimento: </p>
        <input
          className={styles.input}
          type="date"
          name="birthDate"
          value={new Date(body.birthDate).toISOString().split("T")[0]}
          onChange={handleInputChange}
        />
      </div>
      {user && (
        <div className={userFormStyles.row}>
          <p>Banco de Horas: </p>
          <input
            className={styles.input}
            type="number"
            name="hourBalance"
            value={body.hourBalance}
            onChange={handleInputChange}
          />
          <p>minutos</p>
        </div>
      )}
      {user ? (
        <div className={userFormStyles.button}>
          <button className={styles.button} onClick={handleUpdateUser}>
            Atualizar dados
          </button>
        </div>
      ) : (
        <div className={userFormStyles.button}>
          <button className={styles.button} onClick={handleCreateUser}>
            Cadastrar
          </button>
        </div>
      )}
    </div>
  );
}
