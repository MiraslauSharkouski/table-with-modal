import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    // Color palette
    colorPrimary: "#1890ff",
    colorInfo: "#1890ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#f5222d",

    // Border radius
    borderRadius: 6,

    // Font sizes
    fontSize: 14,
    fontSizeLG: 16,

    // Spacing
    margin: 16,
    padding: 16,
  },
  components: {
    Layout: {
      headerBg: "#fff",
      bodyBg: "#f5f5f5",
    },
    Table: {
      headerBg: "#fafafa",
      rowHoverBg: "#f5f5f5",
    },
    Button: {
      controlHeight: 36,
      controlHeightSM: 28,
      controlHeightLG: 44,
    },
    Modal: {
      headerBg: "#fff",
      contentBg: "#fff",
    },
  },
};
