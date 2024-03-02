import { FunctionComponent } from "react";
import ReactDOM from "react-dom/client";
import { ROOT_URL } from "@/config";

export const createSharedComponent =
  (Component: FunctionComponent<any>) =>
  ({ renderIn, ...props }: { renderIn: HTMLElement; [key: string]: any }) => {
    const root = ReactDOM.createRoot(renderIn);

    root.render(
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `@import "${ROOT_URL}/assets/html-builder.css"`,
          }}
        />
        <Component {...props} />
      </>,
    );

    // renderIn?.attachShadow({ mode: "open" });

    return () => root.unmount();
  };
