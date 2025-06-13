import { Navigate } from "react-router-dom";
import { UserAuth } from "./AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { session } = UserAuth();

//   // Prevent blank screen during initial load
//   if (session === undefined) return <div>Loading...</div>;

//   if (!session) return <Navigate to="/signin" replace />;

//   return children;
// };

// export default ProtectedRoute;

 const ProtectedRoute = ({ children }) => {
  const { session } = UserAuth();
  console.log("ProtectedRoute - session:", session); // 🟡 Add this

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return children;
};
export default ProtectedRoute;