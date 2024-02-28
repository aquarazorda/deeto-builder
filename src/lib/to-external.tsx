import { FunctionComponent } from "react";
import ReactDOM from "react-dom/client";

export const createSharedComponent =
  (Component: FunctionComponent<any>) =>
  ({ renderIn, styleSlot, parentNode, ...props }: any) => {
    const root = ReactDOM.createRoot(renderIn);

    root.render(<Component parentNode={styleSlot} {...props} />);

    return () => root.unmount();
  };
