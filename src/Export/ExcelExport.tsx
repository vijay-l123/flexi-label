import React, { useState } from "react";
import { useSelector } from "react-redux";
import ExcelJS from "exceljs";
import { Button, createSvgIcon } from "@mui/material";
// import logoLeePharma from "../assets/Images/Lee-pharma-logo.jpg";
import logoLeePharma from "../Images/favicon.png";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { CircularProgress } from "@mui/material";
// import { formatGridDate } from "../../DateTimeFormat/DateTimeFormat";

export const DynamicTableWithExcelExport = ({
  status,
  keyValue,
  reorderedColumns,
  filteredfinalRows,
  loadingStatus,
  authData
}:any) => {
    const [isLoading, setIsLoading] = useState(false);

  console.log("reorderedColumns",filteredfinalRows,reorderedColumns,authData);

  const ExportIcon = createSvgIcon(
    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
    "SaveAlt"
  );
  const arrayBufferToBase64 = (buffer:any) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return window.btoa(binary);
  };

  const handleExportExcel = async () => {
    try {
       
    setIsLoading(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Exported Data");
      const imageUrl = logoLeePharma;
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.arrayBuffer();
      const base64Image = arrayBufferToBase64(imageBlob);
      const imageId = workbook.addImage({
        base64: base64Image,
        extension: "png",
      });

// const visibleColumns = reorderedColumns?.filter((col: any) => col.display !== false);
// const totalColumns = (visibleColumns?.length || 0) + 1; // +1 for S No

// const username = authData?.user;
// const now = new Date().toLocaleString();

// // HEADER
// const headerRow = worksheet.addRow([`${username}  |  ${now}`]);

// worksheet.mergeCells(
//   headerRow.number,
//   1,
//   headerRow.number,
//   totalColumns
// );

// headerRow.getCell(1).alignment = {
//   horizontal: "center",
//   vertical: "middle",
// };

// headerRow.getCell(1).font = {
//   bold: true,
//   size: 14,
// };

// // space row
// worksheet.addRow([]);
// const visibleColumns = reorderedColumns?.filter((col: any) => col.display !== false);
const hiddenColumns = ["currentVersionFileId", "previousVersionFileId"];

const visibleColumns = reorderedColumns?.filter(
  (col: any) => col.display !== false && !hiddenColumns.includes(col.field)
);
const totalColumns = (visibleColumns?.length || 0) + 1; // +1 for S No

const username = authData?.user;
const now = new Date().toLocaleString();

// PRINTED BY
const printedByRow = worksheet.addRow([`Printed By : ${username}`]);

worksheet.mergeCells(
  printedByRow.number,
  1,
  printedByRow.number,
  totalColumns
);

printedByRow.getCell(1).alignment = {
  horizontal: "center",
  vertical: "middle",
};

printedByRow.getCell(1).font = {
  bold: true,
  size: 13,
};

// PRINTED ON
const printedOnRow = worksheet.addRow([`Printed On : ${now}`]);

worksheet.mergeCells(
  printedOnRow.number,
  1,
  printedOnRow.number,
  totalColumns
);

printedOnRow.getCell(1).alignment = {
  horizontal: "center",
  vertical: "middle",
};

printedOnRow.getCell(1).font = {
  size: 12,
};

// space before table
worksheet.addRow([]);
      // if (hasColumns) {
  worksheet.addRow([
    "S No",
    ...visibleColumns.map((col:any) => col.name),
  ]);
// } else {
  // worksheet.addRow(["No Records"]);
// }

if (filteredfinalRows && filteredfinalRows.length > 0) {

filteredfinalRows.forEach((row: any, index: any) => {
    // console.log("row",row)
  const excelRow = worksheet.addRow([
    index + 1,
    ...visibleColumns.map((col: any) => {
      const value = row[col.field];

      if (["hodInitiated","qaApproved","finalHodApproved","packingDepartmentApproved"].includes(col.field)) {
        return value === "True" ? "✅" : "❎";
      } else if (col.field === "IsAccountLock") {
        return value ? "Locked" : "Unlocked";
      } else {
        return value ?? "";
      }
    }),
  ]);

  // Apply row background color from API
 if (row["colorCode"]) {
    const hex = row["colorCode"].replace("#", "");
    const argb = `FF${hex}`; // ExcelJS requires ARGB format

    excelRow.eachCell((cell) => {
      cell.font = {
        color: { argb }
      };
    });
  }
});
} else {

  const noDataRow = worksheet.addRow(["No Records Found"]);

const colCount = reorderedColumns?.length > 0
  ? reorderedColumns.length + 1   // +1 for "S No"
  : 5; // default merge 5 cells if no columns

const endColLetter = String.fromCharCode(64 + colCount);

worksheet.mergeCells(`A${noDataRow.number}:${endColLetter}${noDataRow.number}`);

noDataRow.getCell(1).alignment = {
  horizontal: "center",
  vertical: "middle",
};

noDataRow.getCell(1).font = {
  bold: true,
  size: 12,
};

noDataRow.height = 30;

}

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `FlexiElabel-exported-table.xlsx`;
      link.click();
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }finally {
    setIsLoading(false); 
  }
  };

  return (
    <div>

        <Button
        //   variant="outlined"
          fullWidth
        //   sx={{
        //     textTransform: "none",
        //     borderColor: "#2e7d32",
        //     color: "#2e7d32",
        //     "&:hover": { borderColor: "#1b5e20", backgroundColor: "#f1f8e9" },
        //     //  borderRadius: 2,
        //     //  py: 1.5
        //   }}
          onClick={handleExportExcel}
        //    disabled={loadingStatus === "loading" ||isLoading|| !reorderedColumns?.length}
          startIcon={
          // <FileDownloadIcon />
       ( (!reorderedColumns?.length)||isLoading)  ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />

          }
        >
          {/* {(keyValue === "Cumulative" ? loadingStatus : !reorderedColumns?.length) ? "Preparing..." :isLoading ? "Preparing your download file" : keyValue === "Cumulative" ? "Export All":"Export Current"} */}
          {/* {loadingStatus === "loading" || !filteredfinalRows?.length || !reorderedColumns?.length ? "Preparing..." :isLoading ? "Preparing your download file" : "Export Current"} */}
          Export Excel
        </Button>
      
    </div>
  );
};
