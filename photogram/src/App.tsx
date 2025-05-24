import * as React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./index.css";
import { UserAuthProvider } from "./context/useAuthContext";

type Props = {};

const App: React.FC<Props> = () => {
  return (
    <UserAuthProvider>
      <RouterProvider router={router} />
    </UserAuthProvider>
  );
};

export default App;
