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
  useTheme,
  Chip,
  Tooltip,
  Backdrop,
  CircularProgress,
  Divider,
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Select,
  InputLabel,
  MenuItem,
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
import moment from "moment";
import {
  getUserList,
  deleteUser,
  addUser,
  updateUser,
  companiesGet,
  permissionsGet,
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

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));

const PaginationTable = () => {
  const [state, setState] = useState({ date: new Date() });
  const { usersList, companiesList, permissionsList, myError } = useSelector(
    (state) => state.ecommerce
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleCloseShowError = () => {
    dispatch(errorReset());
  };
  const [currentUser, setCurrentUser] = useState({});
  const [myAction, setMyAction] = useState("");
  const handleLoadingClose = () => setLoading(false);
  const handleClickOpen = async (action, user = null) => {
    setFormEmpty();
    setOpen(true);
    await setCurrentUser(user);
    await setMyAction(action);
    if (action === "edit") {
      setState({
        ...state,
        userName: user.name,
        active: user.active,
        company: user.controlId,
        contactNumber: user.contact_number,
        password: "",
        confirmPassword: "",
        email: user.email,
        type: user.type,
        permissions: user.permissions,
      });
    }
  };
  const handleClose = () => setOpen(false);
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const [load, setLoad] = useState(false);

  // sorting
  // booking table main
  const [activeSortUserList, setActiveSortUserList] = useState("");
  const [activeSortUserListDirection, setActiveSortUserListDirection] =
    useState("asc");

  // search
  const [searchText, setSearchText] = useState("");
  if (!load) {
    dispatch(getUserList());
    dispatch(companiesGet());
    dispatch(permissionsGet());
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
    dispatch(deleteUser(user._id));
    setOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== state.password) return false;

      return true;
    });
    return () => ValidatorForm.removeValidationRule("isPasswordMatch");
  }, [usersList, state.password]);

  const handleSubmit = (event) => {
    const payload = {
      type,
      name: userName,
      email: email,
      company,
      active,
      password,
      contactNumber,
      permissions,
    };
    if (myAction === "edit") {
      dispatch(updateUser({ ...payload, id: currentUser._id }));
    } else {
      dispatch(addUser(payload));
    }
    setFormEmpty();
    setOpen(false);
  };

  const setFormEmpty = () => {
    setState({
      ...state,
      userName: "",
      active: false,
      company: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      email: "",
      type: "",
      permissions: [],
    });
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleActive = (event) => {
    event.persist();
    setState({ ...state, active: active ? false : true });
  };

  const handlePermissions = (event) => {
    const { checked, name } = event.target;
    const permissionsSet = new Set();
    const currentPermissions = [];
    for (const permission of state.permissions) {
      permissionsSet.add(permission);
    }
    if (checked) {
      permissionsSet.add(name);
    } else {
      permissionsSet.delete(name);
    }

    for (const permission of permissionsSet) {
      currentPermissions.push(permission);
    }
    event.persist();
    setState({ ...state, permissions: currentPermissions });
  };

  const handleType = (event) => {
    setState({ ...state, type: event.target.value });
  };

  const handleCompany = (event) => {
    setState({ ...state, company: event.target.value });
  };

  const {
    userName,
    company,
    contactNumber,
    password,
    confirmPassword,
    active,
    email,
    type,
    permissions,
  } = state;

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

  const getCompanyName = (ci) => {
    if (!companiesList.length) return "";
    const companies = companiesList.filter(
      (company) => company.controlId === ci
    );

    return companies.length ? companies[0].name : "";
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
          <Icon sx={{ mr: 1 }}>person</Icon>User
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
          label="Search user"
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
                  active={activeSortUserList === "name"}
                  onClick={() => sortUserDetailsTable("name")}
                  direction={activeSortUserListDirection}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={activeSortUserList === "email"}
                  onClick={() => sortUserDetailsTable("email")}
                  direction={activeSortUserListDirection}
                >
                  Email
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
                  active={activeSortUserList === "active"}
                  onClick={() => sortUserDetailsTable("active")}
                  direction={activeSortUserListDirection}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={activeSortUserList === "type"}
                  onClick={() => sortUserDetailsTable("type")}
                  direction={activeSortUserListDirection}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={activeSortUserList === "created_date"}
                  onClick={() => sortUserDetailsTable("created_date")}
                  direction={activeSortUserListDirection}
                >
                  Created Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter((obj) =>
                Object.values(obj).some((val) =>
                  val.toString().toLowerCase().includes(searchText)
                )
              )
              .sort(sort_by(activeSortUserList))
              .map((subscriber, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{subscriber.name}</TableCell>
                  <TableCell align="center">{subscriber.email}</TableCell>
                  <TableCell align="center">
                    {getCompanyName(subscriber.controlId)}
                  </TableCell>
                  <TableCell align="center">
                    {subscriber.active ? (
                      <Small bgcolor="#08ad6c">Active</Small>
                    ) : (
                      <Small bgcolor={bgError}>Inactive</Small>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={subscriber.type}
                      color="info"
                      variant="outlined"
                      style={{ height: 25, padding: "2px 8px" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {moment(subscriber.created_date).format("MM/DD/YYYY")}
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
          count={usersList.length}
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
                {myAction === "edit" ? "Edit User" : "New User"}
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <div>
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                      <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <TextField
                            type="email"
                            name="email"
                            label="Email"
                            value={email || ""}
                            required
                            onChange={handleChange}
                            validators={["required", "isEmail"]}
                            disabled={myAction === "edit" ? true : false}
                            errorMessages={[
                              "this field is required",
                              "email is not valid",
                            ]}
                          />

                          <TextField
                            type="text"
                            name="userName"
                            label="Name"
                            onChange={handleChange}
                            value={userName || ""}
                            required
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />

                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel required id="demo-simple-select-label">
                              Company
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={company || ""}
                              label="Company"
                              onChange={handleCompany}
                            >
                              {companiesList.map((company) => {
                                return (
                                  <MenuItem value={company.controlId}>
                                    {company.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>

                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel required id="demo-simple-select-label">
                              Type
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={type || ""}
                              label="Type"
                              onChange={handleType}
                            >
                              <MenuItem value="administrator">
                                Administrator
                              </MenuItem>
                              <MenuItem value="client">Client</MenuItem>
                              <MenuItem value="employee">Employee</MenuItem>
                            </Select>
                          </FormControl>

                          <FormGroup sx={{ mb: 4 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  name="active"
                                  checked={active}
                                  onChange={handleActive}
                                />
                              }
                              label="Active"
                            />
                          </FormGroup>
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <TextField
                            type="text"
                            name="contactNumber"
                            value={contactNumber || ""}
                            label="Contact Number"
                            onChange={handleChange}
                            required
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          />
                          <TextField
                            name="password"
                            type="password"
                            required
                            label={
                              myAction === "edit" ? "New Password" : "Password"
                            }
                            value={password || ""}
                            onChange={handleChange}
                            validators={myAction === "edit" ? "" : ["required"]}
                            errorMessages={["this field is required"]}
                            helperText="Password must be atleast 6 characters"
                          />
                          <TextField
                            type="password"
                            name="confirmPassword"
                            onChange={handleChange}
                            label="Confirm Password"
                            required
                            value={confirmPassword || ""}
                            validators={
                              myAction === "edit"
                                ? ""
                                : ["required", "isPasswordMatch"]
                            }
                            errorMessages={[
                              "this field is required",
                              "password didn't match",
                            ]}
                          />
                        </Grid>
                      </Grid>

                      {myAction === "edit" && (
                        <>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container sx={{ mb: 2, mt: 4 }}>
                            <b>Permissions</b>
                          </Grid>
                          <Grid container sx={{ mb: 2, mt: 4 }}>
                            Users Page
                          </Grid>
                          <Grid container spacing={4} alignItems={"center"}>
                            {permissionsList
                              .filter(
                                (permission) =>
                                  permission.access
                                    .split(":")[0]
                                    .toLowerCase() === "users"
                              )
                              .map((permission) => {
                                return (
                                  <Grid item xs={3}>
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            name={permission._id}
                                            checked={
                                              permissions
                                                ? permissions.includes(
                                                    permission._id
                                                  )
                                                  ? true
                                                  : false
                                                : false
                                            }
                                            onChange={handlePermissions}
                                          />
                                        }
                                        label={permission.access
                                          .split(":")[1]
                                          .toUpperCase()}
                                      />
                                    </FormGroup>
                                  </Grid>
                                );
                              })}
                          </Grid>

                          <Grid container sx={{ mb: 2, mt: 4 }}>
                            Booking Page
                          </Grid>
                          <Grid container spacing={4} alignItems={"center"}>
                            {permissionsList
                              .filter(
                                (permission) =>
                                  permission.access
                                    .split(":")[0]
                                    .toLowerCase() === "booking"
                              )
                              .map((permission) => {
                                return (
                                  <Grid item xs={3}>
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            name={permission._id}
                                            checked={
                                              permissions
                                                ? permissions.includes(
                                                    permission._id
                                                  )
                                                  ? true
                                                  : false
                                                : false
                                            }
                                            onChange={handlePermissions}
                                          />
                                        }
                                        label={permission.access
                                          .split(":")[1]
                                          .toUpperCase()}
                                      />
                                    </FormGroup>
                                  </Grid>
                                );
                              })}
                          </Grid>

                          <Grid container sx={{ mb: 2, mt: 4 }}>
                            Dispatch Page
                          </Grid>
                          <Grid container spacing={4} alignItems={"center"}>
                            {permissionsList
                              .filter(
                                (permission) =>
                                  permission.access
                                    .split(":")[0]
                                    .toLowerCase() === "dispatch"
                              )
                              .map((permission) => {
                                return (
                                  <Grid item xs={3}>
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            name={permission._id}
                                            checked={
                                              permissions
                                                ? permissions.includes(
                                                    permission._id
                                                  )
                                                  ? true
                                                  : false
                                                : false
                                            }
                                            onChange={handlePermissions}
                                          />
                                        }
                                        label={permission.access
                                          .split(":")[1]
                                          .toUpperCase()}
                                      />
                                    </FormGroup>
                                  </Grid>
                                );
                              })}
                          </Grid>

                          <Grid container sx={{ mb: 2, mt: 4 }}>
                            Trucks Page
                          </Grid>
                          <Grid container spacing={4} alignItems={"center"}>
                            {permissionsList
                              .filter(
                                (permission) =>
                                  permission.access
                                    .split(":")[0]
                                    .toLowerCase() === "trucks"
                              )
                              .map((permission) => {
                                return (
                                  <Grid item xs={3}>
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            name={permission._id}
                                            checked={
                                              permissions
                                                ? permissions.includes(
                                                    permission._id
                                                  )
                                                  ? true
                                                  : false
                                                : false
                                            }
                                            onChange={handlePermissions}
                                          />
                                        }
                                        label={permission.access
                                          .split(":")[1]
                                          .toUpperCase()}
                                      />
                                    </FormGroup>
                                  </Grid>
                                );
                              })}
                          </Grid>

                          <Grid container sx={{ mb: 2, mt: 4 }}>
                            Companies Page
                          </Grid>
                          <Grid container spacing={4} alignItems={"center"}>
                            {permissionsList
                              .filter(
                                (permission) =>
                                  permission.access
                                    .split(":")[0]
                                    .toLowerCase() === "companies"
                              )
                              .map((permission) => {
                                return (
                                  <Grid item xs={3}>
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            name={permission._id}
                                            checked={
                                              permissions
                                                ? permissions.includes(
                                                    permission._id
                                                  )
                                                  ? true
                                                  : false
                                                : false
                                            }
                                            onChange={handlePermissions}
                                          />
                                        }
                                        label={permission.access
                                          .split(":")[1]
                                          .toUpperCase()}
                                      />
                                    </FormGroup>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </>
                      )}

                      <Button
                        sx={{ mt: 4 }}
                        color="primary"
                        variant="contained"
                        type="submit"
                      >
                        <Icon>send</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                          Submit
                        </Span>
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
