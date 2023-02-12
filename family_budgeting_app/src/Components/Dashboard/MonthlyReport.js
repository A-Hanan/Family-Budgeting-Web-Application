import { Box, Button, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import api from "../../utils/api";

const MonthlyReport = () => {
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

  const [categories, setCategories] = useState([]);
  const [chartDataArray, setChartDataArray] = useState([]);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        console.log("response from categories", res.data.categories);
        // let arrayC = [];
        // res?.data?.categories?.map((c) => {
        //   arrayC.push(c?.categoryName);
        // });
        // setCategories(arrayC);
        let arrayC = [];
        arrayC.push("food");
        arrayC.push("utility");
        arrayC.push("transportation");
        arrayC.push("cloth");
        arrayC.push("medical");
        arrayC.push("entertainment");
        res.data?.categories?.map((c) => arrayC.push(c?.categoryName));
        setCategories(arrayC);
        // console.log("array", arrayC);
        /************ */
        let chartDataArr = [];
        api
          .get("/expenditures")
          .then((res) => {
            let exps = res?.data?.expenditures;
            arrayC.map((c) => {
              let count = 0;
              exps?.map((exp) => {
                if (exp?.categoryName == c) {
                  count = count + parseInt(exp?.totalCost);
                }
              });
              let d = {
                categoryName: c,
                count: count,
              };
              chartDataArr.push(d);
            });
            console.log("chart data array", chartDataArr);

            setChartDataArray(chartDataArr);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {}, [categories]);
  var options2 = {
    series: chartDataArray?.map((c) => c?.count),

    chart: {
      width: 380,
      type: "donut",
    },
    colors: [
      "#488f31",
      "#bad0af",
      "#aecdc2",
      "#e67f83",
      "#f0b8b8",
      "#f0b8b8",
      "#83af70",
    ],
    labels: chartDataArray?.map((c) => c?.categoryName),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  /****************************** */
  const [timePeriods, setTimePeriods] = useState([]);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([]);

  useState(() => {
    function getAllDaysInMonth(year, month) {
      const date = new Date(year, month, 1);
      const dates = [];
      while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
        // console.log("date", new Date(year, month, 1));
      }
      return dates;
    }
    // 👇️ all days of the current month
    const now = new Date();
    let currentMonthDates = getAllDaysInMonth(
      now.getFullYear(),
      now.getMonth()
    );
    let daysArray = [];
    daysArray = currentMonthDates
      ?.filter((c) => new Date(c)?.getDate() <= new Date().getDate())
      .map((da) => new Date(da)?.toDateString());

    setTimePeriods(daysArray);

    api
      .get("/expenditures")
      .then((res) => {
        let exps = res?.data?.expenditures;
        let expensesArray = [];
        daysArray.map((day) => {
          let total = 0;
          exps?.map((exp) => {
            if (
              new Date(exp?.dateOfSpending).getDate() == new Date(day).getDate()
            ) {
              total = total + parseInt(exp?.totalCost);
            }
          });
          expensesArray.push(total);
        });

        setCurrentMonthExpenses(expensesArray);
        console.log("current month expeses", expensesArray);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    console.log("timeperiods", timePeriods);
    console.log("current month expenses", currentMonthExpenses);
  }, [timePeriods, currentMonthExpenses]);
  var options = {
    series: [
      {
        name: "Current Month Expenses",
        data: currentMonthExpenses,
      },
    ],
    chart: {
      height: 350,
      type: "area",
    },
    colors: ["#46C2CB"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: timePeriods,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };
  return (
    <Box sx={{ padding: "20px" }}>
      <h1>Monthly Report</h1>
      <Box
        sx={{
          backgroundColor: "#fff",
          minHeight: "500px",
          width: "80%",
          borderRadius: "6px",
          marginTop: "20px",
        }}
      >
        <Box sx={{ padding: "20px 20px" }}>
          <Typography variant="body2" sx={{ fontWeight: "400" }}>
            Total Budget
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "500" }}>
            {totalMonthlyBudget ? "$ " + totalMonthlyBudget : "N/A"}
          </Typography>
        </Box>
        <Box sx={{ padding: "20px 20px" }}>
          <Typography variant="p" sx={{ fontWeight: "400" }}>
            Total Expenditures
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "500" }}>
            {totalMonthlyBudget ? "$ " + totalMonthlyExpenses : "N/A"}
          </Typography>
        </Box>
        <Box sx={{ padding: "20px 20px", marginTop: "30px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px" }}>
            Spending by Categories
          </Typography>
          <Chart
            options={options2}
            series={options2?.series}
            type="donut"
            height={window?.screen?.width > 600 ? "100%" : "100%"}
            width="100%"
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "300px", marginTop: "30px" }}>
              <Grid container>
                <Grid item xs={7}>
                  <Typography variant="h6" sx={{ fontWeight: "600" }}>
                    Category Name
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: "600" }}>
                    Expenditures
                  </Typography>
                </Grid>
              </Grid>
              {chartDataArray?.map((c) => (
                <Grid container>
                  <Grid item xs={7} sx={{ fontSize: "1rem" }}>
                    {c?.categoryName}
                  </Grid>
                  <Grid item xs={4} sx={{ fontSize: "1rem" }}>
                    $ {c?.count}
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ padding: "20px 20px", marginTop: "30px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px" }}>
            Current Month Expenditures
          </Typography>
          <Box sx={{ width: "100%", minHeight: "500px" }}>
            <Chart
              options={options}
              series={options?.series}
              type="bar"
              height={window?.screen?.width > 600 ? "100%" : "100%"}
              width="100%"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "300px", marginTop: "30px" }}>
              <Grid container>
                <Grid item xs={7}>
                  <Typography variant="h6" sx={{ fontWeight: "600" }}>
                    Day
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontWeight: "600" }}>
                    Expenditures
                  </Typography>
                </Grid>
              </Grid>
              {new Array(timePeriods?.length).fill("s").map((x, i) => (
                <Grid container>
                  <Grid item xs={7} sx={{ fontSize: "1rem" }}>
                    {timePeriods[i]}
                  </Grid>
                  <Grid item xs={4} sx={{ fontSize: "1rem" }}>
                    $ {currentMonthExpenses[i]}
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MonthlyReport;
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
