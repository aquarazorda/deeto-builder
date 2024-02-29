import { FunctionComponent } from "react";
import ReactDOM from "react-dom/client";

export const createSharedComponent =
  (Component: FunctionComponent<any>) =>
  ({ renderIn, ...props }: any) => {
    // renderIn?.attachShadow({ mode: "open" });

    const root = ReactDOM.createRoot(renderIn);

    root.render(
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `@import "http://localhost:4173/assets/html-builder.css"`,
          }}
        />
        <Component {...props} />
      </>,
    );

    return () => root.unmount();
  };
