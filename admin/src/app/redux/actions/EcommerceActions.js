import axios from "axios.js";

// USERS
export const GET_USER_LIST = "GET_USER_LIST";
export const DELETE_USER_FROM_LIST = "DELETE_USER_FROM_LIST";
export const ADD_USER = "ADD_USER";
export const UPDATE_USER = "UPDATE_USER";

// BOOKING
export const BOOKING_GET = "BOOKING_GET";
export const BOOKING_ADD = "BOOKING_ADD";
export const BOOKING_UPDATE = "BOOKING_UPDATE";
export const BOOKING_DELETE = "BOOKING_DELETE";

// BOOKING DETAILS
export const BOOKING_DETAILS_GET = "BOOKING_DETAILS_GET";

// TRUCKS
export const TRUCKS_GET = "TRUCKS_GET";
export const TRUCKS_ADD = "TRUCKS_ADD";
export const TRUCKS_UPDATE = "TRUCKS_UPDATE";
export const TRUCKS_DELETE = "TRUCKS_DELETE";

// COMPANIES
export const COMPANIES_GET = "COMPANIES_GET";
export const COMPANIES_ADD = "COMPANIES_ADD";
export const COMPANIES_UPDATE = "COMPANIES_UPDATE";
export const COMPANIES_DELETE = "COMPANIES_DELETE";

// ERROR HANDLER
export const ERROR_STATUS = "ERROR_STATUS";
export const ERROR_RESET = "ERROR_RESET";

// PERMISSIONS
export const PERMISSIONS_GET = "PERMISSIONS_GET";

// REPORTS
export const REPORTS_BOOKING_GET = "REPORTS_BOOKING_GET";

const url = process.env.REACT_APP_SERVER_URL || "http://localhost:3009";

export const errorReset = () => (dispatch) => {
  dispatch({
    type: ERROR_RESET,
  });
};

export const getUserList = () => (dispatch) => {
  axios
    .get(`${url}/users`)
    .then((res) => {
      dispatch({
        type: GET_USER_LIST,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const deleteUser = (userId) => (dispatch) => {
  axios
    .delete(`${url}/users/${userId}`)
    .then((res) => {
      dispatch({
        type: DELETE_USER_FROM_LIST,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const addUser = (payload) => (dispatch) => {
  axios
    .post(`${url}/users`, payload)
    .then((res) => {
      dispatch({
        type: ADD_USER,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const updateUser = (payload) => (dispatch) => {
  axios
    .put(`${url}/users/${payload.id}`, payload)
    .then((res) => {
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
        id: payload.id,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const bookingGet = () => (dispatch) => {
  axios
    .get(`${url}/booking`)
    .then((res) => {
      dispatch({
        type: BOOKING_GET,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const bookingAdd = (payload) => (dispatch) => {
  axios
    .post(`${url}/booking`, payload)
    .then((res) => {
      dispatch({
        type: BOOKING_ADD,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const bookingDelete = (bookingId) => (dispatch) => {
  axios
    .delete(`${url}/booking/${bookingId}`)
    .then((res) => {
      dispatch({
        type: BOOKING_DELETE,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const bookingUpdate = (payload) => (dispatch) => {
  axios
    .patch(`${url}/booking/${payload.id}`, payload)
    .then((res) => {
      dispatch({
        type: BOOKING_UPDATE,
        payload: res.data,
        id: payload.id,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const bookingDetailsGet = () => (dispatch) => {
  axios
    .get(`${url}/booking-details`)
    .then((res) => {
      dispatch({
        type: BOOKING_DETAILS_GET,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const trucksGet = () => (dispatch) => {
  axios
    .get(`${url}/trucks`)
    .then((res) => {
      dispatch({
        type: TRUCKS_GET,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const trucksAdd = (payload) => (dispatch) => {
  axios
    .post(`${url}/trucks`, payload)
    .then((res) => {
      dispatch({
        type: TRUCKS_ADD,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const truckDelete = (truckId) => (dispatch) => {
  axios
    .delete(`${url}/trucks/${truckId}`)
    .then((res) => {
      dispatch({
        type: TRUCKS_DELETE,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const truckUpdate = (payload) => (dispatch) => {
  axios
    .patch(`${url}/trucks/${payload.id}`, payload)
    .then((res) => {
      dispatch({
        type: TRUCKS_UPDATE,
        payload: res.data,
        id: payload.id,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const companiesGet = () => (dispatch) => {
  axios
    .get(`${url}/companies`)
    .then((res) => {
      dispatch({
        type: COMPANIES_GET,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const companiesAdd = (payload) => (dispatch) => {
  axios
    .post(`${url}/companies`, payload)
    .then((res) => {
      dispatch({
        type: COMPANIES_ADD,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const companiesDelete = (companyId) => (dispatch) => {
  axios
    .delete(`${url}/companies/${companyId}`)
    .then((res) => {
      dispatch({
        type: COMPANIES_DELETE,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const companiesUpdate = (payload) => (dispatch) => {
  axios
    .patch(`${url}/companies/${payload.id}`, payload)
    .then((res) => {
      dispatch({
        type: COMPANIES_UPDATE,
        payload: res.data,
        id: payload.id,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const permissionsGet = () => (dispatch) => {
  axios
    .get(`${url}/permissions`)
    .then((res) => {
      dispatch({
        type: PERMISSIONS_GET,
        payload: res.data,
      });
    })
    .catch((e) => {
      if (e.status !== 404) {
        dispatch({
          type: ERROR_STATUS,
          e,
        });
      }
    });
};

export const reportBookingsGet = (payload) => (dispatch) => {
  axios
    .post(`${url}/reports/booking`, payload)
    .then((res) => {
      dispatch({
        type: REPORTS_BOOKING_GET,
        payload: res.data,
      });
    })
    .catch((e) => {
      dispatch({
        type: REPORTS_BOOKING_GET,
        payload: [],
      });
    });
};

export const initialState = () => (dispatch) => {
  dispatch({
    type: "init",
  });
};
