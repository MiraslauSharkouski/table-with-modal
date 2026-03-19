import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchBarProps {
  onSearch: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  value?: string;
}

const SearchBar = ({
  onSearch,
  onClear,
  placeholder = "Search...",
  value = "",
}: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
    onClear?.();
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Space>
        <Input
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          onChange={handleChange}
          value={value}
          allowClear
          onClear={handleClear}
          style={{ width: 300 }}
        />
      </Space>
    </div>
  );
};

export default SearchBar;
