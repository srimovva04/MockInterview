import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "./AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "./utils/supabaseClient.js"; // adjust path if needed

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signUpNewUser(email, password, fullName, phoneNo);
      console.log("Signup result:", result);

      if (result.success) {
        // Get the newly signed-up user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("Unable to get user after signup");
        }

        // Insert role into user_roles table
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{ user_id: user.id, role: "user" }]);

        if (roleError) {
          console.error("Error assigning role:", roleError);
          setError("Signup successful, but role assignment failed");
          return;
        }

        // Redirect to home
        navigate("/home");
      } else {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <div className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-2 font-bold">Sign up today</h2>
        <p className="mb-4 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 underline">
            Sign in!
          </Link>
        </p>
        <form onSubmit={handleSignUp}>
          <input
            className="w-full p-2 mb-4 bg-gray-700 rounded"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            className="w-full p-2 mb-4 bg-gray-700 rounded"
            type="text"
            placeholder="Enter your phone Number"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
