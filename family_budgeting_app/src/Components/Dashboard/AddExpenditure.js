import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import Swal from "sweetalert2";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});

const AddExpenditure = () => {
  const userstate = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userstate;
  const [data, setData] = useState({ addedBy: currentUser?.name });
  const [categories, setCategories] = useState([]);
  const [errs, setErrs] = useState({});
  useEffect(() => {
    let arr = [];
    arr.push({ categoryName: "food", addedBy: "default" });
    arr.push({ categoryName: "utility", addedBy: "default" });
    arr.push({ categoryName: "transportation", addedBy: "default" });
    arr.push({ categoryName: "cloth", addedBy: "default" });
    arr.push({ categoryName: "medical", addedBy: "default" });
    arr.push({ categoryName: "entertainment", addedBy: "default" });
    api
      .get("/categories")
      .then((res) => {
        // console.log("response from categories", res.data.categories);

        res.data?.categories?.map((c) => arr.push(c));
        setCategories(arr);
      })
      .catch((err) => {
        console.log(err);
        setCategories(arr);
      });
    // api
    //   .get("/categories")
    //   .then((res) => {
    //     console.log("response from categories", res.data.categories);
    //     let array = [];
    //     res.data?.categories?.forEach((c) => {
    //       array.push(c);
    //     });
    //     setCategories(array);
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  const onChange = (e) => {
    const updatedInfo = Object.assign(data, {
      [e.target.name]: e.target.value,
    });
    setData(updatedInfo);
  };

  const submitExpenditure = () => {
    console.log("expenditure data", data);
    let errors = {};
    if (!data?.categoryName) {
      Object.assign(errors, { categoryName: "required" });
    }
    if (!data?.expenditureName) {
      Object.assign(errors, { expenditureName: "required" });
    }
    if (!data?.dateOfSpending) {
      Object.assign(errors, { dateOfSpending: "required" });
    } else if (
      new Date(data?.dateOfSpending).getDate() > new Date().getDate()
    ) {
      Object.assign(errors, { dateOfSpending: "cannot add future date" });
    }
    if (!data?.totalCost) {
      Object.assign(errors, { totalCost: "required" });
    }
    if (!data?.note) {
      Object.assign(errors, { note: "required" });
    }
    setErrs(errors);
    if (Object.keys(errors).length < 1) {
      api
        .post("/expenditures/add", data)
        .then((res) => {
          console.log("res", res?.data);
          Swal.fire(
            "Expenditure added Successfully!",
            "go to show expenditures",
            "success"
          );
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <Box className="add__expenditure__component">
      <h1 className="common__heading__h1">Add Expenditure</h1>
      <Box className="form">
        <Grid container>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="categoryName"
                // value={age}
                label="Category"
                variant="standard"
                onChange={(e) => onChange(e)}
              >
                {categories?.length > 0 ? (
                  categories?.map((c) => (
                    <MenuItem value={c?.categoryName}>
                      {c?.categoryName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={"general"}>general</MenuItem>
                )}
              </Select>
            </FormControl>
            {errs.categoryName && (
              <p className="error__para">{errs.categoryName}</p>
            )}
          </Grid>
        </Grid>
        <Grid gap={4} container>
          <Grid item xs={3} className="single__input__box">
            <TextField
              size="small"
              id="standard-basic"
              label="Expenditure Name"
              variant="standard"
              name="expenditureName"
              onChange={(e) => onChange(e)}
            />
            {errs.expenditureName && (
              <p className="error__para">{errs.expenditureName}</p>
            )}
          </Grid>
          <Grid item xs={3} className="single__input__box">
            <TextField
              type="number"
              size="small"
              id="standard-basic"
              label="Total Cost (USD)"
              variant="standard"
              onChange={(e) => onChange(e)}
              name="totalCost"
            />
            {errs.totalCost && <p className="error__para">{errs.totalCost}</p>}
          </Grid>
          <Grid
            item
            xs={3}
            className="single__input__box"
            sx={{ marginTop: "-8px" }}
          >
            <p>Date of Spending</p>
            <TextField
              size="small"
              id="standard-basic"
              type="date"
              // label="Date of spending"
              variant="standard"
              name="dateOfSpending"
              onChange={(e) => onChange(e)}
            />
            {errs.dateOfSpending && (
              <p className="error__para">{errs.dateOfSpending}</p>
            )}
          </Grid>
        </Grid>
        <TextField
          size="small"
          id="standard-basic"
          label="Notes"
          variant="standard"
          sx={{ width: "85%" }}
          onChange={(e) => onChange(e)}
          name="note"
        />
        {errs.note && <p className="error__para">{errs.note}</p>}

        <Button
          variant="contained"
          size="small"
          className="common__submission__btn"
          sx={{ marginTop: "30px", width: "max-content" }}
          onClick={() => submitExpenditure()}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddExpenditure;
