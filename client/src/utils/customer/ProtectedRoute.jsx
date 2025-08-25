// import { jwtDecode } from "jwt-decode"; 
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import { UserLogoutSuccess } from "../../store/customer/userAuthSlice";


// const ProtectedRoute = () => {
//   const { isFetching, token } = useSelector((state) => state.userAuth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkToken = () => {
//       if (token) {
//         const decodedToken = jwtDecode(token);
//         if (decodedToken.exp < Date.now() / 1000) {
//           dispatch(UserLogoutSuccess());
//           navigate("/login");
//         }
//       } else {
//         navigate("/login");
//       }
//     };

//     checkToken();
//   }, [token, navigate, dispatch]);

//   if (!token && !isFetching) {
//     return <Navigate to="/login" />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;


// src/utils/customer/ProtectedRoute.jsx
// src/utils/customer/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userToken } = useSelector(state => state.userAuth);
  // Only redirect if userToken is truly empty
  return userToken ? <Outlet /> : <Navigate to="/customer/login" replace />;
};

export default ProtectedRoute;
