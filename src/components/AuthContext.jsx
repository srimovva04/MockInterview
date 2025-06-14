import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "./utils/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null); // ✅ default is null not "Hey"

  const signUpNewUser = async (email, password, fullName, phoneNo) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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

    return { success: true, data };
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

// import React, { createContext, useEffect, useState, useContext } from "react";
// import { supabase } from "./utils/supabaseClient";

// const AuthContext = createContext();
// export const AuthContextProvider = ({ children }) => {
//   const [session, setSession] = useState(null);

//   //sign up
//   const signUpNewUser = async (email, password) => {
//     const { data, error } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     });

//     if (error) {
//       console.error("There was problekm singing up : ", error);
//       return { success: false, error };
//     }
//     return { success: true, data };
//   };

//   //sign in
//   const signInUser = async ({ email, password }) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email,
//         password: password,
//       });
//       if (error) {
//         console.error("Sign in error occured : ", error);
//         return { success: false, error };
//       }
//       console.log("Sign-in success: ", data);
//       return { success: true, data };
//     } catch (error) {
//       console.error("An error occured : ", error);
//     }
//   };

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   //sign out
//   const signOut = () => {
//     const { error } = supabase.auth.signOut();
//     if (error) {
//       console.error("There was problekm singing up : ", error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ session, signInUser, signUpNewUser, signOut }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const UserAuth = () => {
//   return useContext(AuthContext);
// };

// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [session, setSession] = useState(undefined); // undefined while loading

//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) {
//       setSession(JSON.parse(stored));
//     } else {
//       setSession(null);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ session, setSession }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const UserAuth = () => useContext(AuthContext);
