import { Box, Button, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import CategoriesPie from "../charts/CategoriesPie";
import ExpenseComparison from "../charts/ExpenseComparison";
import api from "../../utils/api";

const MainDashboardScreen = () => {
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(0);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [remainingMonthlyBudget, setRemainingMonthlyBudget] = useState(0);
  const [totalExpensesToday, setTotalExpensesToday] = useState(0);

  useEffect(() => {
    api
      .post("/budget/getByDate", {
        monthlyDate: `${
          monthNames[new Date().getUTCMonth()]
        }, ${new Date().getFullYear()}`,
      })
      .then((res) => {
        // console.log("response", res?.data?.budgetData);
        setTotalMonthlyBudget(res.data?.budgetData?.budgetAmount);
        let tmb = res.data?.budgetData?.budgetAmount;
        /************* */
        api
          .get("/expenditures")
          .then((res) => {
            let exps = res?.data?.expenditures;
            let totalExpenses = 0;
            let tExpensesToday = 0;
            exps?.map((exp) => {
              if (
                new Date().getFullYear() ==
                  new Date(exp?.dateOfSpending)?.getFullYear() &&
                new Date().getMonth() ==
                  new Date(exp?.dateOfSpending)?.getMonth()
              ) {
                totalExpenses += parseInt(exp?.totalCost);
              }

              if (
                new Date().toDateString() ==
                new Date(exp?.dateOfSpending)?.toDateString()
              ) {
                tExpensesToday += parseInt(exp?.totalCost);
              }
            });
            // console.log("tExpensesToday", tExpensesToday);
            setTotalExpensesToday(tExpensesToday);
            setTotalMonthlyExpenses(totalExpenses);
            setRemainingMonthlyBudget(parseInt(tmb) - totalExpenses);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Box className="dashboard__screen__components">
      <Box
        className="header__row"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box>
          <h1 className="common__heading__h1">Dashboard, Welcome Again</h1>
          <Typography variant="p">
            Welcome back dear, we have missed you
          </Typography>
        </Box>
        <Box>
          <Button variant="contained">
            Today: {new Date().toDateString()}
          </Button>
        </Box>
      </Box>
      <Box className="dashboard__analytics__wrapper">
        <Grid container gap={2}>
          <Grid item xs={3} className="first__anlytics__row__box">
            <Box className="flex__space__between">
              <Typography variant="p" sx={{ fontSize: "0.9rem" }}>
                Expenses Today
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Today
              </Button>
            </Box>
            <Typography variant="h4">
              $ {totalExpensesToday ? totalExpensesToday : 0}
            </Typography>
            <Box className="flex__space__between">
              <Box className="green__span">moderate</Box>
              {/* <Typography variant="body2">since last day</Typography> */}
            </Box>
          </Grid>
          <Grid item xs={3} className="first__anlytics__row__box">
            <Box className="flex__space__between">
              <Typography variant="p" sx={{ fontSize: "0.9rem" }}>
                Budget Remaining
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Monthly
              </Button>
            </Box>
            <Typography variant="h4">
              $ {remainingMonthlyBudget ? remainingMonthlyBudget : "N/A"}{" "}
            </Typography>
            <Box className="flex__space__between">
              <Box className="green__span">
                Total Budget: {totalMonthlyBudget} $
              </Box>
              <Typography variant="body2"></Typography>
            </Box>
          </Grid>
          <Grid item xs={3} className="first__anlytics__row__box">
            <Box className="flex__space__between">
              <Typography variant="p" sx={{ fontSize: "0.9rem" }}>
                Total Expenses
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: "0.7rem" }}
              >
                Monthly
              </Button>
            </Box>
            <Typography variant="h4">
              $ {totalMonthlyExpenses ? totalMonthlyExpenses : "N/A"}
            </Typography>
            <Box className="flex__space__between">
              <Box className="red__span">
                {new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  0
                ).getDate() - new Date().getDate()}{" "}
                days remaining
              </Box>
              <Typography variant="body2"></Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid gap={3} container sx={{ marginTop: "30px", minHeight: "400px" }}>
          <Grid
            item
            xs={11}
            lg={6}
            sx={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "6px",
              minHeight: "500px",
            }}
          >
            <ExpenseComparison />
          </Grid>
          <Grid
            item
            xs={11}
            lg={5}
            sx={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "6px",
              paddingTop: "20px",
              alignItems: "center",
              minHeight: "500px",
            }}
          >
            <CategoriesPie />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MainDashboardScreen;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
