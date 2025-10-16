import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "../Controls/IconButton";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import useMasterAuthContext from "../Context/MasterAuthContext";
import { useFilterContext } from "../Context/FilterContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface LColumns {
  selectedTab?: any;
}
const AdvancedFilter = (props: LColumns) => {
  // console.log("props",props?.selectedTab);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resetClick, setResetClick] = useState<any>(null);
  // const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const open = Boolean(anchorEl);
  const { tabValue } = useMasterAuthContext();
  const { filter, handleChange,setErrors,errors ,setFilter} = useFilterContext();

  const isDateField = (field?: string) => {
    if (!field) return false;
    return field.toLowerCase().includes("date");
  };
  // const validate = () => {
  //   const newErrors: { [key: string]: string } = {};

  //   if (!filter.column) newErrors.column = "Column is required";
  //   if (!filter.operator) newErrors.operator = "Operator is required";

  //   if (isDateField(filter.column?.field)) {
  //     if (!filter.startDate) newErrors.startDate = "Start date is required";
  //     if (!filter.endDate) newErrors.endDate = "End date is required";
  //   } else {
  //     if (!filter.value) newErrors.value = "Value is required";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  const validate = () => {
  const newErrors: { [key: string]: string } = {};

  if (!filter.column) newErrors.column = "Column is required";
  if (!filter.operator) newErrors.operator = "Operator is required";

  if (isDateField(filter.column?.field)) {
    if(filter?.operator !== "equals"){
    if (!filter.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (!dayjs(filter.startDate, "DD-MM-YYYY", true).isValid()) {
      newErrors.startDate = "Start date is invalid";
    }

    if (!filter.endDate) {
      newErrors.endDate = "End date is required";
    } else if (!dayjs(filter.endDate, "DD-MM-YYYY", true).isValid()) {
      newErrors.endDate = "End date is invalid";
    }

    if (
      filter.startDate &&
      filter.endDate &&
      dayjs(filter.startDate, "DD-MM-YYYY").isAfter(dayjs(filter.endDate, "DD-MM-YYYY"))
    ) {
      newErrors.startDate = "Start date cannot be after end date";
      newErrors.endDate = "End date cannot be before start date";
    }
  }else if (filter?.operator === "equals") {
    if (!filter.value) newErrors.value = "Value is required";
  }
  } else {
    if (!filter.value) newErrors.value = "Value is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  console.log("filter", filter);

  const handleClose = () => {
    setResetClick(false);
    setAnchorEl(null);
     setErrors({});
  };

const hasFilterValues = (): boolean => {
  return !!(
    filter.column ||
    filter.operator ||
    filter.value ||
    filter.startDate ||
    filter.endDate
  );
};

const handleReset = () => {
  setFilter({});
  setErrors({});
};

  const handleApply = () => {
          let filterValue = "";
    if (validate()) {
      // let filterValue = "";
      if(isDateField(filter.column?.field)) {
         if (filter.operator === "equals") {
        filterValue = filter.value?.trim() || "";
      } else {
        if (filter.startDate && filter.endDate) {
          filterValue = `${filter.startDate}|${filter.endDate}`;
        }
      }
      }else {
      filterValue = filter.value || "";
    }
      console.log("Valid filter:", filter);
      setAnchorEl(null);
    }
     setFilter((prev: any) => ({
      ...prev,
      filterValue: filterValue,
    }));

    const payload = {
      filterCol: filter.column?.field || "",
      filterOperator: filter.operator || "",
      filterValue: filterValue,
    };
          console.log("payload:", payload);

  };
  
      console.log("Valid errors:", errors);

  interface Column {
    Name: string;
    field: string;
  }

  const getColumnOptions = (
    tabValue?: number,
    selectedTab?: number
  ): Column[] => {
    if (props?.selectedTab === 1) {
      return [
        { Name: "ANDA Number", field: "andaNumber" },
        { Name: "Product Name", field: "productName" },
        { Name: "Customer Name", field: "customerName" },
        // { Name: "Customer", field: "customer" },
        { Name: "Label Type", field: "labelType" },
        { Name: "PM-Code", field: "pmCode" },
        { Name: "NDC Number", field: "ndcNumber" },
        { Name: "Job Number", field: "jobNumber" },
        { Name: "Proof Number", field: "proofNumber" },
        { Name: "Approved Date", field: "approvedDate" },
        { Name: "Customer Code", field: "customerCode" },
        { Name: "Tablet Count", field: "tabletCount" },
        { Name: "Current Version", field: "currentVersion" },
        { Name: "Previous Version", field: "previousVersion" },
        // { Name: "Create By", field: "createBy" },
        // { Name: "Create Date", field: "createDate" },
        // { Name: "Modified By", field: "modifiedBy" },
        // { Name: "Modified Date", field: "modifiedDate" },
        // { Name: "MasterCopyApprovedDate", field: "masterCopyApprovedDate" },
      ];
    }

    if (props?.selectedTab === 2) {
      return [
        { Name: "ANDA Number", field: "andaNumber" },
        { Name: "Product Name", field: "productName" },
        // { Name: "Customer", field: "customer" },
        { Name: "Customer Name", field: "customerName" },
        { Name: "Label Type", field: "labelType" },
        { Name: "PM-Code", field: "pmCode" },
        { Name: "NDC Number", field: "ndcNumber" },
        { Name: "Job Number", field: "jobNumber" },
        { Name: "Proof Number", field: "proofNumber" },
        { Name: "Create Date", field: "createDate" },
        { Name: "Customer Code", field: "customerCode" },
        { Name: "ccf", field: "ccf" },
        { Name: "Tablet Count", field: "tabletCount" },
        { Name: "Current Version", field: "currentVersion" },
      ];
    }

    if (props?.selectedTab === 3) {
      return [
        { Name: "ANDA Number", field: "andaNumber" },
        { Name: "Product Name", field: "productName" },
        // { Name: "Customer", field: "customer" },
        { Name: "Customer Name", field: "customerName" },
        { Name: "Label Type", field: "labelType" },
        { Name: "PM-Code", field: "pmCode" },
        { Name: "NDC Number", field: "ndcNumber" },
        { Name: "Job Number", field: "jobNumber" },
        { Name: "Proof Number", field: "proofNumber" },
        { Name: "Create Date", field: "createDate" },
        { Name: "Customer Code", field: "customerCode" },
        { Name: "ccf", field: "ccf" },
        { Name: "Tablet Count", field: "tabletCount" },
        { Name: "Current Version", field: "currentVersion" },
        { Name: "Hod Initiated", field: "hodInitiated" },
        { Name: "Hod Initiated Date", field: "hodInitiatedDate" },
        { Name: "QA Approved", field: "qaApproved" },
        { Name: "QA Approved Date", field: "qaApprovedDate" },
        {
          Name: "Packing Department Approved",
          field: "packingDepartmentApproved",
        },
        {
          Name: "Packing Department Approved Date",
          field: "packingDepartmentApprovedDate",
        },
        { Name: "Final Hod Approved Date", field: "finalHodApprovedDate" },
        { Name: "Final Hod Approved", field: "finalHodApproved" },
        { Name: "Hod Approved By", field: "hodApprovedBy" },
        { Name: "QA Approved By", field: "qaApprovedBy" },
        { Name: "PD Approved By", field: "pdApprovedBy" },
        { Name: "Final Hod Approved By", field: "finalHodApprovedBy" },
      ];
    }

    switch (tabValue) {
      case 0:
      case 1:
        return [
          { Name: "ANDA Number", field: "andaNumber" },
          { Name: "Create Date", field: "createDate" },
          { Name: "Modified Date", field: "modifiedDate" },
        ];
      case 2:
        return [
          { Name: "Create Date", field: "createDate" },
          { Name: "Modified Date", field: "modifiedDate" },
          { Name: "PM Code", field: "pmCode" },
        ];
      case 3:
        return [
          { Name: "Name", field: "name" },
          { Name: "Create Date", field: "createDate" },
          { Name: "Modified Date", field: "modifiedDate" },
        ];
      case 4:
        return [
          { Name: "Type", field: "type" },
          { Name: "Create Date", field: "createDate" },
          { Name: "Description", field: "description" },
        ];
      case 5:
        return [
          { Name: "ANDA Number", field: "andaNumber" },
          { Name: "Product Name", field: "productName" },
          { Name: "Customer", field: "customer" },
          { Name: "Label Type", field: "labelType" },
          { Name: "PM-Code", field: "pmCode" },
          { Name: "NDC Number", field: "ndcNumber" },
          { Name: "TabletCount", field: "tabletCount" },
          { Name: "Create By", field: "createBy" },
          { Name: "Create Date", field: "createDate" },
          { Name: "Modified By", field: "modifiedBy" },
          { Name: "Modified Date", field: "modifiedDate" },
          { Name: "MasterCopyApprovedDate", field: "masterCopyApprovedDate" },
        ];
      case 6:
        return [
          { Name: "Id", field: "id" },
          { Name: "Type", field: "type" },
          { Name: "Description", field: "description" },
        ];
      default:
        return [
          { Name: "First Name", field: "firstName" },
          { Name: "Last Name", field: "lastName" },
          { Name: "LogIn Name", field: "logInName" },
          // { Name: "Is Active", field: "isactive" },
        ];
    }
  };
  const columnOptions = getColumnOptions(tabValue);

  const operatorOptions = [
    { label: "equals", value: "equals" },
    { label: "contains", value: "contains" },
    { label: "between", value: "between" },
  ];
  const availableOperators = isDateField(filter.column?.field)
  ? operatorOptions.filter((op) => op.value === "equals" || op.value === "between")
  : operatorOptions.filter((op) => op.value !== "between");
  return (
    <>
      <IconButton onClick={handleClick}>
        <FilterListIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="subtitle1" gutterBottom>
            Filter
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Column Name */}
          <Box sx={{ marginBottom: "15px" }}>
            <Box sx={{ marginTop: "15px" }}>
              <Autocomplete
                options={columnOptions || []}
                getOptionLabel={(option) => option.Name}
                // value={columnOptions?.find((item: any) => item.Name) || null}
                value={
                  columnOptions?.find(
                    (item) => item.field === filter.column?.field
                  ) || null
                }
                // onChange={(_event, newValue) => {}}
                onChange={(_event, newValue) =>
                  handleChange("column", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Column Name"
                    fullWidth
                    required
                    error={!!errors?.column}
                    helperText={errors?.column}
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 43,
                      },
                      "& .MuiInputBase-label": {
                        padding: "10px 14px",
                      },
                      "& label": {
                        fontSize: "14px",
                        top: "-5px",
                      },
                      "& .MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.90)",
                      },
                    }}
                  />
                )}
              />
            </Box>
            {/* Oepator */}
            <Box sx={{ marginTop: "15px" }}>
              <Autocomplete
                // options={operatorOptions}
                // getOptionLabel={(option: any) => option?.value || ""}
                // value={
                //   operatorOptions?.find(
                //     (item: any) => item.value === filter?.operator
                //   ) || null
                // }
                    options={availableOperators}
    getOptionLabel={(option: any) => option.value}
    value={
      availableOperators.find(
        (item: any) => item.value === filter?.operator
      ) || null
    }
                onChange={(_event, newValue) =>
                  handleChange("operator", newValue?.value)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Operator"
                    fullWidth
                    required
                    error={!!errors.operator}
                    helperText={errors.operator}
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 43,
                      },
                      "& .MuiInputBase-label": {
                        padding: "10px 14px",
                      },
                      "& label": {
                        fontSize: "14px",
                        top: "-5px",
                      },
                      "& .MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.90)",
                      },
                    }}
                  />
                )}
              />
            </Box>
            {(isDateField(filter.column?.field) && filter?.operator !== "equals" )? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "block", gap: 1, mt: 2 }}>
                  {/* Start Date */}
                  <DatePicker
                    label="Start Date"
                    inputFormat="DD-MM-YYYY"
                    value={
                      filter.startDate
                        ? dayjs(filter.startDate, "DD-MM-YYYY")
                        : null
                    }
                    onChange={(newValue: Dayjs | null) =>
                      handleChange(
                        "startDate",
                        newValue ? newValue.format("DD-MM-YYYY") : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        placeholder="DD-MM-YYYY"
                        sx={{
                          "& .MuiInputBase-root": { height: 40 },
                          "& .MuiInputLabel-root": { top: -4, fontSize: 14 },
                          "& .MuiInputLabel-shrink": { top: 1 },
                          mb: 2,
                        }}
                      />
                    )}
                  />

                  {/* End Date */}
                  <DatePicker
                    label="End Date"
                    inputFormat="DD-MM-YYYY"
                    value={
                      filter.endDate
                        ? dayjs(filter.endDate, "DD-MM-YYYY")
                        : null
                    }
                    onChange={(newValue: Dayjs | null) =>
                      handleChange(
                        "endDate",
                        newValue ? newValue.format("DD-MM-YYYY") : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        placeholder="DD-MM-YYYY"
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        sx={{
                          "& .MuiInputBase-root": { height: 40 },
                          "& .MuiInputLabel-root": { top: -4, fontSize: 14 },
                          "& .MuiInputLabel-shrink": { top: 1 },
                        }}
                      />
                    )}
                  />
                </Box>
              </LocalizationProvider>
            ) : (
              <Box sx={{ marginTop: "15px" }}>
                <TextField
                  label="Value *"
                  value={filter.value || ""}
                  // onChange={(event) => {}}
                  onChange={(e) => handleChange("value", e.target.value)}
                  fullWidth
                  onKeyDown={(event) => {
                    if (event.key === "f" || event.key === "F") {
                      event.stopPropagation();
                    }
                  }}
                  error={!!errors.value}
                  helperText={errors.value}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                    "& .MuiInputLabel-root": {
                      top: -4,
                      fontSize: 14,
                    },
                    "& .MuiInputLabel-shrink": {
                      top: 1,
                    },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{ color: "#1e364b", borderColor: "#1e364b" }}
              // onClick={handleClose}
              onClick={hasFilterValues() ? handleReset : handleClose} 
            >
              {/* Cancel */}
              {hasFilterValues() ? "Reset" : "Cancel"}
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#13a7c8",
                "&:hover": { backgroundColor: "#13a7c8" },
              }}
              onClick={handleApply}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default AdvancedFilter;
