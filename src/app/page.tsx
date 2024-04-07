"use client";
import React from "react";
import ProtectedRoute from "../shared/protectedRoute";

export default function Home() {
  const user: User = localStorage.getItem("DT_User")
    ? JSON.parse(localStorage.getItem("DT_User"))
    : null;

  return (
    <ProtectedRoute>
      <h1>{user?.email}</h1>
    </ProtectedRoute>
  );
}
