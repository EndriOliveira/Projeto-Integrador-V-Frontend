"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { api } from "../../api/api";
import history from "../../assets/img/icons/history.png";
import logout from "../../assets/img/icons/logout.png";
import profile from "../../assets/img/icons/profile.png";
import users from "../../assets/img/icons/users.png";
import logo from "../../assets/img/logo.png";
import { redirect } from "../../shared/redirect";
import makeToast from "../../shared/toaster";
import headerStyles from "./header.module.css";

export default function Header() {
  const [user, setUser] = React.useState<User>(null);

  const handleLogout = () => {
    api
      .post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("DT_Refresh_Token")}`,
          },
        }
      )
      .then(() => {
        localStorage.removeItem("DT_Access_Token");
        localStorage.removeItem("DT_Refresh_Token");
        localStorage.removeItem("DT_User");
        redirect("/login");
      })
      .catch(() => {
        localStorage.removeItem("DT_Access_Token");
        localStorage.removeItem("DT_Refresh_Token");
        localStorage.removeItem("DT_User");
        redirect("/login");
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
      .catch(() => {
        makeToast("error", "Sessão expirada, autentique-se novamente!");
        redirect("/login");
      });
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
        setUser(response.data);
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
      redirect("/login");
    }
    validateAccessToken();
  }, []);

  return (
    <div className={headerStyles.header}>
      <div className={headerStyles.logo}>
        <a href="/">
          <Image src={logo} alt="Logo" />
        </a>
      </div>
      <nav>
        {user?.isHumanResources && (
          <a href="/users">
            <Image src={users} alt="Lista de usuários" />
          </a>
        )}
        <a href="/history">
          <Image src={history} alt="Histórico de apontamentos" />
        </a>
        <a href="/profile">
          <Image src={profile} alt="Perfil" />
        </a>
        <a onClick={handleLogout}>
          <Image src={logout} alt="Sair" />
        </a>
      </nav>
    </div>
  );
}
