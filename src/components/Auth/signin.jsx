// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserAuth } from "./AuthContext.jsx";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { supabase } from "../utils/supabaseClient.js";

// const Signin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { signInUser } = UserAuth();
//   const navigate = useNavigate();
//   const [toast, setToast] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setToast("");

//     try {
//       const result = await signInUser({ email, password });

//       if (result.success) {
//         await supabase.auth.refreshSession();
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.getUser();

//         // Fetch user role
//         const { data: roleData, error: roleError } = await supabase
//           .from("user_roles")
//           .select("role")
//           .eq("user_id", user.id)
//           .single();

//         if (roleError) {
//           throw new Error("Could not fetch user role");
//         }

//         // Redirect based on role
//         if (roleData.role === "admin") {
//           navigate("/admin");
//         } else {
//           navigate("/home");
//         }
//       } else {
//         const errMsg = result.error?.message || "Login failed";

//         if (errMsg.toLowerCase().includes("email not confirmed")) {
//           setToast("Email not confirmed. Please check your inbox.");
//           setTimeout(() => setToast(""), 2000);
//         } else {
//           setError(errMsg);
//         }
//       }
//       //   setError(result.error.message || "Login failed");
//       // }
//     } catch (err) {
//       console.error(err);
//       setError("Unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-white to-blue-100 px-4">
//       {/* ✅ Toast popup at top center */}
//       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
//         {toast && (
//           <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
//             {toast}
//           </div>
//         )}
//       </div>

//       <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-md">
//         <h2 className="text-3xl mb-6 font-extrabold text-center text-blue-600">
//           Sign In to Continue
//         </h2>

//         <form onSubmit={handleLogin}>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email address"
//             className="w-full mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-gray-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-gray-800 placeholder-blue-400 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-3 right-3 text-blue-400 cursor-pointer"
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           <div>
//           <p
//             className="text-sm text-right text-blue-500 hover:underline cursor-pointer mb-2"
//             onClick={handleForgotPassword}
//           >
//             Forgot Password?
//           </p></div>

//           {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

//         <p className="text-sm text-center mt-6 text-gray-600">
//           Don't have an account?{" "}
//           <a
//             href="/signup"
//             className="text-blue-500 font-medium hover:underline"
//           >
//             Sign up here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signin;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./AuthContext.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient.js";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  // ✅ Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!email) {
      setToast("Please enter your email to reset password.");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password", // your reset page route
    });

    if (error) {
      console.error("Password reset error:", error);
      setToast("Failed to send reset email.");
    } else {
      setToast("Password reset email sent! Check your inbox.");
    }

    setTimeout(() => setToast(""), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setToast("");

    try {
      const result = await signInUser({ email, password });

      if (result.success) {
        await supabase.auth.refreshSession();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) throw new Error("User not found");

        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError) {
          throw new Error("Could not fetch user role");
        }

        if (roleData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        const errMsg = result.error?.message || "Login failed";

        if (errMsg.toLowerCase().includes("email not confirmed")) {
          setToast("Email not confirmed. Please check your inbox.");
        } else {
          setError(errMsg);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-white to-blue-100 px-4">
      {/* Toast Message */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        {toast && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
            {toast}
          </div>
        )}
      </div>

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-md">
        <h2 className="text-3xl mb-6 font-extrabold text-center text-blue-600">
          Sign In to Continue
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-gray-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-gray-800 placeholder-blue-400 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-blue-400 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p
            className="text-sm text-right text-blue-500 hover:underline cursor-pointer mb-4"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
