import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "./AuthContext.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient.js";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setToast("");

    try {
      const result = await signUpNewUser(email, password, fullName, phoneNo);
      if (result.success && result.emailConfirmationSent) {
        setToast("Signup successful! Please check your email to confirm.");
        setTimeout(() => setToast(""), 2000); // auto hide

        setEmail("");
        setPassword("");
        setFullName("");
        setPhoneNo("");
      }
      // if (result.success && result.emailConfirmationSent) {
      //   alert(
      //     "Signup successful! Please check your email to confirm your account."
      //   );
      //   navigate("/check-email"); // 👈 optional page, or just stay on the same page
      // }
      // if (result.success) {
      //   const {
      //     data: { user },
      //     error: userError,
      //   } = await supabase.auth.getUser();

      //   if (userError || !user) throw new Error("User fetch failed");

      //   const { error: roleError } = await supabase
      //     .from("user_roles")
      //     .insert([{ user_id: user.id, role: "user" }]);

      //   if (roleError) {
      //     console.error("Role error:", roleError);
      //     setError("Signup successful, but role assignment failed");
      //     return;
      //   }

      //   navigate("/home");
      // }
      else {
        setError(
          "Signup failed: " + (result.error?.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-white to-blue-100 px-4">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        {toast && (
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
            {toast}
          </div>
        )}
      </div>

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-md">
        <h2 className="text-3xl mb-2 font-extrabold text-center text-blue-600">
          Sign Up Today
        </h2>
        <p className="mb-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign in!
          </Link>
        </p>

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="input-style"
            required
          />
          <input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            placeholder="Phone number"
            className="input-style"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="input-style"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-style pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-blue-400 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
