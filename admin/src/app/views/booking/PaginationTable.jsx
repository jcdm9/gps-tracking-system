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
  TableSortLabel,
  Tooltip,
  Backdrop,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormGroup,
  Switch,
  InputAdornment,
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
  bookingAdd,
  bookingGet,
  getUserList,
  bookingDelete,
  bookingUpdate,
  trucksGet,
  companiesGet,
  errorReset,
} from "app/redux/actions/EcommerceActions";
import { useDispatch, useSelector } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const PaginationTable = () => {
  const [state, setState] = useState({
    date: new Date(),
    reference: "",
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
  const [booking_details, setStateBookingDetails] = useState({
    task: "",
    address: "",
    time: "",
    status: "unassigned",
    plate_no: "",
    shipping_line: "",
    chasis_no: "",
    row: "",
  });
  const { usersList, bookingsList, trucksList, companiesList, myError } =
    useSelector((state) => state.ecommerce);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({});
  const [myAction, setMyAction] = useState("");
  const handleLoadingClose = () => setLoading(false);
  const [isCheck, setIsCheck] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  // sorting
  // booking table main
  const [activeSortBookingList, setActiveSortBookingList] = useState("");
  const [activeSortBookingListDirection, setActiveSortBookingListDirection] =
    useState("asc");

  // booking table details
  const [activeSortBookingDetails, setActiveSortBookingDetails] = useState("");
  const [
    activeSortBookingDetailsDirection,
    setActiveSortBookingDetailsDirection,
  ] = useState("asc");

  // search
  const [searchText, setSearchText] = useState("");
  const [openTrack, setOpenTrack] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState([]);
  const [selectedToken, setSelectedToken] = useState(
    process.env.REACT_APP_WIALON_TOKEN
  );

  // show booking details
  const [showBookingDetails, setShowBookingDetails] = useState({});

  const handleCloseShowError = () => {
    dispatch(errorReset());
  };

  const handleClickOpen = async (action, booking = null) => {
    setOpen(true);
    await setCurrentBooking(booking);
    await setMyAction(action);
    setSearchText("");

    setActiveSortBookingDetails("");
    setActiveSortBookingDetailsDirection("asc");
    setRowCount(0);
    if (action === "edit") {
      setState({
        ...state,
        _id: booking._id,
        quantity: booking.quantity,
        size: booking.size,
        client: booking.client,
        consignee: booking.consignee,
        additional_fields: booking.additional_fields,
        booking_details: booking.booking_details,
        delivery_date: moment(booking.delivery_date).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        weight: booking.weight,
        peza: booking.peza,
        isImport: booking.type,
        container_no: booking.container_no,
      });
    } else if (action === "add") {
      setFormEmpty();
      setFormEmptyBookingDetails();
    }
  };
  const handleClose = () => {
    setOpen(false);
    setSearchText("");
  };

  const [load, setLoad] = useState(false);
  if (!load) {
    dispatch(bookingGet());
    dispatch(getUserList());
    dispatch(trucksGet());
    dispatch(companiesGet());
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

  const handleDeleteBooking = (booking) => {
    setLoading(true);
    dispatch(bookingDelete(booking._id));
    setOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== state.password) return false;

      return true;
    });
    return () => ValidatorForm.removeValidationRule("isPasswordMatch");
  }, [usersList, bookingsList, state.password]);

  const handleSubmit = async (event) => {
    const payload = state;

    if (myAction === "edit") {
      // edit booking
      dispatch(bookingUpdate({ ...payload, id: currentBooking._id }));
    } else {
      if (!state.booking_details.length) {
        alert("Unable to proceed without booking tasks.");
        return;
      }
      // add booking
      dispatch(bookingAdd(payload));
    }
    setFormEmpty();
    setFormEmptyBookingDetails();
    setOpen(false);
  };

  const setFormEmpty = () => {
    setState({
      ...state,
      reference: "",
      quantity: 1,
      size: "",
      client: "",
      consignee: "",
      additional_fields: "",
      delivery_date: "",
      weight: "",
      peza: false,
      isImport,
      booking_details: [],
      container_no: "",
    });
  };

  const setFormEmptyBookingDetails = () => {
    setStateBookingDetails({
      ...booking_details,
      task: "",
      address: "",
      time: "",
      status: "unassigned",
      plate_no: "",
      shipping_line: "",
      chasis_no: "",
      row: "",
    });
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleChangeBookingDetails = (event) => {
    event.persist();
    setStateBookingDetails({
      ...booking_details,
      [event.target.name]: event.target.value,
    });
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

  const handleClient = (event) => {
    setState({ ...state, client: event.target.value });
  };

  const handleTask = (event) => {
    setStateBookingDetails({ ...booking_details, task: event.target.value });
  };

  const handleSize = (event) => {
    setState({ ...state, size: event.target.value });
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

  const handleStatus = (event) => {
    setStateBookingDetails({ ...booking_details, status: event.target.value });
  };

  const {
    reference,
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

  const renderClientList = () => {
    const newClientList = new Set();

    companiesList.forEach((company) => {
      newClientList.add(company.name);
    });

    const clientList = [];
    clientList.push(
      <MenuItem key="" value="">
        &nbsp;
      </MenuItem>
    );

    const convertToArray = [];
    for (const key of newClientList) {
      convertToArray.push(key);
    }

    const sortedList = convertToArray.sort();

    sortedList.forEach((element) => {
      const companyExist = companiesList.filter(
        (company) => company.name === element
      );
      if (companyExist.length) {
        const company = companyExist[0];
        clientList.push(
          <MenuItem key={company._id} value={company._id}>
            {company.name}
          </MenuItem>
        );
      }
    });

    return clientList;
  };

  const addDetails = (e) => {
    e.persist();
    setState({
      ...state,
      booking_details: [...state.booking_details, booking_details],
    });
    setFormEmptyBookingDetails();
  };

  const renderAddBookingDetailsAttribute = () => {
    const attrs = {
      color: "primary",
      variant: "contained",
      sx: { mb: 3 },
    };
    if (
      booking_details.address === "" ||
      booking_details.task === "" ||
      booking_details.time === "" ||
      booking_details.shipping_line === ""
      // booking_details.chasis_no === "" ||
      // booking_details.status === "" ||
      // booking_details.plate_no === "" ||
    ) {
      attrs.disabled = true;
    }
    return attrs;
  };

  const removeBookingDetail = (i) => {
    const arr = [...state.booking_details];
    arr.splice(i, 1);
    setState({ ...state, booking_details: arr });
  };

  const handleSelectAll = (e) => {
    setIsCheck(bookingsList.map((li) => li._id));
    if (!e.target.checked) {
      setIsCheck([]);
    }
  };

  const checkedReference = (e) => {
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

  const sortBookingTable = (cell) => {
    setActiveSortBookingList(cell);

    cell !== activeSortBookingList
      ? setActiveSortBookingListDirection("asc")
      : setActiveSortBookingListDirection(
          activeSortBookingListDirection === "asc" ? "desc" : "asc"
        );
  };

  const sortBookingDetailsTable = (cell) => {
    setActiveSortBookingDetails(cell);

    cell !== activeSortBookingDetails
      ? setActiveSortBookingDetailsDirection("asc")
      : setActiveSortBookingDetailsDirection(
          activeSortBookingDetailsDirection === "asc" ? "desc" : "asc"
        );
  };

  const sort_by = (field, isDetails = false) => {
    const key = function (x) {
      return x[field];
    };

    const reverse = !isDetails
      ? activeSortBookingListDirection === "asc"
        ? 1
        : -1
      : activeSortBookingDetailsDirection === "asc"
      ? 1
      : -1;

    return function (a, b) {
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  };

  const handleChangeSearchText = (e) => {
    e.persist();
    setSearchText(e.target.value);
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
          <Icon sx={{ mr: 1 }}>event</Icon>Booking
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
          label="Search booking"
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
                  active={activeSortBookingList === "_id"}
                  onClick={() => sortBookingTable("_id")}
                  direction={activeSortBookingListDirection}
                >
                  Job Reference
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortBookingList === "client"}
                  onClick={() => sortBookingTable("client")}
                  direction={activeSortBookingListDirection}
                >
                  Client
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortBookingList === "consignee"}
                  onClick={() => sortBookingTable("consignee")}
                  direction={activeSortBookingListDirection}
                >
                  Consignee
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortBookingList === "container_no"}
                  onClick={() => sortBookingTable("container_no")}
                  direction={activeSortBookingListDirection}
                >
                  Container No.
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortBookingList === "size"}
                  onClick={() => sortBookingTable("size")}
                  direction={activeSortBookingListDirection}
                >
                  Size
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortBookingList === "delivery_date"}
                  onClick={() => sortBookingTable("delivery_date")}
                  direction={activeSortBookingListDirection}
                >
                  Delivery Date
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortBookingList === "type"}
                  onClick={() => sortBookingTable("type")}
                  direction={activeSortBookingListDirection}
                >
                  Type
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={activeSortBookingList === "status"}
                  onClick={() => sortBookingTable("status")}
                  direction={activeSortBookingListDirection}
                >
                  Status
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell sx={{ width: "10%" }}>Action</StyledTableCell>
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
            .sort(sort_by(activeSortBookingList))
            .map((x, index) => {
              return (
                <TableBody key={index}>
                  <StyledTableRow>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      <Checkbox
                        color="primary"
                        checked={isCheck.includes(x._id)}
                        onClick={checkedReference}
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
                                  {trucksList.map((res) => {
                                    if (res._id === y.plate_no) {
                                      return res.plate_no;
                                    } else {
                                      return "";
                                    }
                                  })}
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
                  Are you sure you want to delete{" "}
                  <b>{currentBooking.reference}</b>?
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => handleDeleteBooking(currentBooking)}
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
                {myAction === "edit" ? "Edit Booking" : "New Booking"}
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
                          <TextField
                            type="text"
                            name="reference"
                            label="Job Reference No."
                            value={reference || "auto generated"}
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
                          />

                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="demo-simple-select-label">
                              Size
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={size || ""}
                              label="Size"
                              name="size"
                              onChange={handleSize}
                            >
                              <MenuItem value="">&nbsp;</MenuItem>
                              <MenuItem value="20ft">20ft</MenuItem>
                              <MenuItem value="40ft">40ft</MenuItem>
                              <MenuItem value="45ft">45ft</MenuItem>
                              <MenuItem value="40hc">40hc</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            type="text"
                            sx={{ mb: 2 }}
                            name="weight"
                            label="Weight"
                            onChange={handleChange}
                            value={weight || ""}
                          />

                          <TextField
                            name="consignee"
                            type="text"
                            label="Consignee"
                            value={consignee || ""}
                            onChange={handleChange}
                          />

                          <TextField
                            id="datetime-local"
                            name="delivery_date"
                            label="Delivery date"
                            type="datetime-local"
                            value={delivery_date || ""}
                            onChange={handleChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />

                          <TextField
                            sx={{ mb: 2, display: isImport ? "" : "none" }}
                            type="text"
                            name="container_no"
                            label="Container No."
                            onChange={handleChange}
                            value={container_no}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ mb: 2 }} />

                      <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="demo-simple-select-label">
                              Task *
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={booking_details.task || ""}
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
                            label="Address *"
                            onChange={handleChangeBookingDetails}
                            value={booking_details.address || ""}
                          />

                          <TextField
                            sx={{ mb: 2 }}
                            type="text"
                            name="plate_no"
                            label="Plate No."
                            onChange={handleChangeBookingDetails}
                            value={booking_details.plate_no || ""}
                            disabled
                          />

                          <TextField
                            sx={{ mb: 2 }}
                            type="text"
                            name="chasis_no"
                            label="Chasis No."
                            onChange={handleChangeBookingDetails}
                            value={booking_details.chasis_no}
                            disabled
                          />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                          <TextField
                            id="datetime-local"
                            name="time"
                            label="Time / Date *"
                            type="datetime-local"
                            value={booking_details.time}
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
                              value={booking_details.status || "unassigned"}
                              label="Status"
                              onChange={handleStatus}
                              disabled
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
                            label="Shipping Line *"
                            onChange={handleChangeBookingDetails}
                            value={booking_details.shipping_line || ""}
                          />
                        </Grid>
                      </Grid>

                      <Button
                        {...renderAddBookingDetailsAttribute()}
                        onClick={addDetails}
                      >
                        <Icon>note_add</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                          Add Details
                        </Span>
                      </Button>

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
                                active={activeSortBookingDetails === "task"}
                                onClick={() => sortBookingDetailsTable("task")}
                                direction={activeSortBookingDetailsDirection}
                              >
                                Task
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                              <TableSortLabel
                                active={
                                  activeSortBookingDetails === "shipping_line"
                                }
                                onClick={() =>
                                  sortBookingDetailsTable("shipping_line")
                                }
                                direction={activeSortBookingDetailsDirection}
                              >
                                Shipping Line
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                              <TableSortLabel
                                active={activeSortBookingDetails === "plate_no"}
                                onClick={() =>
                                  sortBookingDetailsTable("plate_no")
                                }
                                direction={activeSortBookingDetailsDirection}
                              >
                                Plate No.
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                              <TableSortLabel
                                active={
                                  activeSortBookingDetails === "chasis_no"
                                }
                                onClick={() =>
                                  sortBookingDetailsTable("chasis_no")
                                }
                                direction={activeSortBookingDetailsDirection}
                              >
                                Chasis No.
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                              <TableSortLabel
                                active={activeSortBookingDetails === "address"}
                                onClick={() =>
                                  sortBookingDetailsTable("address")
                                }
                                direction={activeSortBookingDetailsDirection}
                              >
                                Address
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                              <TableSortLabel
                                active={activeSortBookingDetails === "time"}
                                onClick={() => sortBookingDetailsTable("time")}
                                direction={activeSortBookingDetailsDirection}
                              >
                                Time / Date
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                              <TableSortLabel
                                active={activeSortBookingDetails === "status"}
                                onClick={() =>
                                  sortBookingDetailsTable("status")
                                }
                                direction={activeSortBookingDetailsDirection}
                              >
                                Status
                              </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {state.booking_details
                            .sort(sort_by(activeSortBookingDetails, true))
                            .map((element, index) => {
                              return (
                                <TableRow key={index}>
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
                                    <Tooltip
                                      title="Delete"
                                      onClick={() => removeBookingDetail(index)}
                                    >
                                      <IconButton>
                                        <Icon color="error">delete</Icon>
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </StyledTable>
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
                    onClick={() => handleDeleteBooking(currentBooking)}
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
