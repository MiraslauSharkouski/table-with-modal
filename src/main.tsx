import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
          colorPrimary: "#1677ff",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        },
        components: {
          Table: {
            headerBg: "#fafafa",
            rowHoverBg: "#f5f5f5",
          },
          Button: {
            borderRadius: 6,
          },
          Input: {
            borderRadius: 6,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
