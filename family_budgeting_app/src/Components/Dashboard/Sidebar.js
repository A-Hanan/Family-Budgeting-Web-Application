import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ setCurrentPath, currentPath }) => {
  const navigate = useNavigate();
  const userstate = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userstate;
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("currentUSer", currentUser);
  }, []);
  return (
    <div className="sidebar__container">
      <div className="logo__container">
        <h1>
          F<span>am</span> B<span>udgeting</span>
        </h1>
      </div>
      <div
        className={
          currentPath == "dashboard"
            ? "menu__item dashboard active"
            : "menu__item dashboard "
        }
        onClick={() => setCurrentPath("dashboard")}
      >
        <p>Dashboard</p>
      </div>
      <div className="menu__container">
        <div className="menu__heading">
          <p>Options</p>
        </div>
        {currentUser?.usertype == "superUser" && (
          <div
            className={
              currentPath == "generalOptions"
                ? "menu__item active"
                : "menu__item"
            }
            onClick={() => setCurrentPath("generalOptions")}
          >
            <p>General Options</p>
          </div>
        )}
        <div
          className={
            currentPath == "addExpenditure" ? "menu__item active" : "menu__item"
          }
          onClick={() => setCurrentPath("addExpenditure")}
        >
          <p>Add Expenditure</p>
        </div>
        <div
          className={
            currentPath == "monthlyTransactions"
              ? "menu__item active"
              : "menu__item"
          }
          onClick={() => setCurrentPath("monthlyTransactions")}
        >
          <p>Monthly Expenditures</p>
        </div>
        {currentUser?.usertype == "superUser" && (
          <div
            className={
              currentPath == "editAccess" ? "menu__item active" : "menu__item"
            }
            onClick={() => setCurrentPath("editAccess")}
          >
            <p>Edit Access</p>
          </div>
        )}
        {currentUser?.usertype == "superUser" && (
          <div
            className={
              currentPath == "monthlyReport"
                ? "menu__item active"
                : "menu__item"
            }
            onClick={() => setCurrentPath("monthlyReport")}
          >
            <p>Monthly Report</p>
          </div>
        )}
      </div>
      <div className="user__container">
        <div className="menu__heading">
          <p>User</p>
        </div>
        <div className="user__box" sx={{ marginTop: "20px" }}>
          <Avatar>{currentUser?.name?.at(0)}</Avatar>
          <p>{currentUser?.name}</p>
        </div>
        <div className="menu__item" onClick={() => dispatch(logoutUser())}>
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
