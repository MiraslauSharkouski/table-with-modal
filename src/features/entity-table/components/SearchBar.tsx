import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  value?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search...",
  value = "",
}: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
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
          style={{ width: 300 }}
        />
      </Space>
    </div>
  );
};

export default SearchBar;
