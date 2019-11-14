import * as React from "react";
import { SFC } from "react";

import TopBar from "./shell/TopBar";
import Background from "./shell/Background";
import DAOcreator from "./pages/DAOcreator";

const App: SFC = () => (
  <div
    style={{
      position: "absolute",
      width: "100vw",
      height: "100vh",
      minWidth: "450px",
      maxWidth: "100%"
    }}
  >
    <Background />
    <TopBar />
    <DAOcreator />
  </div>
);

export default App;
