// // import React, { createContext, useContext, useState, ReactNode } from "react";

// // interface Filter {
// //   column?: { Name: string; field: string };
// //   operator?: string;
// //   value?: string;
// //   startDate?: string;
// //   endDate?: string;
// // }

// // interface FilterContextProps {
// //   filter: Filter;
// //   setFilter: (newFilter: Filter) => void;
// //   handleChange: (key: keyof Filter, value: any) => void;
// // }

// // const FilterContext = createContext<FilterContextProps | undefined>(undefined);

// // export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
// //   const [filter, setFilterState] = useState<Filter>({});

// //   const setFilter = (newFilter: Filter) => {
// //     setFilterState(newFilter);
// //   };

// //   // const handleChange = (key: keyof Filter, value: any) => {
// //   //   setFilterState((prev) => ({
// //   //     ...prev,
// //   //     [key]: value,
// //   //   }));
// //   // };
// //   const handleChange = (key: keyof Filter, value: any) => {
// //   setFilter((prev) => {
// //     let updated = { ...prev, [key]: value };

// //     if (key === "column") {
// //       const colField = value?.field?.toLowerCase() || "";

// //       if (colField.includes("date")) {
// //         // default operator for date fields
// //         updated.operator = "between";
// //         updated.startDate = "";
// //         updated.endDate = "";
// //         updated.value = "";
// //       } else {
// //         // reset date values if switching to non-date column
// //         updated.operator = "";
// //         updated.startDate = "";
// //         updated.endDate = "";
// //       }
// //     }

// //     return updated;
// //   });
// // };


// //   return (
// //     <FilterContext.Provider value={{ filter, setFilter, handleChange }}>
// //       {children}
// //     </FilterContext.Provider>
// //   );
// // };

// // export const useFilterContext = () => {
// //   const context = useContext(FilterContext);
// //   if (!context) throw new Error("useFilterContext must be used inside FilterProvider");
// //   return context;
// // };
// import React, { createContext, useContext, useState, ReactNode } from "react"; 

// interface Filter {
//   column?: { Name: string; field: string };
//   operator?: string;
//   value?: string;
//   startDate?: string;
//   endDate?: string;
// }

// // interface FilterContextProps {
// //   filter: Filter;
// //   errors: any;
// //   setFilter: React.Dispatch<React.SetStateAction<Filter>>;
// //   setErrors: React.Dispatch<React.SetStateAction<Filter>>;
// //   handleChange: (key: keyof Filter, value: any) => void;
// //   page: number;
// //   setPage: React.Dispatch<React.SetStateAction<number>>;
// //   pageSize: number;
// //   setPageSize: React.Dispatch<React.SetStateAction<number>>;
// //   paginationChange: boolean;
// //   setPaginationChange: React.Dispatch<React.SetStateAction<boolean>>;
// //   paginationData: boolean;
// //   setPaginationData: React.Dispatch<React.SetStateAction<boolean>>;
// // }
// interface FilterContextProps {
//   filter: Filter;
//   errors: { [key: string]: any };
//   setFilter: React.Dispatch<React.SetStateAction<Filter>>;
//   setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
//   handleChange: (key: keyof Filter, value: any) => void;
//  filterValue?: string; 
//   // pagination-related
//   page: number;
//   setPage: React.Dispatch<React.SetStateAction<number>>;
//   pageSize: number;
//   setPageSize: React.Dispatch<React.SetStateAction<number>>;
//   paginationChange: boolean;
//   setPaginationChange: React.Dispatch<React.SetStateAction<boolean>>;
//   paginationData: boolean;
//   setPaginationData: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const FilterContext = createContext<FilterContextProps | undefined>(undefined);

// export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [filter, setFilter] = useState<Filter>({});
//   const [errors, setErrors] = useState<{ [key: string]: any }>({});
//   const [paginationChange, setPaginationChange] = useState(false);
//   const [paginationData, setPaginationData] = useState(false);
//   const [pageSize, setPageSize] = useState(100);
//   // const [page, setpage] = useState(0);
//   const [page, setPage] = useState(0);
// console.log("context filter:", filter);
//   // const handleChange = (key: keyof Filter, value: any) => {
//   //   setFilter((prev) => {
//   //     let updated: Filter = { ...prev, [key]: value };

//   //     if (key === "column") {
//   //       const colField = value?.field?.toLowerCase() || "";

//   //       if (colField.includes("date")) {
//   //         updated.operator = "between";
//   //         updated.startDate = "";
//   //         updated.endDate = "";
//   //         updated.value = "";
//   //       } else {
//   //         updated.operator = "";
//   //         updated.startDate = "";
//   //         updated.endDate = "";
//   //       }
//   //     }

//   //     return updated;
//   //   });
//   // };
// const handleChange = (key: keyof Filter, value: any) => {
//   setFilter((prev) => {
//     let updated: Filter = { ...prev, [key]: value };

//     if (key === "column") {
//       const colField = value?.field?.toLowerCase() || "";
//       if (colField.includes("date")) {
//         // updated.operator = "between";
//         updated.startDate = "";
//         updated.endDate = "";
//         updated.value = "";
//       } else {
//         updated.operator = "";
//         updated.startDate = "";
//         updated.endDate = "";
//       }
//     }

//     return updated;
//   });

//   setErrors((prevErrors) => {
//     const newErrors = { ...prevErrors };
//     delete newErrors[key];
//     return newErrors;
//   });
// };

//   return (
//     <FilterContext.Provider 
//     // value={{ filter, setFilter,errors,setErrors, handleChange,page,
//     //   setPage,
//     //   pageSize,
//     //   setPageSize,
//     //   paginationChange,
//     //   setPaginationChange,
//     //   paginationData,
//     //   setPaginationData }}
//      value={{
//       filter,
//       setFilter,
//       errors,
//       setErrors,
//       handleChange,
//       page,
//       setPage,
//       pageSize,
//       setPageSize,
//       paginationChange,
//       setPaginationChange,
//       paginationData,
//       setPaginationData
//     }}
//       >
//       {children}
//     </FilterContext.Provider>
//   );
// };

// export const useFilterContext = () => {
//   const context = useContext(FilterContext);
//   if (!context) throw new Error("useFilterContext must be used inside FilterProvider");
//   return context;
// };
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
  const [paginationData, setPaginationData] = useState<any>(null); // Changed to store pagination info
  const [pageSize, setPageSize] = useState(25); // Changed default to 25
  const [page, setPage] = useState(0);

  // console.log("context filter:", filter);
  // console.log("context paginationData:", paginationData);

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