import ReactDOM from "react-dom/client";
import "./globals.css";
import { lazy } from "react";

const Admin = lazy(() => import("./Admin.tsx"));
const HtmlBuilder = lazy(() => import("./App.tsx"));

const Component = window.location.href.includes("/admin") ? Admin : HtmlBuilder;

ReactDOM.createRoot(document.getElementById("root")!).render(<Component />);
