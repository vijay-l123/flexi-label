import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Popup, { IPopupProps } from "../Modal/Components/Popup";
import { ApprovedCellRenderer } from "../AppContainer/Components/GridLayout";
import PDFViewer from "../PDFViewer/Components/PDFViewer";
import { PictureAsPdf } from "@mui/icons-material";
import Controls from "../Controls/Controls";
import { IPdfParams } from "../utils/types";

interface ILabelReviewProps {
  editRowState: any;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: 1,
    borderStyle: "solid",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 1,
    borderStyle: "solid",
  },
}));

export default function CustomizedTables(props: ILabelReviewProps) {
  console.log("ngx-labelreviewprops", props);
  const {
    editRowState: { row },
  } = props;

  const fileVersionId = React.useRef(0);
  const [pdfPopup, setPdfPopup] = React.useState<boolean>(false);

  const pdfPopupState = (val: IPdfParams) => {
    fileVersionId.current = val.fileId;
    setPdfPopup(val.show);
  };

  const pdfDialogProps = {
    isPopup: pdfPopup,
    closePopup: (val: boolean) => setPdfPopup(val),
    dialogTitle: `Label Version`,
    form: "pdfPopup",
    maxWidth: "md",
  };

  return (
    <React.Fragment>
      <Popup {...pdfDialogProps}>
        <PDFViewer fileId={fileVersionId.current} />
      </Popup>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableBody>
            <StyledTableRow key="andaNumber">
              <StyledTableCell align="left">Anda Number</StyledTableCell>
              <StyledTableCell align="left">{row.andaNumber}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="approvedDate">
              <StyledTableCell align="left">Approved Date</StyledTableCell>
              <StyledTableCell align="left">{row.approvedDate}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="currentVersion">
              <StyledTableCell align="left">Current Version</StyledTableCell>
              <StyledTableCell align="left">
                {row.currentVersion}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="currentVersionFile">
              <StyledTableCell align="left">
                Current Version File
              </StyledTableCell>
              <StyledTableCell align="left">
                <React.Fragment>
                  <>
                    {row.currentVersionFileId && (
                      <Controls.IconButton
                        value={row.currentVersionFileId}
                        aria-label="close"
                        onClick={(e: any) => {
                          const pdfParams: IPdfParams = {
                            show: true,
                            fileId: +row.currentVersionFileId,
                          };
                          pdfPopupState(pdfParams);
                        }}
                        color="error"
                      >
                        <PictureAsPdf />
                      </Controls.IconButton>
                    )}
                  </>
                </React.Fragment>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="customerCode">
              <StyledTableCell align="left">Customer Code</StyledTableCell>
              <StyledTableCell align="left">{row.customerCode}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="customerName">
              <StyledTableCell align="left">Customer Name</StyledTableCell>
              <StyledTableCell align="left">{row.customerName}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="finalHodApproved">
              <StyledTableCell align="left">Final HOD Approved</StyledTableCell>
              <StyledTableCell align="left">
                <ApprovedCellRenderer
                  row={row}
                  field="finalHodApproved"
                ></ApprovedCellRenderer>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="finalHodApprovedDate">
              <StyledTableCell align="left">
                Final HOD Approved Date
              </StyledTableCell>
              <StyledTableCell align="left">
                {row.finalHodApprovedDate}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="hodApproved">
              <StyledTableCell align="left">HOD Approved</StyledTableCell>
              <StyledTableCell align="left">
                <ApprovedCellRenderer
                  row={row}
                  field="hodApproved"
                ></ApprovedCellRenderer>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="hodApprovedDate">
              <StyledTableCell align="left">HOD Approved Date</StyledTableCell>
              <StyledTableCell align="left">
                {row.hodApprovedDate}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="jobNumber">
              <StyledTableCell align="left">Job Number</StyledTableCell>
              <StyledTableCell align="left">{row.jobNumber}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="labelType">
              <StyledTableCell align="left">Label Type</StyledTableCell>
              <StyledTableCell align="left">{row.labelType}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="ndcNumber">
              <StyledTableCell align="left">NDC Number</StyledTableCell>
              <StyledTableCell align="left">{row.ndcNumber}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="packingDepartmentApproved">
              <StyledTableCell align="left">
                Packing Department Approved
              </StyledTableCell>
              <StyledTableCell align="left">
                <ApprovedCellRenderer
                  row={row}
                  field="packingDepartmentApproved"
                ></ApprovedCellRenderer>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="packingDepartmentApprovedDate">
              <StyledTableCell align="left">
                Packing Department Approved Date
              </StyledTableCell>
              <StyledTableCell align="left">
                {row.packingDepartmentApprovedDate}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="pmCode">
              <StyledTableCell align="left">PM Code</StyledTableCell>
              <StyledTableCell align="left">{row.pmCode}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="previousVersionFile">
              <StyledTableCell align="left">
                Previous Version File
              </StyledTableCell>
              <StyledTableCell align="left">
                <React.Fragment>
                  <>
                    {row.previousVersionFileId && (
                      <Controls.IconButton
                        value={row.previousVersionFileId}
                        aria-label="close"
                        onClick={(e: any) => {
                          const pdfParams: IPdfParams = {
                            show: true,
                            fileId: +row.previousVersionFileId,
                          };
                          pdfPopupState(pdfParams);
                        }}
                        color="error"
                      >
                        <PictureAsPdf />
                      </Controls.IconButton>
                    )}
                  </>
                </React.Fragment>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="printer">
              <StyledTableCell align="left">Printer</StyledTableCell>
              <StyledTableCell align="left">{row.printer}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="productName">
              <StyledTableCell align="left">Product Name</StyledTableCell>
              <StyledTableCell align="left">{row.productName}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="qaApproved">
              <StyledTableCell align="left">QA Approved</StyledTableCell>
              <StyledTableCell align="left">
                <ApprovedCellRenderer
                  row={row}
                  field="qaApproved"
                ></ApprovedCellRenderer>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="qaApprovedDate">
              <StyledTableCell align="left">QA Approved Date</StyledTableCell>
              <StyledTableCell align="left">
                {row.qaApprovedDate}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="remarks">
              <StyledTableCell align="left">Remarks</StyledTableCell>
              <StyledTableCell align="left">{row.remarks}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow key="status">
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="left">{row.status}</StyledTableCell>
            </StyledTableRow>

            {/* {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.calories}</StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
