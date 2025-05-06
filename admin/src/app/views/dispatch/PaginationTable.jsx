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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Tabs,
  Tab,
  TableSortLabel,
  InputAdornment,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import SearchIcon from "@mui/icons-material/Search";
import { Span } from "app/components/Typography";
import { Button, Checkbox, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import moment from "moment";
import {
  getUserList,
  addUser,
  updateUser,
  bookingGet,
  bookingUpdate,
  bookingDelete,
  trucksGet,
  companiesGet,
  errorReset,
} from "app/redux/actions/EcommerceActions";
import { useDispatch, useSelector } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useAuth from "app/hooks/useAuth";

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PaginationTable = () => {
  const [state, setState] = useState({
    date: new Date(),
    _id: "",
    quantity: 1,
    size: "",
    client: "",
    consignee: "",
    additional_fields: "",
    delivery_date: "",
    weight: "",
    peza: false,
    isImport: false,
    booking_details: [],
    container_no: "",
  });
  const { usersList, bookingsList, trucksList, companiesList, myError } =
    useSelector((state) => state.ecommerce);

  // selected reference table
  const [selectedReferenceTableList, setSelectedReferenceTableList] = useState(
    []
  );

  // show booking details
  const [showBookingDetails, setShowBookingDetails] = useState(true);

  // set booking details

  const [bookingDetails, setStateBookingDetails] = useState({
    task: "",
    address: "",
    time: "",
    status: "",
    plate_no: "",
    shipping_line: "",
    chasis_no: "",
  });

  const handleCloseShowError = () => {
    dispatch(errorReset());
  };

  const [hasTrucksPermission, setHasTrucksPermission] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTrack, setOpenTrack] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState([]);
  const [selectedToken, setSelectedToken] = useState(
    process.env.REACT_APP_WIALON_TOKEN
  );
  const [currentUser, setCurrentUser] = useState({});
  const [myAction, setMyAction] = useState("");
  const handleLoadingClose = () => setLoading(false);
  const handleClickOpen = async (action, user = null) => {
    setOpen(true);
    await setCurrentUser(user);
    await setMyAction(action);
    setActiveSortDispatchDetails("");
    setActiveSortDispatchDetailsDirection("asc");
    setSearchText("");
    setFormEmpty();
    setBookingDetailsEmpty();
    autoCompleteSetValue("");
    autoCompleteSetInputValue("");
    setSelectedReferenceTableList([]);

    if (action === "edit") {
      const detailsBooking = bookingsList.filter((x) => x._id === user._id);
      setSelectedReferenceTableList(detailsBooking[0].booking_details);
      autoCompleteSetValue(user._id);
      autoCompleteSetInputValue(user._id);

      setState({
        ...state,
        _id: user._id,
        quantity: user.quantity,
        size: user.size,
        client: user.client,
        consignee: user.consignee,
        additional_fields: user.additional_fields,
        delivery_date: moment(user.delivery_date).format("YYYY-MM-DD HH:mm:ss"),
        booking_details: user.booking_details,
        weight: user.weight,
        peza: user.peza,
        isImport: user.type,
        container_no: user.container_no,
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
    setSearchText("");
  };

  const handleClickOpenTrack = async (obj, open = true) => {
    await obj.reverse().forEach((x) => {
      if (x.status === "transit") {
        const truck = trucksList.filter((truck) => truck._id === x.plate_no);
        if (truck.length) {
          setSelectedDeviceId(truck[0].device_id);
          setOpenTrack(true);
          return;
        }
      }
    });

    if (!selectedDeviceId.length) {
      alert("No Truck and/or In-Transit status to locate.");
    }
  };
  const handleCloseTrack = () => {
    setOpenTrack(false);
  };

  const [load, setLoad] = useState(false);
  if (!load) {
    dispatch(bookingGet());
    dispatch(getUserList());
    dispatch(trucksGet());
    dispatch(companiesGet());
    // show/hide depends on users trucks permission
    for (const permission of user.permissions) {
      if (permission.access === "trucks:fullAccess") {
        setHasTrucksPermission(true);
      }
    }
    setLoad(true);
  }
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // sorting
  // dispatch table main
  const [activeSortDispatchList, setActiveSortDispatchList] = useState("");
  const [activeSortDispatchListDirection, setActiveSortDispatchListDirection] =
    useState("asc");

  // dispatch table details
  const [activeSortDispatchDetails, setActiveSortDispatchDetails] =
    useState("");
  const [
    activeSortDispatchDetailsDirection,
    setActiveSortDispatchDetailsDirection,
  ] = useState("asc");

  // search
  const [searchText, setSearchText] = useState("");

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteUser = (user) => {
    setLoading(true);
    dispatch(bookingDelete(user._id));
    setOpen(false);
    setLoading(false);
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleClient = (event) => {
    setState({ ...state, client: event.target.value });
  };

  const renderClientList = () => {
    const clientList = [];
    clientList.push(
      <MenuItem key="" value="">
        &nbsp;
      </MenuItem>
    );
    companiesList.forEach((element) => {
      clientList.push(
        <MenuItem key={element._id} value={element._id}>
          {element.name}
        </MenuItem>
      );
    });
    return clientList;
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== state.password) return false;

      return true;
    });
    return () => ValidatorForm.removeValidationRule("isPasswordMatch");
  }, [usersList, bookingsList, selectedReferenceTableList, state.password]);

  const handleSubmit = (event) => {
    const payload = state;
    if (myAction === "edit") {
      dispatch(updateUser({ ...payload, id: currentUser._id }));
    } else {
      dispatch(addUser(payload));
    }
    setFormEmpty();
    setOpen(false);
  };

  const {
    _id,
    quantity,
    size,
    client,
    consignee,
    additional_fields,
    delivery_date,
    weight,
    peza,
    isImport,
    container_no,
  } = state;

  const handleJobSelect = (e) => {
    if (e !== null) {
      const detailsBooking = bookingsList.filter((x) => x._id === e._id);
      setSelectedReferenceTableList(detailsBooking[0].booking_details);

      detailsBooking[0].delivery_date = moment(
        detailsBooking[0].delivery_date
      ).format("YYYY-MM-DD HH:mm:ss");
      detailsBooking[0].isImport = detailsBooking[0].type;
      setState({ ...state, ...detailsBooking[0] });
    } else {
      setSelectedReferenceTableList([]);
      setFormEmpty();
    }
  };

  const selectBookingDetail = (val) => {
    val.time = moment(val.time).format("YYYY-MM-DD HH:mm:ss");
    setStateBookingDetails({ ...bookingDetails, ...val });
  };

  // Tab Functions
  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };
  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };
  const [tabValue, tabsetValue] = useState(0);

  const tabhandleChange = (event, newValue) => {
    tabsetValue(newValue);
  };

  // checkbox
  const [isCheck, setIsCheck] = useState([]);
  const handleSelectAll = (e) => {
    setIsCheck(bookingsList.map((li) => li._id));
    if (!e.target.checked) {
      setIsCheck([]);
    }
  };

  const checkedDispatch = (e) => {
    const arr = isCheck;
    const val = e.target.value;
    const index = arr.indexOf(val);
    if (index === -1) {
      arr.push(val);
      setIsCheck([...arr]);
    } else {
      arr.splice(index, 1);
      setIsCheck([...arr]);
    }
  };

  const getName = (id) => {
    const user = usersList.find((user) => user._id === id);
    if (!user) return "";

    return user.company;
  };

  const getClientName = (id) => {
    const company = companiesList.find((company) => company._id == id);
    if (!company) return "";

    return company.name;
  };

  const sortDispatchTable = (cell) => {
    setActiveSortDispatchList(cell);

    cell !== activeSortDispatchList
      ? setActiveSortDispatchListDirection("asc")
      : setActiveSortDispatchListDirection(
          activeSortDispatchListDirection === "asc" ? "desc" : "asc"
        );
  };

  const sortDispatchDetailsTable = (cell) => {
    setActiveSortDispatchDetails(cell);

    cell !== activeSortDispatchDetails
      ? setActiveSortDispatchDetailsDirection("asc")
      : setActiveSortDispatchDetailsDirection(
          activeSortDispatchDetailsDirection === "asc" ? "desc" : "asc"
        );
  };

  const sort_by = (field, isDetails = false) => {
    const key = function (x) {
      return field === "client" ? x.booking[field] : x[field];
    };

    const reverse = !isDetails
      ? activeSortDispatchListDirection === "asc"
        ? 1
        : -1
      : activeSortDispatchDetailsDirection === "asc"
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

  // autoComplete
  const [autoCompleteValue, autoCompleteSetValue] = useState("");
  const [autoCompleteInputValue, autoCompleteSetInputValue] = useState("");

  const handleSaveChanges = async (event) => {
    const payload = state;

    if (myAction === "edit") {
      dispatch(bookingUpdate({ ...payload, id: payload._id }));
    }
    setFormEmpty();
    setOpen(false);
  };

  const setFormEmpty = () => {
    setState({
      ...state,
      _id: "",
      quantity: 1,
      size: "0cm x 0cm x 0cm",
      client: "",
      consignee: "",
      additional_fields: "",
      weight: "",
      peza: false,
      isImport: false,
      booking_details: [],
      container_no: "",
    });
  };

  const setBookingDetailsEmpty = () => {
    setStateBookingDetails({
      ...bookingDetails,
      task: "",
      address: "",
      time: "",
      status: "",
      plate_no: "",
      shipping_line: "",
    });
  };

  const handleTask = (event) => {
    setStateBookingDetails({ ...bookingDetails, task: event.target.value });
  };

  const handlePlateNo = (event) => {
    setStateBookingDetails({ ...bookingDetails, plate_no: event.target.value });
  };

  const handleChangeBookingDetails = (event) => {
    event.persist();
    setStateBookingDetails({
      ...bookingDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleStatus = (event) => {
    setStateBookingDetails({ ...bookingDetails, status: event.target.value });
  };

  const handleDispatch = (e) => {
    e.persist();
    const payload = {
      _id: state._id,
      booking_details: state.booking_details,
    };

    // let currentIndex = 0;
    // payload.booking_details.map((item) => {
    //   let obj = Object.assign({}, item);
    //   if (currentIndex > 0) {
    //     if (
    //       bookingDetails.status !== "unassigned" &&
    //       state.booking_details[currentIndex - 1].status !== "completed"
    //     ) {
    //       alert(
    //         `Unable to assign status to ${bookingDetails.status}, other task must be completed first.`
    //       );
    //       return obj;
    //     }
    //   }

    //   if (
    //     bookingDetails.plate_no === "" &&
    //     bookingDetails.status !== "unassigned"
    //   ) {
    //     alert(
    //       `Unable to assign status to ${bookingDetails.status}, Plate No should not be empty.`
    //     );
    //     return obj;
    //   }

    //   if (item._id === bookingDetails._id) {
    //     obj = Object.assign(item, bookingDetails);
    //     return obj;
    //   }
    //   currentIndex++;
    //   return obj;
    // });

    for (
      let currentIndex = 0;
      currentIndex < payload.booking_details.length;
      currentIndex++
    ) {
      const item = payload.booking_details[currentIndex];
      let obj = Object.assign({}, item);

      if (currentIndex > 0) {
        if (
          bookingDetails.status !== "unassigned" &&
          state.booking_details[currentIndex - 1].status !== "completed"
        ) {
          alert(
            `Unable to assign status to ${bookingDetails.status}, other task must be completed first.`
          );
          break;
        }
      }

      if (
        bookingDetails.plate_no === "" &&
        bookingDetails.status !== "unassigned"
      ) {
        alert(
          `Unable to assign status to ${bookingDetails.status}, Plate No should not be empty.`
        );
        break;
      }

      if (item._id === bookingDetails._id) {
        obj = Object.assign(item, bookingDetails);
        return obj;
      }
    }

    dispatch(bookingUpdate({ ...payload, id: state._id }));
    setFormEmpty();
    setBookingDetailsEmpty();
  };

  const handleIsImport = (event) => {
    event.persist();
    setState({
      ...state,
      isImport: state.isImport ? false : true,
    });
  };

  const handleIsPeza = (event) => {
    event.persist();
    setState({
      ...state,
      peza: state.peza ? false : true,
    });
  };

  const showHideBookingDetailsById = (id) => {
    if (showBookingDetails[id]) {
      const obj = showBookingDetails;
      delete obj[id];
      setShowBookingDetails({ ...obj });
    } else {
      setShowBookingDetails({ ...showBookingDetails, [id]: true });
    }
  };

  const options = [];
  bookingsList.forEach((option) => {
    option.booking_details.forEach((res) => {
      if (res.chasis_no) {
        options.push({
          label: res.chasis_no,
          _id: option._id,
        });
      }
    });
  });

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        {hasTrucksPermission ? (
          <StyledButton
            variant="contained"
            color="primary"
            // onClick={() => handleClickOpen('add', '')}
            component={Link}
            to="/trucks"
          >
            <Icon fontSize="large" sx={{ mr: 2 }}>
              add
            </Icon>{" "}
            <Icon sx={{ mr: 1 }}>local_shipping</Icon>Trucks
          </StyledButton>
        ) : (
          ""
        )}
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
          label="Search dispatched"
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
              <StyledTableCell sx={{ width: "5%" }}>
                <Checkbox
                  color="primary"
                  onClick={handleSelectAll}
                  inputProps={{
                    "aria-labelledby": "test",
                  }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "_id"}
                  onClick={() => sortDispatchTable("_id")}
                  direction={activeSortDispatchListDirection}
                >
                  Job Reference
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "client"}
                  onClick={() => sortDispatchTable("client")}
                  direction={activeSortDispatchListDirection}
                >
                  Client
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "consignee"}
                  onClick={() => sortDispatchTable("consignee")}
                  direction={activeSortDispatchListDirection}
                >
                  Consignee
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "container_no"}
                  onClick={() => sortDispatchTable("container_no")}
                  direction={activeSortDispatchListDirection}
                >
                  Container No.
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "size"}
                  onClick={() => sortDispatchTable("size")}
                  direction={activeSortDispatchListDirection}
                >
                  Size
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "delivery_date"}
                  onClick={() => sortDispatchTable("delivery_date")}
                  direction={activeSortDispatchListDirection}
                >
                  Delivery Date
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "type"}
                  onClick={() => sortDispatchTable("type")}
                  direction={activeSortDispatchListDirection}
                >
                  Type
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortDispatchList === "status"}
                  onClick={() => sortDispatchTable("status")}
                  direction={activeSortDispatchListDirection}
                >
                  Status
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }}>Action</StyledTableCell>
            </TableRow>
          </TableHead>

          {bookingsList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .filter((obj) =>
              Object.values(obj).some(
                (val) =>
                  (val !== null &&
                    val
                      .toString()
                      .toLowerCase()
                      .includes(searchText.toString().toLocaleLowerCase())) ||
                  getName(Object.values(obj)[2])
                    .toString()
                    .toLowerCase()
                    .includes(searchText.toString().toLocaleLowerCase())
              )
            )
            .sort(sort_by(activeSortDispatchList))
            .map((x, index) => {
              return (
                <TableBody key={index}>
                  <StyledTableRow>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      <Checkbox
                        color="primary"
                        checked={isCheck.includes(x._id)}
                        onClick={checkedDispatch}
                        value={x._id}
                        inputProps={{
                          "aria-labelledby": "test",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      {x._id}
                    </TableCell>
                    <TableCell
                      sx={{ borderBottom: "none", fontWeight: "bold" }}
                      xs="auto"
                    >
                      {(!x.client ? "" : getClientName(x.client)).toUpperCase()}
                    </TableCell>
                    <TableCell
                      sx={{ borderBottom: "none", fontWeight: "bold" }}
                      xs="auto"
                    >
                      {x.consignee.toUpperCase()}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      {x.container_no}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      {x.size}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      {moment(x.delivery_date).format("llll")}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      {x.type ? "Import" : "Export"}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      {x.status}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      <Tooltip title="Current Location">
                        <IconButton
                          onClick={(e) =>
                            handleClickOpenTrack(x.booking_details)
                          }
                        >
                          <Icon color="primary">airport_shuttle</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleClickOpen("edit", x)}>
                          <Icon color="primary">edit</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleClickOpen("delete", x)}
                        >
                          <Icon color="error">delete</Icon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                  <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell colSpan={8}>
                      <div
                        style={{
                          maxHeight: "300px",
                          display: "flex",
                          flexDirection: "column",
                          overflowY: "auto",
                          padding: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: x.additional_fields === "" ? "none" : "",
                          }}
                        >
                          <div
                            style={{ marginBottom: "8px", fontWeight: "bold" }}
                          >
                            Additional details
                          </div>
                          <div
                            style={{ marginBottom: "20px" }}
                            dangerouslySetInnerHTML={{
                              __html: x.additional_fields,
                            }}
                          ></div>
                        </div>

                        <div
                          style={{
                            display: x.booking_details.length > 0 ? "" : "none",
                          }}
                        >
                          <div style={{ marginBottom: "20px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <b>Booking Details</b>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  showHideBookingDetailsById(x._id)
                                }
                              >
                                {!showBookingDetails[x._id] ? (
                                  <VisibilityOff
                                    style={{
                                      filter:
                                        "invert(22%) sepia(98%) saturate(7191%) hue-rotate(358deg) brightness(102%) contrast(112%)",
                                    }}
                                  />
                                ) : (
                                  <Visibility
                                    style={{
                                      filter:
                                        "invert(61%) sepia(98%) saturate(3952%) hue-rotate(88deg) brightness(126%) contrast(119%)",
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            <hr />
                          </div>
                          <div
                            style={{
                              display: !showBookingDetails[x._id]
                                ? "flex"
                                : "none",
                              fontWeight: "bold",
                              marginBottom: "20px",
                            }}
                          >
                            <div style={{ flex: "1" }}>Task</div>
                            <div style={{ flex: "2" }}>Shipping Line</div>
                            <div style={{ flex: "1" }}>Plate No</div>
                            <div style={{ flex: "2" }}>Address</div>
                            <div style={{ flex: "2" }}>Time</div>
                            <div style={{ flex: "1" }}>Status</div>
                          </div>
                          {x.booking_details.map((y, yindex) => {
                            return (
                              <div
                                key={yindex}
                                style={{
                                  display: !showBookingDetails[x._id]
                                    ? "flex"
                                    : "none",
                                  marginBottom: "10px",
                                }}
                              >
                                <div style={{ flex: "1" }}>{y.task}</div>
                                <div style={{ flex: "2" }}>
                                  {y.shipping_line
                                    ? y.shipping_line.toUpperCase()
                                    : ""}
                                </div>
                                <div style={{ flex: "1" }}>
                                  {y.plate_no
                                    ? trucksList.map((res) => {
                                        if (res._id === y.plate_no) {
                                          return res.plate_no;
                                        } else {
                                          return "";
                                        }
                                      })
                                    : ""}
                                </div>
                                <div style={{ flex: "2" }}>
                                  {y.address ? y.address.toUpperCase() : ""}
                                </div>
                                <div style={{ flex: "2" }}>
                                  {moment(y.time).format("llll")}
                                </div>
                                <div style={{ flex: "1" }}>
                                  {y.status ? y.status.toUpperCase() : ""}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
        </StyledTable>

        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={bookingsList.length}
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
                {myAction === "edit" ? "Edit Dispatch" : "New Dispatch"}
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <div>
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                      <Grid container spacing={6}>
                        <Grid
                          item
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{ mt: 2, mb: 2 }}
                        >
                          <Autocomplete
                            sx={{
                              "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true']":
                                {
                                  backgroundColor: "#FFFFFF",
                                },
                            }}
                            defaultValue={autoCompleteValue}
                            value={autoCompleteValue}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            onChange={(event, newValue) => {
                              handleJobSelect(newValue);
                              autoCompleteSetValue(newValue);
                            }}
                            inputValue={autoCompleteInputValue}
                            onInputChange={(event, newInputValue) => {
                              autoCompleteSetInputValue(newInputValue);
                            }}
                            disablePortal
                            options={options}
                            groupBy={(option) => option._id}
                            getOptionLabel={(option) => option.label || ""}
                            renderInput={(params) => (
                              <TextField {...params} label="Job Reference" />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ mb: 2 }} />

                      <Grid container spacing={6} sx={{ mb: 2 }}>
                        <Grid
                          item
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{ mt: 2, mb: 2 }}
                        >
                          <TextField
                            type="text"
                            name="reference"
                            label="Job Reference No."
                            value={_id || "auto generated"}
                            onChange={handleChange}
                            validators={["required"]}
                            disabled
                            errorMessages={["this field is required"]}
                          />

                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="demo-simple-select-label">
                              Client
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={client || ""}
                              label="Client"
                              onChange={handleClient}
                              disabled
                            >
                              {renderClientList()}
                            </Select>
                          </FormControl>

                          <TextField
                            multiline
                            name="additional_fields"
                            label="Additional Field"
                            value={additional_fields || ""}
                            minRows={5}
                            onChange={handleChange}
                            disabled
                          />

                          <FormGroup sx={{ mb: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  name="peza"
                                  checked={peza}
                                  onChange={handleIsPeza}
                                />
                              }
                              label="PEZA"
                              disabled
                            />
                          </FormGroup>

                          <FormGroup sx={{ mb: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  name="isImport"
                                  checked={isImport}
                                  onChange={handleIsImport}
                                />
                              }
                              label="Import"
                              disabled
                            />
                          </FormGroup>
                        </Grid>

                        <Grid
                          item
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{ mt: 2, mb: 2 }}
                        >
                          <TextField
                            type="number"
                            name="quantity"
                            value={quantity || 0}
                            label="Quantity"
                            onChange={handleChange}
                            InputProps={{
                              inputProps: { min: 0 },
                            }}
                            disabled
                          />

                          <TextField
                            name="size"
                            type="text"
                            label="Size"
                            value={size || "0cm x 0cm x 0cm"}
                            onChange={handleChange}
                          />

                          <TextField
                            name="weight"
                            type="text"
                            label="Weight"
                            value={weight || ""}
                            onChange={handleChange}
                            disabled
                          />

                          <TextField
                            name="consignee"
                            type="text"
                            label="Consignee"
                            value={consignee || ""}
                            onChange={handleChange}
                            disabled
                          />

                          <TextField
                            id="datetime-local"
                            name="delivery_date"
                            label="Delivery date"
                            type="datetime-local"
                            value={delivery_date || ""}
                            onChange={handleChange}
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />

                          <TextField
                            sx={{ mb: 2 }}
                            type="text"
                            name="container_no"
                            label="Container No."
                            onChange={handleChange}
                            value={container_no}
                            disabled={isImport ? true : false}
                          />
                        </Grid>
                      </Grid>

                      <Button
                        color="primary"
                        variant="contained"
                        sx={{ mb: 3 }}
                        onClick={handleSaveChanges}
                      >
                        <Icon>note_add</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                          Save Changes
                        </Span>
                      </Button>

                      <Divider sx={{ mb: 2 }} />

                      <Grid
                        container
                        spacing={6}
                        style={{
                          display: bookingDetails.task === "" ? "none" : "flex",
                        }}
                      >
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="demo-simple-select-label">
                              Task
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={bookingDetails.task}
                              label="Task"
                              onChange={handleTask}
                            >
                              <MenuItem value="">&nbsp;</MenuItem>
                              <MenuItem value="PICK-UP">Pick-up</MenuItem>
                              <MenuItem value="DROP-OFF">Drop-off</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            type="text"
                            sx={{ mb: 2 }}
                            name="address"
                            label="Address"
                            onChange={handleChangeBookingDetails}
                            value={bookingDetails.address}
                          />

                          {/* <TextField
                            sx={{ mb: 2 }}
                            type="text"
                            name="plate_no"
                            label="Plate No."
                            onChange={handleChangeBookingDetails}
                            value={bookingDetails.plate_no}
                          /> */}

                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Plate No.</InputLabel>
                            <Select
                              value={bookingDetails.plate_no}
                              label="Plate No."
                              onChange={handlePlateNo}
                            >
                              <MenuItem value="">&nbsp;</MenuItem>
                              {trucksList.map((x, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={x._id}
                                    disabled={x.status !== "Available"}
                                  >
                                    {x.plate_no +
                                      ` | PEZA:${
                                        peza ? "yes" : "no"
                                      } | status: ${x.status}`}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>

                          <TextField
                            sx={{ mb: 2 }}
                            type="text"
                            name="chasis_no"
                            label="Chasis No."
                            onChange={handleChangeBookingDetails}
                            value={bookingDetails.chasis_no}
                          />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <TextField
                            id="datetime-local"
                            name="time"
                            label="Time / Date"
                            type="datetime-local"
                            value={bookingDetails.time}
                            onChange={handleChangeBookingDetails}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />

                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="demo-simple-select-label">
                              Status
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={bookingDetails.status}
                              label="Status"
                              onChange={handleStatus}
                            >
                              <MenuItem value="">&nbsp;</MenuItem>
                              <MenuItem value="unassigned">Unassigned</MenuItem>
                              <MenuItem value="transit">In-Transit</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            sx={{ mb: 2 }}
                            type="text"
                            name="shipping_line"
                            label="Shipping Line"
                            onChange={handleChangeBookingDetails}
                            value={bookingDetails.shipping_line}
                          />
                        </Grid>
                      </Grid>

                      <Button
                        color="primary"
                        variant="contained"
                        sx={{ mb: 3 }}
                        style={{
                          display:
                            bookingDetails.task === "" ? "none" : "inline-flex",
                        }}
                        onClick={handleDispatch}
                      >
                        <Icon>note_add</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                          Dispatch
                        </Span>
                      </Button>

                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          padding: "unset",
                        }}
                      >
                        <Tabs
                          value={tabValue}
                          onChange={tabhandleChange}
                          aria-label="basic tabs example"
                          sx={{ mb: 3 }}
                        >
                          <Tab label="Unassigned" {...a11yProps(0)} />
                          <Tab label="Dispatched" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <TabPanel value={tabValue} index={0}>
                        {/*  */}
                        <StyledTable
                          sx={{
                            mb: 3,
                            border: 1,
                            borderColor: "grey.300",
                            padding: 10,
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={activeSortDispatchDetails === "task"}
                                  onClick={() =>
                                    sortDispatchDetailsTable("task")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Task
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails ===
                                    "shipping_line"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("shipping_line")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Shipping Line
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "plate_no"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("plate_no")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Plate No.
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "chasis_no"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("chasis_no")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Chasis No.
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "address"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("address")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Address
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={activeSortDispatchDetails === "time"}
                                  onClick={() =>
                                    sortDispatchDetailsTable("time")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Time / Date
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "status"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("status")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Status
                                </TableSortLabel>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedReferenceTableList
                              .filter((x) => x.status === "unassigned")
                              .sort(sort_by(activeSortDispatchDetails, true))
                              .map((element, index) => {
                                return (
                                  <TableRow
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => selectBookingDetail(element)}
                                  >
                                    <TableCell align="center">
                                      {element.task}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.shipping_line}
                                    </TableCell>
                                    <TableCell align="center">
                                      {trucksList.map((res) => {
                                        if (res._id === element.plate_no) {
                                          return res.plate_no;
                                        } else {
                                          return "";
                                        }
                                      })}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.chasis_no}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.address}
                                    </TableCell>
                                    <TableCell align="center">
                                      {moment(element.time).format("llll")}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.status}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </StyledTable>
                        {/*  */}
                      </TabPanel>
                      <TabPanel value={tabValue} index={1}>
                        {/*  */}
                        <StyledTable
                          sx={{
                            mb: 3,
                            border: 1,
                            borderColor: "grey.300",
                            padding: 10,
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={activeSortDispatchDetails === "task"}
                                  onClick={() =>
                                    sortDispatchDetailsTable("task")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Task
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails ===
                                    "shipping_line"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("shipping_line")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Shipping Line
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "plate_no"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("plate_no")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Plate No.
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "chasis_no"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("chasis_no")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Chasis No.
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "address"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("address")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Address
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={activeSortDispatchDetails === "time"}
                                  onClick={() =>
                                    sortDispatchDetailsTable("time")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Time / Date
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "status"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("status")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Status
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={
                                    activeSortDispatchDetails === "isImport"
                                  }
                                  onClick={() =>
                                    sortDispatchDetailsTable("isImport")
                                  }
                                  direction={activeSortDispatchDetailsDirection}
                                >
                                  Type
                                </TableSortLabel>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedReferenceTableList
                              .filter((x) => x.status !== "unnassigned")
                              .sort(sort_by(activeSortDispatchDetails, true))
                              .map((element, index) => {
                                return (
                                  <TableRow
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => selectBookingDetail(element)}
                                  >
                                    <TableCell align="center">
                                      {element.task}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.shipping_line}
                                    </TableCell>
                                    <TableCell align="center">
                                      {trucksList.map((res) => {
                                        if (res._id === element.plate_no) {
                                          return res.plate_no;
                                        } else {
                                          return "";
                                        }
                                      })}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.chasis_no}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.address}
                                    </TableCell>
                                    <TableCell align="center">
                                      {moment(element.time).format("llll")}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.status}
                                    </TableCell>
                                    <TableCell align="center">
                                      {element.isImport ? "Import" : "Export"}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </StyledTable>
                      </TabPanel>
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

        <Dialog
          open={openTrack}
          onClose={handleCloseTrack}
          aria-labelledby="alert-dialog-track"
          aria-describedby="alert-dialog-track"
          fullWidth={true}
          maxWidth={"lg"}
        >
          <iframe
            src={
              `${process.env.REACT_APP_WIALON_REPO_URL}:8080/unit_map.html?device_id=${selectedDeviceId}&token=${selectedToken}&random=` +
              new Date().getTime() +
              Math.floor(Math.random() * 1000000)
            }
            title="Iframe Example"
            style={{ width: "100%", height: "100vh" }}
          ></iframe>
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
