import { logOut } from "../features/authSlice";

export const parseError = (error) => {
  const dispatch = useDispatch();

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 401) {
      // Perform logout action here
      // For example:
      // logoutUser();

      // Throw an error to prompt the user to log in again
      dispatch(logOut());

      return "Your session has expired. Please log in again.";
    } else if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    } else {
      return "An error occurred while processing your request.";
    }
  } else if (error.request) {
    // The request was made but no response was received
    return "No response from the server. Please try again later.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return "An error occurred. Please try again later.";
  }
};
