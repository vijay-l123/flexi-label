import React, { createContext, useContext, useState, ReactNode } from "react"; 

interface Filter {
  column?: { Name: string; field: string };
  operator?: string;
  value?: string;
  startDate?: string;
  endDate?: string;
  filterValue?: string;
}

interface FilterContextProps {
  filter: Filter;
  errors: { [key: string]: any };
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  handleChange: (key: keyof Filter, value: any) => void;
  filterValue?: string; 
  // pagination-related
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  paginationChange: boolean;
  setPaginationChange: React.Dispatch<React.SetStateAction<boolean>>;
  paginationData: any; // Changed from boolean to any to store actual pagination data
  setPaginationData: React.Dispatch<React.SetStateAction<any>>;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filter, setFilter] = useState<Filter>({});
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [paginationChange, setPaginationChange] = useState(false);
  const [paginationData, setPaginationData] = useState<any>(null); 
  const [pageSize, setPageSize] = useState(25); 
  const [page, setPage] = useState(0);

  const handleChange = (key: keyof Filter, value: any) => {
    setFilter((prev) => {
      let updated: Filter = { ...prev, [key]: value };

      if (key === "column") {
        const colField = value?.field?.toLowerCase() || "";
        if (colField.includes("date")) {
          updated.startDate = "";
          updated.endDate = "";
          updated.value = "";
        } else {
          updated.operator = "";
          updated.startDate = "";
          updated.endDate = "";
        }
      }

      return updated;
    });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[key];
      return newErrors;
    });
  };

  return (
    <FilterContext.Provider 
      value={{
        filter,
        setFilter,
        errors,
        setErrors,
        handleChange,
        page,
        setPage,
        pageSize,
        setPageSize,
        paginationChange,
        setPaginationChange,
        paginationData,
        setPaginationData
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilterContext must be used inside FilterProvider");
  return context;
};