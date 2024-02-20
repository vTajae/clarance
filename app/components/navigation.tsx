// Navigation.js
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../state/store";
import { useTypedSelector } from "../state/hooks/user";

function Navigation() {
  const user = useTypedSelector((state: RootState) => state.user.value);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const setClock = (now: Date) => {
      if (user.locale) {
        let date = now.toLocaleDateString(user.locale);
        let time = now.toLocaleTimeString(user.locale);
        setDate(date);
        setTime(time);
      }
    };

    setClock(new Date());
    const interval = setInterval(() => setClock(new Date()), 1000);

    return () => clearInterval(interval);
  }, [user.locale]);

  // console.log("user", user);
  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg">
    {user.isLoggedIn && user ? (
      <>
        <div className="text-lg font-semibold text-white">Welcome, {user.user?.username}</div>
        <div className="mt-2 text-sm text-gray-400">
          <div>{date}</div>
          <div>{time}</div>
        </div>
      </>
    ) : (
      <>
        <div className="text-lg font-semibold text-red-600">Not logged in</div>
        <div className="mt-2 text-sm text-gray-400">
          <div>{date}</div>
          <div>{time}</div>
        </div>
      </>
    )}
  </div>
  
  );
}

export default Navigation;
