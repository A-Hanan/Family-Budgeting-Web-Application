import React, { useState, useEffect } from "react";
import MainContainer from "../../Components/Dashboard/MainContainer";
import Sidebar from "../../Components/Dashboard/Sidebar";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const [currentPath, setCurrentPath] = useState("dashboard");
  const navigate = useNavigate();
  const userstate = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userstate;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!currentUser?.name) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="dashboard__page">
      <Sidebar setCurrentPath={setCurrentPath} currentPath={currentPath} />
      <MainContainer currentPath={currentPath} />
    </div>
  );
};

export default Dashboard;
