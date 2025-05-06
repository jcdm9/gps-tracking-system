import {
  GET_USER_LIST,
  DELETE_USER_FROM_LIST,
  ADD_USER,
  UPDATE_USER,
  BOOKING_GET,
  BOOKING_ADD,
  BOOKING_DELETE,
  BOOKING_UPDATE,
  BOOKING_DETAILS_GET,
  TRUCKS_ADD,
  TRUCKS_DELETE,
  TRUCKS_GET,
  TRUCKS_UPDATE,
  COMPANIES_GET,
  COMPANIES_ADD,
  COMPANIES_UPDATE,
  COMPANIES_DELETE,
  PERMISSIONS_GET,
  REPORTS_BOOKING_GET,
  ERROR_STATUS,
  ERROR_RESET,
} from "../actions/EcommerceActions";

const initialState = {
  usersList: [],
  bookingsList: [],
  bookingDetailsList: [],
  trucksList: [],
  companiesList: [],
  permissionsList: [],
  reportsBookingsList: [],
  myError: {},
};

const EcommerceReducer = function (state = initialState, action) {
  switch (action.type) {
    case ERROR_STATUS: {
      return {
        ...state,
        myError: action.e,
      };
    }

    case ERROR_RESET: {
      const { message } = state.myError;
      return {
        ...state,
        myError: { error: false, message },
      };
    }

    case GET_USER_LIST: {
      return {
        ...state,
        usersList: [...action.payload],
      };
    }

    case DELETE_USER_FROM_LIST: {
      return {
        ...state,
        usersList: state.usersList.filter(
          (user) => user._id !== action.payload.id
        ),
      };
    }

    case ADD_USER: {
      const newUserList = state.usersList;
      newUserList.push(action.payload);
      return {
        ...state,
        usersList: newUserList,
      };
    }

    case UPDATE_USER: {
      const newUserList = state.usersList.filter(
        (user) => user._id !== action.id
      );
      newUserList.push(action.payload);
      return {
        ...state,
        usersList: newUserList,
      };
    }

    case BOOKING_GET: {
      return {
        ...state,
        bookingsList: [...action.payload],
      };
    }

    case BOOKING_ADD: {
      const newBookingsList = state.bookingsList;
      newBookingsList.push(action.payload);
      return {
        ...state,
        bookingsList: newBookingsList,
      };
    }

    case BOOKING_DELETE: {
      return {
        ...state,
        bookingsList: state.bookingsList.filter(
          (booking) => booking._id !== action.payload.id
        ),
      };
    }

    case BOOKING_UPDATE: {
      const newBookingsList = state.bookingsList.filter(
        (booking) => booking._id !== action.id
      );
      newBookingsList.push(action.payload);
      return {
        ...state,
        bookingsList: newBookingsList,
      };
    }

    case BOOKING_DETAILS_GET: {
      return {
        ...state,
        bookingDetailsList: [...action.payload],
      };
    }

    case TRUCKS_GET: {
      return {
        ...state,
        trucksList: [...action.payload],
      };
    }

    case TRUCKS_ADD: {
      const newTruckingsList = state.trucksList;
      newTruckingsList.push(action.payload);
      return {
        ...state,
        trucksList: newTruckingsList,
      };
    }

    case TRUCKS_DELETE: {
      return {
        ...state,
        trucksList: state.trucksList.filter(
          (trucking) => trucking._id !== action.payload.id
        ),
      };
    }

    case TRUCKS_UPDATE: {
      const newTruckingsList = state.trucksList.filter(
        (trucking) => trucking._id !== action.id
      );
      newTruckingsList.push(action.payload);
      return {
        ...state,
        trucksList: newTruckingsList,
      };
    }

    case COMPANIES_GET: {
      return {
        ...state,
        companiesList: [...action.payload],
      };
    }

    case COMPANIES_ADD: {
      const newCompaniesList = state.companiesList;
      newCompaniesList.push(action.payload);
      return {
        ...state,
        companiesList: newCompaniesList,
      };
    }

    case COMPANIES_DELETE: {
      return {
        ...state,
        companiesList: state.companiesList.filter(
          (company) => company._id !== action.payload.id
        ),
      };
    }

    case COMPANIES_UPDATE: {
      const newCompaniesList = state.companiesList.filter(
        (company) => company._id !== action.id
      );
      newCompaniesList.push(action.payload);
      return {
        ...state,
        companiesList: newCompaniesList,
      };
    }

    case PERMISSIONS_GET: {
      return {
        ...state,
        permissionsList: [...action.payload],
      };
    }

    case REPORTS_BOOKING_GET: {
      return {
        ...state,
        reportsBookingsList: [...action.payload],
      };
    }

    default: {
      return {
        ...state,
        usersList: [],
        bookingsList: [],
        bookingDetailsList: [],
        trucksList: [],
        companiesList: [],
        permissionsList: [],
        reportsBookingsList: [],
      };
    }
  }
};

export default EcommerceReducer;
