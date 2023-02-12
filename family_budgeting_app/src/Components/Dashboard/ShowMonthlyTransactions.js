import { Box, IconButton, TablePagination } from "@mui/material";
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Stack } from "@mui/system";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";

const columns = [
  { id: "expenditureName", label: "Expenditure Name", minWidth: 170 },

  {
    id: "category",
    label: "Category",
    minWidth: 150,
    align: "right",
  },
  {
    id: "totalCost",
    label: "Total Cost (USD)",
    minWidth: 130,
    align: "right",
  },
  {
    id: "dateOfExpending",
    label: "Expending Date",
    minWidth: 170,
    align: "right",
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 140,
    align: "right",
  },
];

function createData(expenditureName, category, totalCost, dateOfExpending) {
  return { expenditureName, category, totalCost, dateOfExpending };
}
// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [

// ];

const rows = [
  createData("Dinner at Hotel", "Food", 150, "23 - 10 - 2022"),
  createData("Shopping Bag", "Shopping", 230, "25 - 10 - 2022"),
  createData("Notebook ", "Child Essential", 30, "29 - 10 - 2022"),
  createData("House Rent", "Montly Must", 500, "3 - 11 - 2022"),
  createData("Gas Fee", "Monthly Must", 120, "10 - 11 - 2022"),
  createData("Dinner at Hotel", "Food", 150, "23 - 10 - 2022"),
  createData("Shopping Bag", "Shopping", 230, "25 - 10 - 2022"),
  createData("Notebook ", "Child Essential", 30, "29 - 10 - 2022"),
  createData("House Rent", "Montly Must", 500, "3 - 11 - 2022"),
  createData("Gas Fee", "Monthly Must", 120, "10 - 11 - 2022"),
];

const ShowMonthlyTransactions = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const userstate = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userstate;
  const [expenditures, setExpenditures] = useState([]);
  useEffect(() => {
    api
      .get("/expenditures")
      .then((res) => {
        console.log("response from expenditures", res.data?.expenditures);
        setExpenditures(res.data?.expenditures);
      })
      .catch((err) => console.log(err));
  }, []);
  const deleteExpenditure = (exp) => {
    console.log("category to be deleted", exp);
    api
      .post("/expenditures/delete", { id: exp?.id })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  return (
    <Box className="monthly__transaction__component">
      <h1 className="common__heading__h1" style={{ marginBottom: "20px" }}>
        All Expenditures of Current Month
      </h1>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align={index == 4 ? "center" : column.align}
                    style={{ minWidth: column.minWidth }}
                    className="tabel__header__cell"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {expenditures
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell align={"left"}>
                        {row?.expenditureName}
                      </TableCell>
                      <TableCell align={"right"}>{row?.categoryName}</TableCell>
                      <TableCell align={"right"}>{row?.totalCost}</TableCell>
                      <TableCell align={"right"}>
                        {row?.dateOfSpending}
                      </TableCell>

                      <TableCell align="center">
                        {currentUser?.usertype == "superUser" ? (
                          <>
                            {" "}
                            <Box sx={{ justfyContent: "center" }}>
                              {/* <IconButton>
                            <ModeEditOutlinedIcon />
                          </IconButton> */}
                              <IconButton
                                onClick={() => deleteExpenditure(row)}
                              >
                                <DeleteOutlineOutlinedIcon />
                              </IconButton>
                            </Box>
                          </>
                        ) : (
                          <>N/A</>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Expenditure Name</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Total Cost &nbsp;(USD)</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="center">
                  <Box sx={{ justfyContent: "center" }}>
                    <IconButton>
                      <ModeEditOutlinedIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Box>
  );
};

export default ShowMonthlyTransactions;
