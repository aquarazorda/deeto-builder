import App from "./App";
import { createSharedComponent } from "./lib/to-external";

const HtmlBuilder = createSharedComponent(App);

export default HtmlBuilder;
