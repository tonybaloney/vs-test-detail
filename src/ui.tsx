import * as React from "react";
import ReactDOM from "react-dom";
import CardExample from "./ui/card";
import "./iconFont.css";

import { SurfaceBackground, SurfaceContext } from "azure-devops-ui/Surface";

ReactDOM.render(
    <SurfaceContext.Provider value={{ background: SurfaceBackground.neutral }}>
      <CardExample />
    </SurfaceContext.Provider>,
    document.getElementById("root")
);