import { Outlet } from "@remix-run/react";


const index = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default index;
