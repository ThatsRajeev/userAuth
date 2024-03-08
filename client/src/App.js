import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from "./components/Signup/Signup";
import Posts from "./components/Posts/Posts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/posts",
    element: <Posts />,
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
