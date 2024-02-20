import { Outlet } from "@remix-run/react";

export default function auth() {
  return (
    <div>
        <Outlet />
    </div>
  )
}
