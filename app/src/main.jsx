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
import DocsPage from "./container/admin/docs";
import AddDoc from "./container/admin/components/AddDoc";
import EditDocPage from "./container/admin/components/EditDocPage";
import ReviewTicketPage from "./container/admin/reviewTicket";
import FeedbackPage from "./container/home/FeedbackPage";

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
      {
        path: "/doc",
        element: <DocsPage />,
      },
      {
        path: "/doc/add",
        element: <AddDoc />,
      },
      {
        path: "/doc/edit/:id",
        element: <EditDocPage />,
      },
      {
        path: "/review",
        element: <ReviewTicketPage />,
      },
      {
        path: "/feedback",
        element: <FeedbackPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

