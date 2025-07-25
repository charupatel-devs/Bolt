import jwt_decode from "jwt-decode";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { logOut } from "../../store/customer/userAuthSlice";

const ProtectedRoute = () => {
  const { isFetching, token } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const decodedToken = jwt_decode(token);
        // Check if the token is expired
        if (decodedToken.exp < Date.now() / 1000) {
          dispatch(logOut());
          navigate("/login");
        }
      } else {
        // Handle the case where there is no token (user not logged in)
        navigate("/login");
      }
    };

    checkToken();
  }, [token, navigate, dispatch]);

  if (!token && !isFetching) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;