import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, loginLoader } from './views/Login';
import { Preferences } from './views/Preferences';
import { BootView, Chats, bootServer } from './views/Chats';
import { Register, registerLoader } from "./views/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    loader: loginLoader
  },
  {
    path: "/c",
    element: <BootView />,
    loader: bootServer
  },
  {
    path: "/c/:channel",
    element: <Chats />
  },
  {
    path: "/u/register",
    element: <Register />,
    loader: registerLoader
  },
  {
    path: "/u/preferences",
    element: <Preferences />
  },
  {
    path: "/u/dashboard",
    element: <Preferences />
  }
]);

function App() {
  return (
    <div className={`w-full flex flex-col items-center justify-center`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
