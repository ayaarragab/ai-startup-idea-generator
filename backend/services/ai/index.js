import mockProvider from "./mock.provider.js";
import httpProvider from "./http.provider.js";

const provider = process.env.AI_PROVIDER === "http"
  ? httpProvider
  : mockProvider;

export default provider;