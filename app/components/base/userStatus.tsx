import { User } from "api/models/user";
import React, { useState, useEffect } from "react";
import { UserContext, UserModel, UserState } from "~/state/user/userSlice";

interface UserStatusProps {
  user: UserModel;
  context: UserContext;
}

const UserStatus: React.FC<UserStatusProps> = ({ user, context }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const setClock = (now: Date) => {
      if (context.locale) {
        let date = now.toLocaleDateString(context.locale);
        let time = now.toLocaleTimeString(context.locale);
        setDate(date);
        setTime(time);
      }
    };

    setClock(new Date());
    const interval = setInterval(() => setClock(new Date()), 1000);

    return () => clearInterval(interval);
  }, [context.locale]);

  // console.log("user", user);
  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg">
    {context.isLoggedIn && user.id ? (
      <>
        <div className="text-lg font-semibold text-white">Welcome, {user.username}</div>
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
};

export default UserStatus;
