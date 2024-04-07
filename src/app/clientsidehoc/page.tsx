"use client";

import ProtectedRoute from "../../shared/protectedRoute";

const ClientSideHOC = () => {
  return <div>Client Side HOC</div>;
};

export default ProtectedRoute(ClientSideHOC);
