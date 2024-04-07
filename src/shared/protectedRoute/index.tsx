"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../api/api";
import makeToast from "../toaster";

const ProtectedRoute = ({ children }) => {
  let session: boolean = true;

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
        makeToast("error", "Session expired, please log in again!");
      });
  };

  const validateAccessToken = async () => {
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
        session = true;
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

  if (!session) redirect("/login");
  return <>{children}</>;
};

export default ProtectedRoute;
