import React from "react";
import AddExpenditure from "./AddExpenditure";
import MainDashboardScreen from "./MainDashboardScreen";
import ShowMonthlyTransactions from "./ShowMonthlyTransactions";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, IconButton } from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import GeneralOptionsForSuperUsers from "./GeneralOptionsForSuperUsers";
import EditAccessBySuperUser from "./EditAccessBySuperUser";
import MonthlyReport from "./MonthlyReport";
import { logoutUser } from "../../Actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const MainContainer = ({ currentPath }) => {
  const userstate = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userstate;
  const dispatch = useDispatch();
  return (
    <div className="main__container">
      <div className="main__container__upper__bar">
        <IconButton
          onClick={() => dispatch(logoutUser())}
          sx={{ backgroundColor: "whiteSmoke" }}
        >
          <LogoutIcon />
        </IconButton>
        <IconButton sx={{ backgroundColor: "whiteSmoke" }}>
          <Avatar>{currentUser?.name?.at(0)}</Avatar>
        </IconButton>
      </div>
      <div className="wrapper">
        {currentPath == "dashboard" ? (
          <MainDashboardScreen />
        ) : currentPath == "addExpenditure" ? (
          <AddExpenditure />
        ) : currentPath == "monthlyTransactions" ? (
          <ShowMonthlyTransactions />
        ) : currentPath == "generalOptions" ? (
          <GeneralOptionsForSuperUsers />
        ) : currentPath == "editAccess" ? (
          <EditAccessBySuperUser />
        ) : currentPath == "monthlyReport" ? (
          <MonthlyReport />
        ) : (
          <h1>404 Not Found.</h1>
        )}
      </div>
    </div>
  );
};

export default MainContainer;
