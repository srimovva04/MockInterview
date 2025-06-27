import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();

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
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="input-style mb-4"
          required
        />
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
