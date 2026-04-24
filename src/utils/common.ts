import { camelCase } from "lodash";

import { IMenuNavItems } from "./types";

// function isValidEmail(val: string) {
//   // let regEmail =
//   //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   // if (!regEmail.test(val)) {
//   //   return true;
//   // }
//   // return false;

//   return val.length === 0;
// }
export const isValidEmail = (email: string) => {
  const regex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return regex.test(email);
};
function isValidPassword(val: string) {
  return val.length === 0;
}

enum TAppPage {
  Login = "Login",
  Labels = "Labels",
  Master = "Master Data",
  UserManagement = "User Management",
  Profile = "Profile",
}

enum TRoleType {
  Initiator = "1",
  HOD = "2",
  QA = "3",
  PackingDepartment = "4",
  LabelViewers = "5",
  FinalHOD = "6",
}

enum TLabelStatus {
  Active = "Active",
  Draft = "Draft",
  UnderReview = "UnderReview",
  Resend = "Resend",
  MoveToLive ="Approved"
}

enum TButtonClick {
  SubmitForReview = "0",
  Approve = "1",
  Resend = "2",
}

const roles = [
  {
    name: "Initiator",
    value: 1,
  },
  {
    name: "HOD",
    value: 2,
  },
  {
    name: "QA",
    value: 3,
  },
  {
    name: "Packing Department",
    value: 4,
  },
  {
    name: "Label Viewers",
    value: 5,
  },
  {
    name: "Final HOD",
    value: 6,
  },
];

const tabData = [
  {
    label: "Active",
    value: 1,
    role: [
      TRoleType.Initiator,
      TRoleType.FinalHOD,
      TRoleType.HOD,
      TRoleType.LabelViewers,
      TRoleType.PackingDepartment,
      TRoleType.QA,
    ],
  },
  {
    label: "Drafts",
    value: 2,
    // role: [TRoleType.Initiator],
        role: [
      TRoleType.Initiator,
      TRoleType.FinalHOD,
      TRoleType.HOD,
      TRoleType.LabelViewers,
      TRoleType.PackingDepartment,
      TRoleType.QA,
    ],
  },
  {
    label: "Under Review",
    value: 3,
    role: [
      TRoleType.Initiator,
      TRoleType.FinalHOD,
      TRoleType.HOD,
      TRoleType.PackingDepartment,
      TRoleType.QA,
    ],
  },
  {
    label: "Approved",
    value: 4,
    role: [
      TRoleType.Initiator,
      TRoleType.FinalHOD,
      TRoleType.HOD,
      TRoleType.PackingDepartment,
      TRoleType.QA,
    ],
  },
];

const LookupDropdownData = [
  {
    label: "Customer Code",
    value: "1",
  },
  {
    label: "Revision Number",
    value: "2",
  },
  {
    label: "Printer",
    value: "3",
  },
  {
    label: "Proof number",
    value: "4",
  },
  {
    label: "Flat size",
    value: "5",
  },
  {
    label: "Fold size",
    value: "6",
  },
  // {
  //   label: "Remarks",
  //   value: "7",
  // },
];
const masterTabData = [
  {
    label: "Anda",
    value: 0,
  },
  {
    label: "Products",
    value: 1,
  },
  {
    label: "PM Code",
    value: 2,
  },

  { label: "Customers", value: 3 },
  {
    label: "Label Types",
    value: 4,
  },
  {
    label: "Lookup",
    value: 6,
  },
  {
    label: "Labels",
    value: 5,
  },
];

function fetchConfirmationTitle(buttonState: any) {
  if (buttonState === TButtonClick.SubmitForReview) return "Submit For Review";
  if (buttonState === TButtonClick.Approve) return "Approve";
  if (buttonState === TButtonClick.Resend) return "Resend";
}

function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
}

function fetchColRow(data: any) {
  const colDefs = data["columns"]
    .filter((i: any) => i.display === true)
    .map((item: any) => {
      return {
        ...item,
        headerName: item.name,
        flex: 1,
        flexGrow: 1,
        flexShrink: 1,
        headerClassName: "super-app-theme--header",
        field: camelCase(item.name),
        fiterable: !item.name?.trim().includes("id"),
      };
    });

  const rowData = data["rows"].map((item: any, index: number) => {
    return { ...camelizeKeys(item), index: index };
  });

  return { colDefs, rowData };
}

function fetchMenuNavData(data: IMenuNavItems, roleId: any) {
  return data.filter(({ role }) => role.includes(roleId));
}

const common = {
  TAppPage,
  TRoleType,
  TLabelStatus,
  TButtonClick,
  isValidEmail,
  isValidPassword,
  roles,
  tabData,
  masterTabData,
  LookupDropdownData,
  fetchConfirmationTitle,
  camelizeKeys,
  fetchColRow,
  fetchMenuNavData,
};
export default common;
