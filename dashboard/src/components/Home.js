import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;