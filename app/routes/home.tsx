import { Outlet } from "@remix-run/react";
import React from "react";
import PageTemplate from "~/components/base/pageTemplate";
import { useTypedSelector } from "~/state/hooks/user";
import { RootState } from "~/state/store";

export const Home = () => {

  return (
    <>
      <Outlet />
      Hello
    </>
  );
};

export default Home;
