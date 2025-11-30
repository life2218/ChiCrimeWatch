import React from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
}: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        value={query}
        placeholder="ZIP, community name, neighborhood, or area #"
        onChange={(e) => onQueryChange(e.target.value)}
        style={{
          flex: 1,
          padding: "11px 12px",
          borderRadius: "10px",
          border: "1px solid #444",
          background: "rgba(15,15,15,0.9)",
          color: "#fff",
          fontSize: "14px",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "11px 20px",
          background: "#4f8cff",
          border: "none",
          borderRadius: "10px",
          color: "white",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "14px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
        }}
      >
        Search
      </button>
    </form>
  );
}
