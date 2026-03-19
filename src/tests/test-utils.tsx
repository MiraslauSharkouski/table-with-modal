import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ConfigProvider } from "antd";

interface AllTheProvidersProps {
  children: React.ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
