import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null); // ✅ default is null not "Hey"

  const signUpNewUser = async (email, password, fullName, phoneNo) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/home",
        data: {
          display_name: fullName,
          phone: phoneNo,
        },
      },
    });

    if (error) {
      console.error("Signup error: ", error);
      return { success: false, error };
    }

    // ✅ Get updated session immediately after signup
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    setSession(currentSession);

    return {
      success: true,
      emailConfirmationSent: true,
      data,
    };
  };

  const signInUser = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign-in error: ", error);
      return { success: false, error };
    }

    // ✅ Get session after sign-in
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    setSession(currentSession);

    return { success: true, data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign-out error: ", error);
    setSession(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, signInUser, signUpNewUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
