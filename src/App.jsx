
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Dashboard from "./pages/resumeAllPages/Dashboard";
import TemplateList from "./pages/resumeAllPages/TemplateList";
import Register from "./pages/auth/RegisterUser1";
import Login from "./pages/auth/LoginUser1";
import Home from "./pages/dashboard/Home4";
import Feedback from "./Feedback/FeedBackl";
import UserRoutes from "./protectedRouter/ProtectedRoutes";

import ResumeBuilder from "./pages/resumeAllPages/ResumeBuilder";
import ResumeViewPage from "./pages/resumeAllPages/ResumeViewPage";
import UserProfile from "./pages/auth/UserProfile";




const router = createBrowserRouter([
  // =========================
  // PUBLIC ROUTES
  // =========================

  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  // =========================
  // PROTECTED ROUTES
  // =========================

  {
    path: "/dashboard",
    element: (
      <UserRoutes>
        <Dashboard />
      </UserRoutes>
    ),
  },

  {
    path: "/templates/:category",
    element: (
      <UserRoutes>
        <TemplateList />
      </UserRoutes>
    ),
  },

  {
    path: "/resume-builder/:slug",
    element: (
      <UserRoutes>
        <ResumeBuilder />
      </UserRoutes>
    ),
  },

  {
    path: "/user-profile",
    element: (
      <UserRoutes>
        <UserProfile />
      </UserRoutes>
    ),
  },

  {
    path: "/resume-view/:category/:slug/:id",
    element: (
      <UserRoutes>
        <ResumeViewPage />
      </UserRoutes>
    ),
  },

  {
    path: "/review",
    element: (
      <UserRoutes>
        <Feedback />
      </UserRoutes>
    ),
  },

  // =========================
  // UNKNOWN URL
  // =========================

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;



/*
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    element: <ProtectedRoutes />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/templates/:category", element: <TemplateList /> },
      { path: "/resume-builder/:slug", element: <ResumeBuilder /> },
      { path: "/resume-view/:category/:slug/:id", element: <ResumeViewPage /> },
      { path: "/review", element: <Feedback /> },
      { path: "/view", element: <ViewResume /> },
    ],
  },
]);
*/





