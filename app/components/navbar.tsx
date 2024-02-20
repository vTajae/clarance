import React from "react";
import { useDispatch, useTypedSelector } from '../state/hooks/user';
import { setLogout } from '../state/user/userSlice';
import { RootState } from '../state/store'; // Adjust the import path

export default function Navbar() {
  const user = useTypedSelector((state: RootState) => state.user.value.user);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setLogout());
  };

  return (
    <div>
      <nav>
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </nav>
    </div>
  );
}
