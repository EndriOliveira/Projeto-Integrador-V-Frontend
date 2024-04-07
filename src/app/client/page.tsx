"use client";

import { redirect } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { sessionStatus } from "../../utils/sessionStatus";

const ClientSide = () => {
  useLayoutEffect(() => {
    const session = sessionStatus;
    if (!session) {
      redirect("/login");
    }
  }, []);

  return <div>Client Side</div>;
};

export default ClientSide;
