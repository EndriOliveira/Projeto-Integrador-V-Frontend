"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import deleteUser from "../../assets/img/icons/delete.png";
import edit from "../../assets/img/icons/edit.png";
import historyW from "../../assets/img/icons/historyW.png";
import Header from "../../components/header";
import { GetUsersParams, sortBy, sortType } from "../../interfaces/GetUsers";
import { User } from "../../interfaces/User";
import makeToast from "../../shared/toaster";
import styles from "../styles.module.css";
import usersStyles from "./users.module.css";

export default function Users() {
  const [user, setUser] = React.useState<User>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  const [pages, setPages] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<sortBy>("name");
  const [sortType, setSortType] = React.useState<sortType>("asc");

  const handlePrevPage = () => {
    setUsers([]);
    getUsers({
      page: page - 1,
      limit: limit,
      search: search,
      sortBy: sortBy,
      sortType: sortType,
    });
  };

  const handleNextPage = () => {
    setUsers([]);
    getUsers({
      page: page + 1,
      limit: limit,
      search: search,
      sortBy: sortBy,
      sortType: sortType,
    });
  };

  const getUsers = (
    parameters: GetUsersParams = {
      page: page,
      limit: limit,
      search: search,
      sortBy: sortBy,
      sortType: sortType,
    }
  ) => {
    api
      .get("/user", {
        params: parameters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
        },
      })
      .then((response) => {
        setUsers(response.data.users);
        setPage(response.data.page);
        setPages(response.data.pages);
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
          makeToast("error", "Erro ao listar usuários!");
        }
      });
  };

  useEffect(() => {
    setUser(
      localStorage.getItem("DT_User")
        ? JSON.parse(localStorage.getItem("DT_User"))
        : null
    );
    getUsers();
  }, []);

  return (
    <>
      <Header />
      <div className={`${styles.container} ${usersStyles.container}`}>
        <div className={usersStyles.searchContainer}>
          <div className={usersStyles.search}>
            <h2 className={styles.subtitle}>Funcionários</h2>
            <input
              type="text"
              placeholder="Buscar"
              className={styles.input}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getUsers({
                    page: page,
                    limit: limit,
                    search: search,
                    sortBy: sortBy,
                    sortType: sortType,
                  });
                }
              }}
            />
          </div>
          <div className={usersStyles.orderCol}>
            <div className={usersStyles.order}>
              <h2>Ordenar:</h2>
              <select
                onChange={(e) => {
                  const selectedValue = e.target.value as sortBy;
                  setSortBy(selectedValue);
                  getUsers({
                    page: page,
                    limit: limit,
                    search: search,
                    sortBy: selectedValue,
                    sortType: sortType,
                  });
                }}
              >
                <option value="name">Nome</option>
                <option value="email">Email</option>
                <option value="createdAt">Data de contratação</option>
              </select>
              <select
                onChange={(e) => {
                  const selectedValue = e.target.value as sortType;
                  setSortType(selectedValue);
                  getUsers({
                    page: page,
                    limit: limit,
                    search: search,
                    sortBy: sortBy,
                    sortType: selectedValue,
                  });
                }}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
            <a
              href="/new"
              className={`${styles.darkButton} ${usersStyles.button}`}
            >
              + Novo funcionário
            </a>
          </div>
        </div>
        <div className={`${styles.card} ${usersStyles.card}`}>
          <div className={usersStyles.tableContainer}>
            <div className={usersStyles.table}>
              <div className={usersStyles.tableHeader}>
                <div className={usersStyles.headerRow}>
                  <p>Nome</p>
                  <p>Email</p>
                  <p>Telefone</p>
                  <p>CPF</p>
                  <p>Data de contratação</p>
                  <p>Ações</p>
                </div>
              </div>
              <div className={usersStyles.list}>
                {users.map((user) => (
                  <div className={usersStyles.row} key={user.id}>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <p>
                      {user.phone.replace(
                        /(\d{2})(\d{2})(\d{5})(\d{4})/,
                        "+$1 ($2) $3-$4"
                      )}
                    </p>
                    <p>
                      {user.cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                      )}
                    </p>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    <div className={usersStyles.buttonGroup}>
                      <a href={`/edit/${user.id}`}>
                        <Image src={edit} alt="Editar Usuário" />
                      </a>
                      <button>
                        <Image src={deleteUser} alt="Deletar Usuário" />
                      </button>
                      <a href={`/history/${user.id}`}>
                        <Image src={historyW} alt="Histórico de Usuário" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={usersStyles.pagination}>
          <div className={usersStyles.pages}>
            {page > 1 && <button onClick={handlePrevPage}>{page - 1}</button>}
            <button className={usersStyles.currentPage}>{page}</button>
            {page < pages && (
              <button onClick={handleNextPage}>{page + 1}</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
