import { match } from "ts-pattern";
import { create } from "zustand";

const env = window.location.search.replace("?env=", "");

type ApiState = {
  apiUrl: string;
  siteUrl: string;
};

export const useApi = create<ApiState>(() => ({
  apiUrl: match(env)
    .with("prod", () => "https://api.deeto.ai")
    .with("stg", () => "https://staging-api.deeto.ai")
    .with("local", () => "http://localhost:3000/dev")
    .otherwise(() => "https://dev-api.deeto.ai"),
  siteUrl: match(env)
    .with("prod", () => "https://app.deeto.ai")
    .with("stg", () => "https://staging.deeto.ai")
    .with("local", () => "http://localhost:3001")
    .otherwise(() => "https://dev.deeto.ai"),
}));
