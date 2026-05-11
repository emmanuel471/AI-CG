import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div>
      {/* Navbar can go here */}
      <Outlet />
      {/* Footer can go here */}
    </div>
  );
}