import {
  Box,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Backdrop,
  CircularProgress,
  Divider,
  Switch,
  FormGroup,
  FormControlLabel,
  TableSortLabel,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { Span } from "app/components/Typography";
import { Button, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import {
  trucksGet,
  truckDelete,
  truckUpdate,
  trucksAdd,
  errorReset,
} from "app/redux/actions/EcommerceActions";
import { useDispatch, useSelector } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0 } },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const PaginationTable = () => {
  const [state, setState] = useState({ date: new Date() });
  const { trucksList, myError } = useSelector((state) => state.ecommerce);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [myAction, setMyAction] = useState("");
  const handleCloseShowError = () => {
    dispatch(errorReset());
  };
  const handleLoadingClose = () => setLoading(false);
  const handleClickOpen = async (action, user = null) => {
    setOpen(true);
    setFormEmpty();
    await setCurrentUser(user);
    await setMyAction(action);
    if (action === "edit") {
      setState({
        ...state,
        plate_no: user.plate_no,
        company: user.company,
        model: user.model,
        peza: user.peza,
        device_id: user.device_id,
        mobile_number: user.mobile_number,
      });
    }
  };
  const handleClose = () => setOpen(false);
  const [load, setLoad] = useState(false);

  // sorting
  // booking table main
  const [activeSortUserList, setActiveSortUserList] = useState("");
  const [activeSortUserListDirection, setActiveSortUserListDirection] =
    useState("asc");

  // search
  const [searchText, setSearchText] = useState("");
  if (!load) {
    dispatch(trucksGet());
    setLoad(true);
  }
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteUser = (user) => {
    setLoading(true);
    dispatch(truckDelete(user._id));
    setOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== state.password) return false;

      return true;
    });
    return () => ValidatorForm.removeValidationRule("isPasswordMatch");
  }, [trucksList, state.password]);

  const handleSubmit = (event) => {
    const payload = {
      plate_no,
      company,
      model,
      device_id,
      mobile_number,
      peza: peza ? peza : false,
    };
    if (myAction === "edit") {
      dispatch(truckUpdate({ ...payload, id: currentUser._id }));
    } else {
      dispatch(trucksAdd(payload));
    }
    setFormEmpty();
    setOpen(false);
  };

  const setFormEmpty = () => {
    setState({
      ...state,
      plate_no: "",
      company: "",
      model: "",
      peza: false,
      device_id: "",
      mobile_number: "",
    });
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleActive = (event) => {
    event.persist();
    setState({ ...state, peza: peza ? false : true });
  };

  const { plate_no, company, model, peza, device_id, mobile_number } = state;

  const sortUserDetailsTable = (cell) => {
    setActiveSortUserList(cell);

    cell !== activeSortUserList
      ? setActiveSortUserListDirection("asc")
      : setActiveSortUserListDirection(
          activeSortUserListDirection === "asc" ? "desc" : "asc"
        );
  };

  const sort_by = (field, isDetails = false) => {
    const key = function (x) {
      return x[field];
    };

    const reverse = !isDetails
      ? activeSortUserListDirection === "asc"
        ? 1
        : -1
      : activeSortUserListDirection === "asc"
      ? 1
      : -1;

    return function (a, b) {
      // eslint-disable-next-line
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  };

  const handleChangeSearchText = (e) => {
    e.persist();
    setSearchText(e.target.value);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => handleClickOpen("add", "")}
        >
          <Icon fontSize="large" sx={{ mr: 2 }}>
            add
          </Icon>{" "}
          <Icon sx={{ mr: 1 }}>airport_shuttle</Icon>Truck
        </StyledButton>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={myError.error}
        autoHideDuration={6000}
        onClose={handleCloseShowError}
      >
        <Alert
          onClose={handleCloseShowError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {myError.message}
        </Alert>
      </Snackbar>

      <ValidatorForm onSubmit={(e) => e.preventDefault}>
        <TextField
          label="Search truck"
          value={searchText}
          onChange={handleChangeSearchText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </ValidatorForm>

      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <TableSortLabel
                  active={activeSortUserList === "plate_no"}
                  onClick={() => sortUserDetailsTable("plate_no")}
                  direction={activeSortUserListDirection}
                >
                  Plate No
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={activeSortUserList === "company"}
                  onClick={() => sortUserDetailsTable("company")}
                  direction={activeSortUserListDirection}
                >
                  Company
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={activeSortUserList === "model"}
                  onClick={() => sortUserDetailsTable("model")}
                  direction={activeSortUserListDirection}
                >
                  Model
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={activeSortUserList === "peza"}
                  onClick={() => sortUserDetailsTable("peza")}
                  direction={activeSortUserListDirection}
                >
                  PEZA
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trucksList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter((obj) =>
                Object.values(obj).some((val) =>
                  val.toString().toLowerCase().includes(searchText)
                )
              )
              .sort(sort_by(activeSortUserList))
              .map((subscriber, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{subscriber.plate_no}</TableCell>
                  <TableCell align="center">{subscriber.company}</TableCell>
                  <TableCell align="center">{subscriber.model}</TableCell>
                  <TableCell align="center">
                    {subscriber.peza ? "TRUE" : "FALSE"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleClickOpen("edit", subscriber)}
                      >
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleClickOpen("delete", subscriber)}
                      >
                        <Icon color="error">delete</Icon>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </StyledTable>

        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={trucksList.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={myAction === "delete" ? false : true}
          maxWidth={"lg"}
        >
          {myAction === "delete" ? (
            <>
              <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>

              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete <b>{currentUser.name}</b>?
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => handleDeleteUser(currentUser)}
                  color="primary"
                  autoFocus
                >
                  Yes
                </Button>
                <Button onClick={handleClose} color="primary">
                  No
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <DialogTitle id="alert-dialog-title">
                {myAction === "edit" ? "Edit Truck" : "New Truck"}
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <div>
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                      <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <TextField
                            type="text"
                            name="plate_no"
                            label="Plate No"
                            value={plate_no || ""}
                            onChange={handleChange}
                            required
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                          <TextField
                            type="text"
                            name="company"
                            label="Company"
                            onChange={handleChange}
                            value={company || ""}
                            required
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />

                          <TextField
                            type="text"
                            name="mobile_number"
                            value={mobile_number || ""}
                            label="Mobile Number"
                            onChange={handleChange}
                            required
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <TextField
                            type="text"
                            name="model"
                            value={model || ""}
                            label="Model"
                            required
                            onChange={handleChange}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />

                          <TextField
                            type="text"
                            name="device_id"
                            value={device_id || ""}
                            label="Device ID"
                            onChange={handleChange}
                            required
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />

                          <FormGroup sx={{ mb: 4 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  name="peza"
                                  checked={peza}
                                  onChange={handleActive}
                                />
                              }
                              label="PEZA"
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>

                      <Button color="primary" variant="contained" type="submit">
                        <Icon>send</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                          Submit
                        </Span>
                      </Button>
                      <Button color="info" sx={{ ml: 2 }}>
                        <a
                          href={`${process.env.REACT_APP_WIALON_REPO_URL}:8080/get_units.html?unit=${plate_no}&token=${process.env.REACT_APP_WIALON_TOKEN}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Get Truck ID
                        </a>
                      </Button>
                    </ValidatorForm>
                  </div>
                </DialogContentText>
              </DialogContent>
              {myAction === "delete" ? (
                <DialogActions>
                  <Button
                    onClick={() => handleDeleteUser(currentUser)}
                    color="primary"
                    autoFocus
                  >
                    Yes
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    No
                  </Button>
                </DialogActions>
              ) : (
                ""
              )}
            </>
          )}
        </Dialog>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleLoadingClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </>
  );
};

export default PaginationTable;
