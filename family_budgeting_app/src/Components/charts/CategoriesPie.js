import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import api from "../../utils/api";

const CategoriesPie = () => {
  const [categories, setCategories] = useState([]);
  const [chartDataArray, setChartDataArray] = useState([]);
  useEffect(() => {
    let arrayC = [];
    arrayC.push("food");
    arrayC.push("utility");
    arrayC.push("transportation");
    arrayC.push("cloth");
    arrayC.push("medical");
    arrayC.push("entertainment");

    setCategories(arrayC);
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
            // console.log("chart data array", chartDataArr);

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
  return (
    <Chart
      options={options2}
      series={options2?.series}
      type="donut"
      height={window?.screen?.width > 600 ? "100%" : "100%"}
      width="100%"
    />
  );
};

export default CategoriesPie;
