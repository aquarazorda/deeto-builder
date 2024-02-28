import App from "./App";
import { createSharedComponent } from "./lib/to-external";

import "./globals.css";

const HtmlBuilder = createSharedComponent(App);

export default HtmlBuilder;
