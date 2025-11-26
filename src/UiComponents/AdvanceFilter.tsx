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
import useUserAuthContext from "../Context/UserAuthContext";
import useLabelsContext from "../Context/LabelsContext";
import { useFilterContext } from "../Context/FilterContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface LColumns {
  selectedTab?: any;
}

const AdvancedFilter = (props: LColumns) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resetClick, setResetClick] = useState<any>(null);
  
  // Local state for filter values (not applied until Apply button is clicked)
  const [localFilter, setLocalFilter] = useState<any>({});
  const [localErrors, setLocalErrors] = useState<{ [key: string]: any }>({});
  
  const open = Boolean(anchorEl);
  const { tabValue } = useMasterAuthContext();
  const { updateUsersData } = useUserAuthContext();
  const { updateLabelsData } = useLabelsContext();
  const { filter, setFilter, setPage, setPaginationChange } = useFilterContext();

  // const isDateField = (field?: string) => {
  //   if (!field) return false;
  //   return field.toLowerCase().includes("date");
  // };
const isDateField = (field?: string) => {
  if (!field) return false;
  const lowerField = field.toLowerCase();
  return lowerField.includes("date") && !lowerField.includes("implementationdate");
};

  // Local validation function for local filter state
  const validateLocal = () => {
    const newErrors: { [key: string]: string } = {};

    if (!localFilter.column) newErrors.column = "Column is required";
    if (!localFilter.operator) newErrors.operator = "Operator is required";

    if (isDateField(localFilter.column?.field)) {
      if (localFilter?.operator !== "equals") {
        if (!localFilter.startDate) {
          newErrors.startDate = "Start date is required";
        } else if (!dayjs(localFilter.startDate, "MM-DD-YYYY", true).isValid()) {
          newErrors.startDate = "Start date is invalid";
        }

        if (!localFilter.endDate) {
          newErrors.endDate = "End date is required";
        } else if (!dayjs(localFilter.endDate, "MM-DD-YYYY", true).isValid()) {
          newErrors.endDate = "End date is invalid";
        }

        if (
          localFilter.startDate &&
          localFilter.endDate &&
          dayjs(localFilter.startDate, "MM-DD-YYYY").isAfter(dayjs(localFilter.endDate, "MM-DD-YYYY"))
        ) {
          newErrors.startDate = "Start date cannot be after end date";
          newErrors.endDate = "End date cannot be before start date";
        }
      } else if (localFilter?.operator === "equals") {
        if (!localFilter.value) newErrors.value = "Value is required";
      }
    } else {
      if (!localFilter.value) newErrors.value = "Value is required";
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Local change handler that only updates local state
  const handleLocalChange = (key: string, value: any) => {
    setLocalFilter((prev: any) => {
      let updated: any = { ...prev, [key]: value };

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

    setLocalErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Initialize local filter with current applied filter when opening
    setLocalFilter({ ...filter });
    setLocalErrors({});
  };

  const handleClose = () => {
    setResetClick(false);
    setAnchorEl(null);
    setLocalErrors({});
    // Reset local filter to current applied filter when closing without applying
    setLocalFilter({ ...filter });
  };

  const hasFilterValues = (): boolean => {
    return !!(
      filter.column ||
      filter.operator ||
      filter.value ||
      filter.startDate ||
      filter.endDate ||
      filter.filterValue
    );
  };

  const handleReset = () => {
    setFilter({});
    setLocalFilter({});
    setLocalErrors({});
    setPage(0); // Reset to first page
    setPaginationChange(true);
    
    // Trigger appropriate data refresh based on context
    if (props?.selectedTab !== undefined) {
      // Labels context
      updateLabelsData(true);
    } else {
      // Users context
      updateUsersData(true);
    }
    
    setAnchorEl(null);
  };

  const handleApply = () => {
    if (validateLocal()) {
      let filterValue = "";
      
      if (isDateField(localFilter.column?.field)) {
        if (localFilter.operator === "equals") {
          filterValue = localFilter.value?.trim() || "";
        } else {
          if (localFilter.startDate && localFilter.endDate) {
            filterValue = `${localFilter.startDate}|${localFilter.endDate}`;
          }
        }
      } else {
        filterValue = localFilter.value?.trim() || "";
      }
      
      console.log("Applying filter with values:", {
        column: localFilter.column,
        operator: localFilter.operator,
        filterValue: filterValue,
        value: localFilter.value
      });
      
      // Apply the local filter to the actual filter context with proper filterValue
      const appliedFilter = {
        column: localFilter.column,
        operator: localFilter.operator,
        value: localFilter.value,
        startDate: localFilter.startDate,
        endDate: localFilter.endDate,
        filterValue: filterValue, // This is the key field that was missing
      };
      
      setFilter(appliedFilter);

      const payload = {
        filterCol: localFilter.column?.field || "",
        filterOperator: localFilter.operator || "",
        filterValue: filterValue,
      };
      // console.log("Filter payload being sent:", payload);

      // Reset to first page and trigger data refresh
      setPage(0);
      setPaginationChange(true);
      
      // Trigger appropriate data refresh based on context
      if (props?.selectedTab !== undefined) {
        // Labels context
        updateLabelsData(true);
      } else {
        // Users context
        updateUsersData(true);
      }
      
      setAnchorEl(null);
    }
  };

  // console.log("Current filter state:", filter);
  // console.log("Local filter state:", localFilter);
  // console.log("Validation errors:", localErrors);
  // console.log("props?.selectedTab1:", props);
  // console.log("props?.tabValue:", tabValue);

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
        { Name: "ANDA Number", field: "AndaNumber" },
        { Name: "Product Name", field: "ProductName" },
        { Name: "Customer Name", field: "CustomerName" },
        { Name: "Label Type", field: "LabelType" },
        // { Name: "PM-Code", field: "PMCode" },
        // { Name: "NDC Number", field: "NDC Number" },
        { Name: "PM Code", field: "PmCode" },
        { Name: "NDC Number", field: "Ndcnumber" },
        { Name: "Job Number", field: "JobNumber" },
        { Name: "Proof Number", field: "ProofNumber" },
        { Name: "Approved Date", field: "ApprovedDate" },
        { Name: "Implementation Date", field: "ImplementationDate" },
        // { Name: "color", field: "Color" },
        { Name: "No Of Colors", field: "Color" },
        // { Name: "Date Of Absolution", field: "DateOfAbsolution" },
        { Name: "Customer Code", field: "CustomerCode" },
        { Name: "Tablet Count", field: "TabletCount" },
        // { Name: "Current Version", field: "CurrentVersion" },
        { Name: "Revision Number", field: "CurrentVersion" },
        // { Name: "Previous Version", field: "PreviousVersion" },
      ];
    }

    if (props?.selectedTab === 2) {
      return [
        { Name: "ANDA Number", field: "AndaNumber" },
        { Name: "Product Name", field: "ProductName" },
        { Name: "Customer Name", field: "CustomerName" },
        { Name: "Label Type", field: "LabelType" },
        // { Name: "PM-Code", field: "PMCode" },
        // { Name: "NDC Number", field: "NDC Number" },
        { Name: "PM Code", field: "PMCode" },
        { Name: "NDC Number", field: "NDCNumber" },
        { Name: "Job Number", field: "JobNumber" },
        { Name: "Proof Number", field: "ProofNumber" },
        // { Name: "Approved Date", field: "ApprovedDate" },
           { Name: "Create Date", field: "CreatedDate" },
        { Name: "Customer Code", field: "CustomerCode" },
        { Name: "Implementation Date", field: "ImplementationDate" },
        // { Name: "color", field: "Color" },
        { Name: "No Of Colors", field: "Color" },
        // { Name: "Date Of Absolution", field: "DateOfAbsolution" },
        // { Name: "ccf", field: "CCF" },
        { Name: "ccf", field: "CCF" },
        { Name: "Tablet Count", field: "TabletCount" },
        // { Name: "Current Version", field: "CurrentVersion" },
        { Name: "Revision Number", field: "CurrentVersion" },
      ];
    }

    if (props?.selectedTab === 3) {
      return [
        { Name: "ANDA Number", field: "AndaNumber" },
        { Name: "Product Name", field: "ProductName" },
        { Name: "Customer Name", field: "CustomerName" },
        { Name: "Label Type", field: "LabelType" },
        // { Name: "PM-Code", field: "PMCode" },
        // { Name: "NDC Number", field: "NDC Number" },
        // { Name: "PM-Code", field: "PmCode" },
        { Name: "PM Code", field: "PMCode" },
        // { Name: "NDC Number", field: "Ndcnumber" },
        { Name: "NDC Number", field: "NDCNumber" },
        { Name: "Job Number", field: "JobNumber" },
        { Name: "Proof Number", field: "ProofNumber" },
        { Name: "Create Date", field: "CreatedDate" },
        { Name: "Customer Code", field: "CustomerCode" },
        { Name: "Implementation Date", field: "ImplementationDate" },
        // { Name: "color", field: "Color" },
        { Name: "No Of Colors", field: "Color" },
        // { Name: "Date Of Absolution", field: "DateOfAbsolution" },
        // { Name: "ccf", field: "CCF" },
        { Name: "ccf", field: "CCF" },
        { Name: "Tablet Count", field: "TabletCount" },
        // { Name: "Current Version", field: "CurrentVersion" },
        { Name: "Revision Number", field: "CurrentVersion" },
        // { Name: "Hod Initiated", field: "HodInitiated" },
        { Name: "Hod Initiated Date", field: "HodInitiatedDate" },
        // { Name: "QA Approved", field: "QAApproved" },
        { Name: "QA Approved Date", field: "QAApprovedDate" },
        // {
        //   Name: "Packing Department Approved",
        //   field: "PackingDepartmentApproved",
        // },
        {
          Name: "Packing Department Approved Date",
          field: "PackingDepartmentApprovedDate",
        },
        { Name: "Final Hod Approved Date", field: "FinalHodApprovedDate" },
        // { Name: "Final Hod Approved", field: "FinalHodApproved" },
        { Name: "Hod Approved By", field: "HodApprovedBy" },
        { Name: "QA Approved By", field: "QAApprovedBy" },
        { Name: "PD Approved By", field: "PDApprovedBy" },
        { Name: "Final Hod Approved By", field: "FinalHodApprovedBy" },
      ];
    }
    if (props?.selectedTab === 4) {
      return [
        { Name: "ANDA Number", field: "AndaNumber" },
        { Name: "Product Name", field: "ProductName" },
        { Name: "Customer Name", field: "CustomerName" },
        { Name: "Label Type", field: "LabelType" },
        // { Name: "PM-Code", field: "PMCode" },
        // { Name: "NDC Number", field: "NDC Number" },
        { Name: "PM Code", field: "PMCode" },
        { Name: "NDC Number", field: "NDCNumber" },
        { Name: "Job Number", field: "JobNumber" },
        { Name: "Proof Number", field: "ProofNumber" },
        { Name: "Create Date", field: "CreatedDate" },
        { Name: "Customer Code", field: "CustomerCode" },
        { Name: "Implementation Date", field: "ImplementationDate" },
        { Name: "No Of Colors", field: "Color" },
        // { Name: "Date Of Absolution", field: "DateOfAbsolution" },
        // { Name: "ccf", field: "CCF" },
        { Name: "ccf", field: "ccf" },
        { Name: "Tablet Count", field: "TabletCount" },
        // { Name: "Current Version", field: "CurrentVersion" },
        { Name: "Revision Number", field: "CurrentVersion" },
        // { Name: "Hod Initiated", field: "HodInitiated" },
        { Name: "Hod Initiated Date", field: "HodInitiatedDate" },
        // { Name: "QA Approved", field: "QAApproved" },
        { Name: "QA Approved Date", field: "QAApprovedDate" },
        // {
        //   Name: "Packing Department Approved",
        //   field: "PackingDepartmentApproved",
        // },
        {
          Name: "Packing Department Approved Date",
          field: "PackingDepartmentApprovedDate",
        },
        { Name: "Final Hod Approved Date", field: "FinalHodApprovedDate" },
        // { Name: "Final Hod Approved", field: "FinalHodApproved" },
        { Name: "Hod Approved By", field: "HodApprovedBy" },
        { Name: "QA Approved By", field: "QAApprovedBy" },
        { Name: "PD Approved By", field: "PDApprovedBy" },
        { Name: "Final Hod Approved By", field: "FinalHodApprovedBy" },
      ];
    }

    switch (tabValue) {
      case 0:
           return [
          { Name: "ANDA Number", field: "AndaNumber" },
          { Name: "Create Date", field: "CreateDate" },
          { Name: "Modified Date", field: "ModifiedDate" },
        ];
      case 1:
        return [
          { Name: "ANDA Number", field: "AndaNumber" },
          { Name: "Product Name", field: "ProductName" },
          { Name: "Create Date", field: "CreatedDate" },
          { Name: "Modified Date", field: "ModifiedDate" },
        ];
      case 2:
        return [
          { Name: "Create Date", field: "CreateDate" },
          { Name: "Modified Date", field: "ModifiedDate" },
          { Name: "PM Code", field: "PmCode" },
        ];
      case 3:
        return [
          { Name: "Name", field: "Name" },
          { Name: "Create Date", field: "CreateDate" },
          { Name: "Modified Date", field: "ModifiedDate" },
        ];
      case 4:
        return [
          { Name: "Type", field: "Type" },
          { Name: "Create Date", field: "CreatedDate" },
          { Name: "Description", field: "Description" },
        ];
      case 5:
        return [
          { Name: "ANDA Number", field: "AndaNumber" },
          { Name: "Product Name", field: "ProductName" },
          { Name: "Customer", field: "Customer" },
          { Name: "Label Type", field: "LabelType" },
          // { Name: "PM-Code", field: "PMCode" },
          // { Name: "NDC Number", field: "NDC Number" },
          // { Name: "PM-Code", field: "PmCode" },
          { Name: "PM Code", field: "PM-Code" },
        { Name: "NDC Number", field: "NDCNumber" },
          { Name: "TabletCount", field: "TabletCount" },
          { Name: "Create By", field: "CreateBy" },
          { Name: "Create Date", field: "CreateDate" },
          { Name: "Modified By", field: "ModifiedBy" },
          { Name: "Modified Date", field: "ModifiedDate" },
          // { Name: "MasterCopyApprovedDate", field: "masterCopyApprovedDate" },
        ];
      case 6:
        return [
          { Name: "Id", field: "Id" },
          { Name: "Type", field: "Type" },
          { Name: "Description", field: "Description" },
        ];
      default:
        return [
          { Name: "First Name", field: "FirstName" },
          { Name: "Last Name", field: "LastName" },
          { Name: "LogIn Name", field: "LogInName" },
        ];
    }
  };
  const columnOptions = getColumnOptions(tabValue);

  const operatorOptions = [
    { label: "equals", value: "equals" },
    { label: "contains", value: "contains" },
    { label: "between", value: "between" },
  ];
  const availableOperators = isDateField(localFilter.column?.field)
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
                value={
                  columnOptions?.find(
                    (item) => item.field === localFilter.column?.field
                  ) || null
                }
                onChange={(_event, newValue) =>
                  handleLocalChange("column", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Column Name"
                    fullWidth
                    required
                    error={!!localErrors?.column}
                    helperText={localErrors?.column}
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
            {/* Operator */}
            <Box sx={{ marginTop: "15px" }}>
              <Autocomplete
                options={availableOperators}
                getOptionLabel={(option: any) => option.value}
                value={
                  availableOperators.find(
                    (item: any) => item.value === localFilter?.operator
                  ) || null
                }
                onChange={(_event, newValue) =>
                  handleLocalChange("operator", newValue?.value)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Operator"
                    fullWidth
                    required
                    error={!!localErrors.operator}
                    helperText={localErrors.operator}
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
            {(isDateField(localFilter.column?.field) && localFilter?.operator !== "equals") ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "block", gap: 1, mt: 2 }}>
                  {/* Start Date */}
                  <DatePicker
                    label="Start Date"
                    inputFormat="MM-DD-YYYY"
                    value={
                      localFilter.startDate
                        ? dayjs(localFilter.startDate, "MM-DD-YYYY")
                        : null
                    }
                    onChange={(newValue: Dayjs | null) =>
                      handleLocalChange(
                        "startDate",
                        newValue ? newValue.format("MM-DD-YYYY") : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        error={!!localErrors.startDate}
                        helperText={localErrors.startDate}
                        placeholder="MM-DD-YYYY"
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
                    inputFormat="MM-DD-YYYY"
                    value={
                      localFilter.endDate
                        ? dayjs(localFilter.endDate, "MM-DD-YYYY")
                        : null
                    }
                    onChange={(newValue: Dayjs | null) =>
                      handleLocalChange(
                        "endDate",
                        newValue ? newValue.format("MM-DD-YYYY") : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        placeholder="MM-DD-YYYY"
                        error={!!localErrors.endDate}
                        helperText={localErrors.endDate}
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
                  value={localFilter.value || ""}
                  onChange={(e) => handleLocalChange("value", e.target.value)}
                  onBlur={(e) => handleLocalChange("value", (e.target.value || "").trim())}
                  fullWidth
                  onKeyDown={(event) => {
                    if (event.key === "f" || event.key === "F") {
                      event.stopPropagation();
                    }
                  }}
                  error={!!localErrors.value}
                  helperText={localErrors.value}
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
              onClick={hasFilterValues() ? handleReset : handleClose}
            >
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