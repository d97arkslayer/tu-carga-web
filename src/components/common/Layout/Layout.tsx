import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="w-screen h-screen overflow-hidden">{children}</div>;
};

export default Layout;
