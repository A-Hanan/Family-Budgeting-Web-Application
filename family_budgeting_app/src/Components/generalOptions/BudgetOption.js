import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";

const BudgetOption = ({ categories }) => {
  const [currentMonthBudget, setCurrentMonthBudget] = useState({});
  const [budgetInput, setBudgetInput] = useState(0);
  const [error, setError] = useState("");
  const userstate = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userstate;
  const [isEdit, setIsEdit] = useState(false);
  const [monthlyBudgetsByCategories, setMonthlyBudgetByCategories] = useState(
    {}
  );

  useEffect(() => {
    api
      .post("/budget/getByDate", {
        monthlyDate: `${
          monthNames[new Date().getUTCMonth()]
        }, ${new Date().getFullYear()}`,
      })
      .then((res) => {
        console.log("response", res?.data?.budgetData);
        setCurrentMonthBudget(res.data?.budgetData);
      })
      .catch((err) => console.log(err));
  }, []);

  const onChange = (e, c) => {
    const updatedInfo = Object.assign(monthlyBudgetsByCategories, {
      budgetId: currentMonthBudget?.id,
      categoryName: c?.categoryName,
      amount: e.target.value,
    });
    setMonthlyBudgetByCategories(updatedInfo);
  };

  const submitBudget = () => {
    console.log("budget", budgetInput);
    setError("");
    if (budgetInput < 500) {
      setError("minimum budget should be 500$");
      return;
    }
    if (budgetInput < 1) {
      setError("enter number ");
      return;
    }
    console.log("running");
    api
      .post("/budget/add", {
        budgetAmount: budgetInput,
        budgetMonth: `${
          monthNames[new Date().getUTCMonth()]
        }, ${new Date().getFullYear()}`,
        addedBy: currentUser?.name,
      })
      .then((res) => {
        console.log("response", res.data);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  const submitCategoriesBudget = () => {
    console.log("categories month ", monthlyBudgetsByCategories);
  };
  return (
    <Box sx={{ margin: "30px 10px" }}>
      <Box className="flex__space__between">
        <h1 className="common__heading__h1"> Add Monthly Budget</h1>
      </Box>

      <Stack direction="row" gap={4} sx={{ margin: "10px 0" }}>
        <Typography variant="p" sx={{ width: "100px" }}>
          Current Month{" "}
        </Typography>
        <Typography variant="body2">
          {monthNames[new Date().getUTCMonth()]}, {new Date().getFullYear()}{" "}
        </Typography>
      </Stack>
      <Stack direction="row" gap={4}>
        <Typography variant="p" sx={{ width: "100px" }}>
          Total Budget{" "}
        </Typography>
        <Typography variant="body2">
          {currentMonthBudget?.budgetAmount > 0
            ? "$ " + currentMonthBudget?.budgetAmount
            : "Not Added"}
        </Typography>
      </Stack>
      <Box sx={{ marginTop: "30px" }}>
        <Typography
          variant="body2"
          sx={{ textDecoration: "underline", marginBottom: "20px" }}
        >
          Set Budget By Category
        </Typography>
        {categories?.map((c) => (
          <Grid container sx={{ marginTop: "20px" }}>
            <Grid item xs={3} sx={{ minWidth: "120px" }}>
              {c?.categoryName}
            </Grid>
            <Grid item xs={4}>
              {isEdit ? (
                <input
                  placeholder="amount ($)"
                  style={{
                    border: "1px solid lightgray",
                    padding: "10px 20px",
                  }}
                  onChange={(e) => onChange(e, c)}
                  type="number"
                  min="0"
                />
              ) : (
                " N/A"
              )}
            </Grid>
          </Grid>
        ))}
        {isEdit ? (
          <Button
            variant="contained"
            size="small"
            sx={{ marginTop: "20px" }}
            onClick={() => submitCategoriesBudget()}
          >
            Update
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            sx={{ marginTop: "20px" }}
            onClick={() => setIsEdit(true)}
          >
            Edit Budget by categories
          </Button>
        )}
      </Box>
      {/* <Box
        sx={{
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <TextField
          size="small"
          type="number"
          id="standard-basic"
          label="Budget ($)"
          variant="standard"
          onChange={(e) => setBudgetInput(e.target.value)}
        />
        <Button variant="contained" size="small" onClick={() => submitBudget()}>
          Update Budget
        </Button>
      </Box>
      {error && <p className="error__para">{error}</p>} */}
    </Box>
  );
};

export default BudgetOption;

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
