import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { ConfigProvider, theme } from "antd";

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const { defaultAlgorithm, defaultSeed } = theme;

const themeConfig = {
  algorithm: defaultAlgorithm,
  token: defaultSeed,
};

function AllTheProviders({ children }: AllTheProvidersProps) {
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
