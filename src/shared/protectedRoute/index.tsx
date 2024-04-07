"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute(Component: any) {
  return function ValidateToken(props: any) {
    const session: boolean = true;
    useEffect(() => {
      // TODO: Implementar a verificação do token
    }, []);

    if (!session) redirect("/login");
    return <Component {...props} />;
  };
}
