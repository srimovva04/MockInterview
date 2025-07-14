import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { Eye, EyeOff } from "lucide-react";


const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToast("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setToast("Error updating password.");
    } else {
      setToast("Password updated successfully!");
      setTimeout(() => {
        setToast("");
        navigate("/signin");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        {toast && (
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </div>
        )}
      </div>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        
        <div className="relative py-2">
        <input
          // type="password"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full px-4 py-3 pr-12 text-blue-500 bg-blue-50 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
         <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

         <div className="relative py-2">
        <input
          // type="password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full px-4 py-3 pr-12 text-blue-500 bg-blue-50 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
