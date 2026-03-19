import React from "react";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
  loading = false,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Space>
        <Input
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          allowClear
          style={{ width: 300 }}
        />
      </Space>
    </div>
  );
};

export default SearchBar;
