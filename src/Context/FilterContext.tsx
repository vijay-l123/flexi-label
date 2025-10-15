import React, { createContext, useContext, useState, ReactNode } from "react";

interface Filter {
  column?: { Name: string; field: string };
  operator?: string;
  value?: string;
}

interface FilterContextProps {
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
  handleChange: (key: keyof Filter, value: any) => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filter, setFilterState] = useState<Filter>({});

  const setFilter = (newFilter: Filter) => {
    setFilterState(newFilter);
  };

  const handleChange = (key: keyof Filter, value: any) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <FilterContext.Provider value={{ filter, setFilter, handleChange }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilterContext must be used inside FilterProvider");
  return context;
};
