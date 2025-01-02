import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import ChatBotPage from "./container/home/ChatBotPage";
import DashBoardPage from "./container/admin/dashboard";
import EditTicketPage from "./container/admin/components/EditTicketPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ChatBotPage />,
      },
      {
        path: "/admin",
        element: <DashBoardPage />,
      },
      {
        path: "/admin/tickets/edit/:id",
        element: <EditTicketPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

