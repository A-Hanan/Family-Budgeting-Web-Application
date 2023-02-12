import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
const GeneralOptionsForSuperUsers = () => {
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState(0);
  const [error, setError] = useState("");
  const userstate = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userstate;
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState(0);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    api
      .post("/budget/getByDate", {
        monthlyDate: `${
          monthNames[new Date().getUTCMonth()]
        }, ${new Date().getFullYear()}`,
      })
      .then((res) => {
        console.log("response", res?.data?.budgetData);
        setBudget(res.data?.budgetData?.budgetAmount);
      })
      .catch((err) => console.log(err));

    api
      .get("/categories")
      .then((res) => {
        console.log("response from categories", res.data.categories);
        let arr = [];
        arr.push({ categoryName: "food", addedBy: "default" });
        arr.push({ categoryName: "utility", addedBy: "default" });
        arr.push({ categoryName: "transportation", addedBy: "default" });
        arr.push({ categoryName: "cloth", addedBy: "default" });
        arr.push({ categoryName: "medical", addedBy: "default" });
        arr.push({ categoryName: "entertainment", addedBy: "default" });
        res.data?.categories?.map((c) => arr.push(c));
        setCategories(arr);
      })
      .catch((err) => console.log(err));
  }, []);
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
  /** */
  const addCategory = () => {
    console.log("category to be added", categoryInput);
    console.log("budget", budgetInput);
    setCategoryError("");
    if (categoryInput.length < 2) {
      setCategoryError("Enter appropriate category");
      return;
    }
    if (
      categoryInput == "food" ||
      categoryInput == "utility" ||
      categoryInput == "transportation" ||
      categoryInput == "medical" ||
      categoryInput == "cloth" ||
      categoryInput == "entertainment"
    ) {
      setCategoryError("You cannot re-add default category");
      return;
    }

    console.log("running");
    api
      .post("/categories/add", {
        categoryName: categoryInput,
        addedBy: currentUser?.name,
      })
      .then((res) => {
        console.log("response", res.data);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  const deleteCategory = (c) => {
    console.log("category to be deleted", c);
    api
      .post("/categories/delete", { categoryName: c?.categoryName })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  return (
    <Box>
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
            {budget > 0 ? "$ " + budget : "Not Added"}
          </Typography>
        </Stack>
        <Box
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
          <Button
            variant="contained"
            size="small"
            onClick={() => submitBudget()}
          >
            Update Budget
          </Button>
        </Box>
        {error && <p className="error__para">{error}</p>}
      </Box>
      <Box sx={{ margin: "30px 10px" }}>
        <h1 className="common__heading__h1"> Customize Categories</h1>
        <TableContainer
          component={Paper}
          sx={{ width: "500px", marginTop: "10px" }}
        >
          <Table sx={{ minWidth: 250 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell align="right">Added By</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.categoryName}
                  </TableCell>
                  <TableCell align="right">{row.addedBy}</TableCell>
                  <TableCell align="right">
                    {row?.addedBy == "default" ? (
                      "N/A"
                    ) : (
                      <IconButton onClick={() => deleteCategory(row)}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <TextField
            size="small"
            id="standard-basic"
            label="Category Name"
            variant="standard"
            onChange={(e) =>
              setCategoryInput(e.target.value.toLocaleLowerCase())
            }
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => addCategory()}
          >
            Add Category
          </Button>
        </Box>
        {categoryError && <p className="error__para">{categoryError}</p>}
      </Box>
    </Box>
  );
};

export default GeneralOptionsForSuperUsers;

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
