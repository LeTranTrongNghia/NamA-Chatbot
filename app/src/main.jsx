import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import ChatBotPage from "./container/home/ChatBotPage";
import DashBoardPage from "./container/admin/dashboard";
import EditTicketPage from "./container/admin/components/EditTicketPage";
import UserRegistrationPage from "./container/home/UserRegistrationPage";
import { UserTable } from "./container/admin/components/UserTable";
import PolicyPage from "./container/admin/policy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <UserRegistrationPage />,
      },
      {
        path: "/chat",
        element: <ChatBotPage />,
      },
      {
        path: "/dashboard/tickets/edit/:id",
        element: <EditTicketPage />,
      },
      {
        path: "/users",
        element: <UserTable />,
      },
      {
        path: "/dashboard",
        element: <DashBoardPage />,
      },
      {
        path: "/policy",
        element: <PolicyPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

