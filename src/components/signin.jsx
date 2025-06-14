
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "./utils/supabaseClient.js"; 

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signInUser({ email, password });

      if (result.success) {
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError) {
          throw new Error("Could not fetch user role");
        }

        // Redirect based on role
        if (roleData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setError(result.error.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4 font-bold">Sign In</h2>
        <form onSubmit={handleLogin}>
          <input
            className="w-full p-2 mb-4 bg-gray-700 rounded"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 mb-4 bg-gray-700 rounded pr-10"
              type={showPassword ? "text" : "password"}
              value={password}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserAuth } from "./AuthContext";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Signin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { signInUser } = UserAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const result = await signInUser({ email, password });

//       if (result.success) {
//         // Redirect on successful login
//         navigate("/home");
//       } else {
//         setError(result.error.message || "Login failed");
//       }
//     } catch (err) {
//       setError("Unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
//       <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl mb-4 font-bold">Sign In</h2>
//         <form onSubmit={handleLogin}>
//           <input
//             className="w-full p-2 mb-4 bg-gray-700 rounded"
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <div className="relative">
//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full p-2 mb-4 bg-gray-700 rounded pr-10"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               required
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3 cursor-pointer text-white"
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
//             disabled={loading}
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signin;
