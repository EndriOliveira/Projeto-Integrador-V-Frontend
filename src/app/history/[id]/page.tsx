"use client";
import dayjs from "dayjs";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { api } from "../../../api/api";
import deleteUser from "../../../assets/img/icons/delete.png";
import edit from "../../../assets/img/icons/edit.png";
import Header from "../../../components/header";
import { GetSchedulesParams } from "../../../interfaces/GetSchedules";
import { Schedule } from "../../../interfaces/Schedule";
import { User } from "../../../interfaces/User";
import makeToast from "../../../shared/toaster";
import styles from "../../styles.module.css";
import historyStyles from "./history.module.css";

export default function History() {
  const [user, setUser] = React.useState<User>(null);
  const [userFound, setUserFound] = React.useState<User>();
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [schedule, setSchedule] = React.useState<Schedule>(null);
  const [scheduleId, setScheduleId] = React.useState<string>(null);
  const params = useParams();
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState<boolean>(false);

  const [rangeStart, setRangeStart] = React.useState(null);
  const [rangeEnd, setRangeEnd] = React.useState(null);

  const handleDeleteModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setScheduleId(e.currentTarget.value);
    setShowDeleteModal(true);
  };

  const handleEditModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    api
      .get(`/schedule/${e.currentTarget.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
        },
      })
      .then((response) => {
        setSchedule(response.data);
        setShowUpdateModal(true);
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
          makeToast("error", "Erro ao buscar registro!");
        }
      });
  };

  const handleCancel = () => {
    setScheduleId(null);
    setSchedule(null);
    setShowUpdateModal(false);
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    api
      .delete(`/schedule/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
        },
      })
      .then(() => {
        makeToast("success", "Registro deletado com sucesso!");
        handleCancel();
        getSchedules({
          rangeStart: rangeStart,
          rangeEnd: rangeEnd,
        });
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
          makeToast("error", "Erro ao deletar registro!");
        }
      });
  };
  const handleUpdate = () => {
    api
      .put(
        `/schedule/${schedule.id}`,
        {
          entryTime: dayjs(schedule.entry).add(3, "hours").format("HH:mm"),
          intervalEntryTime: dayjs(schedule.intervalEntry)
            .add(3, "hours")
            .format("HH:mm"),
          intervalExitTime: dayjs(schedule.intervalExit)
            .add(3, "hours")
            .format("HH:mm"),
          exitTime: dayjs(schedule.exit).add(3, "hours").format("HH:mm"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
          },
        }
      )
      .then(() => {
        makeToast("success", "Registro atualizado com sucesso!");
        handleCancel();
        getSchedules({
          rangeStart: rangeStart,
          rangeEnd: rangeEnd,
        });
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
          makeToast("error", "Erro ao atualizar registro!");
        }
      });
  };

  const getSchedules = (
    parameters: GetSchedulesParams = {
      rangeStart: rangeStart,
      rangeEnd: rangeEnd,
    }
  ) => {
    if (!parameters.rangeStart || !parameters.rangeEnd) {
      makeToast("error", "Selecione um intervalo de datas!");
      return;
    }

    api
      .get(`/schedule/user/${params.id}`, {
        params: {
          rangeStart: dayjs(parameters.rangeStart).format("MM/DD/YYYY"),
          rangeEnd: dayjs(parameters.rangeEnd).format("MM/DD/YYYY"),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
        },
      })
      .then((response) => setSchedules(response.data.schedules))
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
          makeToast("error", "Erro ao listar registros!");
        }
      });
  };

  const getUser = () => {
    api
      .get(`/user/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("DT_Access_Token")}`,
        },
      })
      .then((response) => setUserFound(response.data))
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
  };

  useEffect(() => {
    setUser(
      localStorage.getItem("DT_User")
        ? JSON.parse(localStorage.getItem("DT_User"))
        : null
    );
    getUser();
  }, []);

  return (
    <>
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={`${styles.modalCard} ${historyStyles.modalCard}`}>
            <h2>Deletar Registro?</h2>
            <div>
              <button className={styles.darkButton} onClick={handleCancel}>
                Cancelar
              </button>
              <button className={styles.button} onClick={handleDelete}>
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className={styles.modal}>
          <div
            className={`${styles.modalCard} ${historyStyles.modalCard} ${historyStyles.editModalCard}`}
          >
            <h2>Editar</h2>
            <div>
              <p>Dia: {dayjs(schedule.entry).format("DD/MM/YYYY")}</p>
              <div className={historyStyles.editInputGroup}>
                <div className={historyStyles.inputRow}>
                  <p>Entrada:</p>
                  <input
                    type="time"
                    value={dayjs(schedule.entry)
                      .add(3, "hours")
                      .format("HH:mm")}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        entry: dayjs(
                          `${dayjs(schedule.entry).format("YYYY-MM-DD")} ${
                            e.target.value
                          }`
                        )
                          .subtract(3, "hours")
                          .format() as any,
                      })
                    }
                  />
                </div>
                <div className={historyStyles.inputRow}>
                  <p>Pausa:</p>
                  <input
                    type="time"
                    value={dayjs(schedule.intervalEntry)
                      .add(3, "hours")
                      .format("HH:mm")}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        intervalEntry: dayjs(
                          `${dayjs(schedule.intervalEntry).format(
                            "YYYY-MM-DD"
                          )} ${e.target.value}`
                        )
                          .subtract(3, "hours")
                          .format() as any,
                      })
                    }
                  />
                </div>
                <div className={historyStyles.inputRow}>
                  <p>Pausa (Retorno):</p>
                  <input
                    type="time"
                    value={dayjs(schedule.intervalExit)
                      .add(3, "hours")
                      .format("HH:mm")}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        intervalExit: dayjs(
                          `${dayjs(schedule.intervalExit).format(
                            "YYYY-MM-DD"
                          )} ${e.target.value}`
                        )
                          .subtract(3, "hours")
                          .format() as any,
                      })
                    }
                  />
                </div>
                <div className={historyStyles.inputRow}>
                  <p>Saída:</p>
                  <input
                    type="time"
                    value={dayjs(schedule.exit).add(3, "hours").format("HH:mm")}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        exit: dayjs(
                          `${dayjs(schedule.exit).format("YYYY-MM-DD")} ${
                            e.target.value
                          }`
                        )
                          .subtract(3, "hours")
                          .format() as any,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className={historyStyles.editButtonGroup}>
              <button className={styles.darkButton} onClick={handleCancel}>
                Cancelar
              </button>
              <button className={styles.button} onClick={handleUpdate}>
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}

      <Header />
      <div className={`${styles.container} ${historyStyles.container}`}>
        <div className={historyStyles.searchContainer}>
          <div className={historyStyles.search}>
            {user && user?.id == params.id ? (
              <h2 className={styles.subtitle}>
                Olá,{" "}
                <span className={historyStyles.name}>
                  {user.name.split(" ")[0]}
                </span>
              </h2>
            ) : (
              <h2 className={styles.subtitle}>
                Apontamentos de {userFound?.name}
              </h2>
            )}
            <input
              type="date"
              className={styles.input}
              onChange={(e) => setRangeStart(e.target.value)}
            />
            <input
              type="date"
              className={styles.input}
              onChange={(e) => setRangeEnd(e.target.value)}
            />
          </div>
          <button onClick={() => getSchedules()} className={styles.button}>
            Pesquisar
          </button>
        </div>
        <div className={`${styles.card} ${historyStyles.card}`}>
          <div className={historyStyles.tableContainer}>
            <div className={historyStyles.table}>
              <div className={historyStyles.tableHeader}>
                <div
                  className={`${historyStyles.headerRow} ${
                    !user?.isHumanResources && historyStyles.headerRowSimple
                  }`}
                >
                  <p>Dia</p>
                  <p>Entrada</p>
                  <p>Saída</p>
                  <p>Pausa</p>
                  {user && user?.isHumanResources && <p>Ações</p>}
                </div>
              </div>
              <div className={historyStyles.list}>
                {schedules.map((schedule) => (
                  <div
                    className={`${historyStyles.row} ${
                      !user?.isHumanResources && historyStyles.rowSimple
                    }`}
                    key={schedule.id}
                  >
                    <p>
                      {dayjs(schedule.entry)
                        .add(3, "hours")
                        .format("DD/MM/YYYY")}
                    </p>
                    <p>
                      {dayjs(schedule.entry).add(3, "hours").format("HH:mm")}
                    </p>
                    <p>
                      {dayjs(schedule.exit).add(3, "hours").format("HH:mm")}
                    </p>
                    <p>
                      {dayjs(schedule.intervalEntry)
                        .add(3, "hours")
                        .format("HH:mm")}
                      -
                      {dayjs(schedule.intervalExit)
                        .add(3, "hours")
                        .format("HH:mm")}
                    </p>
                    {user && user?.isHumanResources && (
                      <div className={historyStyles.buttonGroup}>
                        <button value={schedule.id} onClick={handleEditModal}>
                          <Image src={edit} alt="Editar Registro" />
                        </button>
                        <button value={schedule.id} onClick={handleDeleteModal}>
                          <Image src={deleteUser} alt="Deletar Registro" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
