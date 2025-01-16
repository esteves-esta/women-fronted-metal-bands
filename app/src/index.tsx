import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/index";
import About from "./pages/About/index";
import ChartsPage from "./pages/ChartsPage/index";
import TablePage from "./pages/TableView";

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
        path: "pages/about",
        element: <About />
      },
      {
        path: "pages/graphs",
        element: <ChartsPage />
      },
      {
        path: "pages/table",
        element: <TablePage />
      }
    ]
  }
]);

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
// root.render(<App />);
