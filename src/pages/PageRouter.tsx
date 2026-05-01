import React from "react";
import AppRoutes from "./AppRoutes";

interface PageRouterProps {
  currentPage: string;
}

const PageRouter: React.FC<PageRouterProps> = () => {
  return <AppRoutes />;
};

export default PageRouter;
