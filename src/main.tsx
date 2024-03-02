import ReactDOM from "react-dom/client";
import "./globals.css";
import { lazy } from "react";
import { getQueryParam } from "./lib/utils.ts";

const Admin = lazy(() => import("./Admin.tsx"));
const HtmlBuilder = lazy(() => import("./App.tsx"));

const Component = getQueryParam("admin") === "true" ? Admin : HtmlBuilder;

ReactDOM.createRoot(document.getElementById("root")!).render(<Component />);
