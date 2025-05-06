import { useDispatch, useSelector } from "react-redux";
import {
  bookingDetailsGet,
  bookingGet,
  reportBookingsGet,
  trucksGet,
  getUserList,
} from "app/redux/actions/EcommerceActions";
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import moment from "moment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 10, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 10 } },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0),
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
  const [state, setState] = useState({ date: new Date() });
  const { consignee, container_no, plate_no, status, date_from, date_to } =
    state;
  const setFormEmpty = () => {
    setState({
      ...state,
      consignee: "",
      container_no: "",
      plate_no: "",
      status: "",
      date_from: "",
      date_to: "",
    });
  };
  const { bookingsList, usersList, reportsBookingsList, trucksList } =
    useSelector((state) => state.ecommerce);

  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  if (!load) {
    dispatch(bookingDetailsGet());
    dispatch(bookingGet());
    dispatch(trucksGet());
    dispatch(reportBookingsGet());
    dispatch(getUserList());
    setFormEmpty();
    setLoad(true);
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showBookingDetails, setShowBookingDetails] = useState(true);

  const getName = (id) => {
    const user = usersList.find((user) => user._id === id);
    if (!user) return "";

    return user.company;
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

  const handleSelectUpdate = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const consigneeFilter = (bookings) => {
    const consignee = new Set();
    for (const booking of bookings) {
      if (booking.consignee) {
        consignee.add(booking.consignee);
      }
    }

    if (consignee.size > 0) {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">Consignee</InputLabel>
          <Select
            label="Consignee"
            name="consignee"
            onChange={handleSelectUpdate}
          >
            <MenuItem value="">&nbsp;</MenuItem>
            {bookings.map((booking) => {
              return (
                <MenuItem key={booking._id} value={booking.consignee}>
                  {booking.consignee}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="consignee-select-label">Consignee</InputLabel>
          <Select
            label="Consignee"
            name="consignee"
            onChange={handleSelectUpdate}
          >
            <MenuItem value="">&nbsp;</MenuItem>
          </Select>
        </FormControl>
      );
    }
  };

  const clientFilter = (bookings) => {
    const clients = new Set();
    for (const booking of bookings) {
      if (booking.client) {
        clients.add(getName(booking.client._id));
      }
    }

    if (clients.size > 0) {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">Client</InputLabel>
          <Select label="Client" name="client" onChange={handleSelectUpdate}>
            <MenuItem value="">&nbsp;</MenuItem>
            {bookings.map((booking) => {
              return (
                <MenuItem key={booking._id} value={booking.client._id}>
                  {getName(booking.client._id)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="client-select-label">Client</InputLabel>
          <Select label="Client" name="client" onChange={handleSelectUpdate}>
            <MenuItem value="">&nbsp;</MenuItem>
          </Select>
        </FormControl>
      );
    }
  };

  const containerFilter = (bookings) => {
    const containers = new Set();
    for (const booking of bookings) {
      if (booking.container_no) {
        containers.add(booking.container_no);
      }
    }

    if (containers.size > 0) {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="container-select-label">Container No.</InputLabel>
          <Select
            label="Container No."
            name="container_no"
            onChange={handleSelectUpdate}
          >
            <MenuItem value="">&nbsp;</MenuItem>
            {Array.from(containers).map((container) => {
              return <MenuItem value={container}>{container}</MenuItem>;
            })}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="container-select-label">Container No.</InputLabel>
          <Select
            label="Container No."
            name="container_no"
            onChange={handleSelectUpdate}
          >
            <MenuItem key={200} value="">
              &nbsp;
            </MenuItem>
          </Select>
        </FormControl>
      );
    }
  };

  const getTruckPlate = (plate) => {
    if (!trucksList.length || plate == "") {
      return "";
    }
    const truck = trucksList.filter((truck) => truck._id == plate);

    return truck.length > 0 ? truck[0].plate_no : "";
  };

  const plateFilter = (bookings) => {
    const plates = new Set();
    for (const booking of bookings) {
      for (const detail of booking.booking_details) {
        if (detail.plate_no) {
          plates.add(detail.plate_no);
        }
      }
    }

    if (plates.size > 0) {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="plates-select-label">Plate No.</InputLabel>
          <Select
            label="Plate No."
            name="plate_no"
            onChange={handleSelectUpdate}
          >
            <MenuItem value="">&nbsp;</MenuItem>
            {Array.from(plates).map((plate) => {
              console.log(plate);
              return <MenuItem value={plate}>{getTruckPlate(plate)}</MenuItem>;
            })}
          </Select>
        </FormControl>
      );
    } else {
      return (
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="container-select-label">Plate No.</InputLabel>
          <Select
            label="Plate No."
            name="plate_no"
            onChange={handleSelectUpdate}
          >
            <MenuItem value="">&nbsp;</MenuItem>
          </Select>
        </FormControl>
      );
    }
  };

  const handleSubmit = (event) => {
    console.log(state);
    dispatch(reportBookingsGet(state));
  };

  return (
    <>
      <Box width="100%" overflow="auto">
        <div style={{ display: "flex", margin: "16px 0", gridGap: "16px" }}>
          {clientFilter(reportsBookingsList)}
          {consigneeFilter(reportsBookingsList)}
          {containerFilter(reportsBookingsList)}
          {plateFilter(reportsBookingsList)}
          <FormControl style={{ flex: 1 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select label="Status" name="status" onChange={handleSelectUpdate}>
              <MenuItem value="">&nbsp;</MenuItem>
              <MenuItem value="incomplete">Incomplete</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div style={{ display: "flex", margin: "16px 0", gridGap: "16px" }}>
          <TextField
            name="date_from"
            type="datetime-local"
            label="Date from"
            onChange={handleSelectUpdate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="date_to"
            type="datetime-local"
            label="Date to"
            onChange={handleSelectUpdate}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <StyledButton
            variant="contained"
            color="primary"
            component={Link}
            onClick={handleSubmit}
            // to="/trucks"
          >
            Search
          </StyledButton>

          {/* <StyledButton
            variant="contained"
            color="primary"
            component={Link}
            // to="/trucks"
          >
            Export
          </StyledButton> */}
        </div>

        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableCell>Job Reference</StyledTableCell>
              <StyledTableCell>Client</StyledTableCell>
              <StyledTableCell>Consignee</StyledTableCell>
              <StyledTableCell>Container No.</StyledTableCell>
              <StyledTableCell>Size</StyledTableCell>
              <StyledTableCell>Delivery Date</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>

          {reportsBookingsList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((x, index) => {
              return (
                <TableBody key={index}>
                  <StyledTableRow>
                    <TableCell sx={{ borderBottom: "none" }} xs="auto">
                      {x._id}
                    </TableCell>
                    <TableCell
                      sx={{ borderBottom: "none", fontWeight: "bold" }}
                      xs="auto"
                    >
                      {(!x.client ? "" : getName(x.client._id)).toUpperCase()}
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
                  </StyledTableRow>
                  <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell colSpan={6}>
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
                                <div
                                  style={{
                                    flex: "1",
                                    textDecoration: "underline",
                                    color: "blue",
                                  }}
                                >
                                  {trucksList.map((res) => {
                                    if (res._id === y.plate_no) {
                                      const url = `${
                                        process.env.REACT_APP_WIALON_REPO_URL
                                      }:8080/track_layer.html?from=${moment(
                                        y.time
                                      ).format(
                                        "YYYY-MM-DD h:mm.ss"
                                      )}&to=${moment(y.time)
                                        .add(1, "d")
                                        .format(
                                          "YYYY-MM-DD h:mm.ss"
                                        )}&resource=16862799&template=18&unit=${
                                        res.device_id
                                      }&token=${
                                        process.env.REACT_APP_WIALON_TOKEN
                                      }`;
                                      return (
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {res.plate_no}
                                        </a>
                                      );
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
      </Box>
    </>
  );
};

export default PaginationTable;
