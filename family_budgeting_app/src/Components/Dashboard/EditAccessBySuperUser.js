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
import Swal from "sweetalert2";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});

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

const EditAccessBySuperUser = () => {
  const [allRegularUsers, setAllRegularUsers] = useState([]);

  useEffect(() => {
    console.log("running23");
    api
      .get("/user/allRegularUsers")
      .then((res) => {
        console.log("response all regular users", res.data);
        setAllRegularUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const deleteUser = (user) => {
    console.log("user to be delete", user);
    api
      .post("/user/deleteUser", { id: user?.id })
      .then((res) => {
        Swal.fire("Deleted Successfully!", "success", "success");
        window.location.reload();
      })
      .catch((err) =>
        swalWithBootstrapButtons.fire(
          "Deletion Unsuccessful!",
          "Something went wrong",
          "error"
        )
      );
  };
  return (
    <Box sx={{ margin: "30px 10px" }}>
      <h1 className="common__heading__h1"> Edit Access (All Regular Users)</h1>
      <TableContainer
        component={Paper}
        sx={{ width: "500px", marginTop: "10px" }}
      >
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allRegularUsers.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => deleteUser(row)}>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EditAccessBySuperUser;
