import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import api from "../../utils/api";

const ExpenseComparison = () => {
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
    <Chart
      options={options}
      series={options?.series}
      type="area"
      height={window?.screen?.width > 600 ? "100%" : "100%"}
      width="100%"
    />
  );
};

export default ExpenseComparison;
