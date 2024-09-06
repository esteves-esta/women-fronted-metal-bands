import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/index";
import About from "./pages/About/index";
import ChartsPage from "./pages/ChartsPage/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "graphs",
        element: <ChartsPage />
      },
      {
        path: "table",
        element: <About />
      }
    ]
  }
]);

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
// root.render(<App />);
