import React from "react";
import Navigation from "./navigation";
import UserStatus from "./userStatus";
import { UserContext, UserModel, UserState } from "../../state/user/userSlice"; // Update the import path as needed

interface HeaderProps {
  user: UserModel | null;
  context: UserContext;
}

const Header: React.FC<HeaderProps> = ({  context }) => {
  // Render a loader when isLoading is true or null



  // Render normal header content when not loading
  return (
    <header className="header-content">
      <Navigation context={context} />
    </header>
  );
};

export default Header;
