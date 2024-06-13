import common from "../utils/common";

const { TLabelStatus, TRoleType, roles } = common;

interface IShowButtonProps {
  rowState: any;
  currentButton: any;
  authData: any;
  isCreateNew?: any;
}

export function checkAlreadyApproved(params: any) {
  const { authData, rowState } = params;
  console.log("NGX ACtion cell rendered", rowState, authData);

  if (authData.roleId === TRoleType.QA) {
    return rowState.qaApproved === ""
      ? true
      : rowState.qaApproved.trim().toLowerCase() === "true"
      ? true
      : false;
  } else if (authData.roleId === TRoleType.PackingDepartment) {
    return rowState.packingDepartmentApproved === ""
      ? true
      : rowState.packingDepartmentApproved.trim().toLowerCase() === "true"
      ? true
      : false;
  } else if (authData.roleId === TRoleType.HOD) {
    return rowState.hodApproved === ""
      ? true
      : rowState.hodApproved.trim().toLowerCase() === "true"
      ? true
      : false;
  } else if (authData.roleId === TRoleType.FinalHOD) {
    return rowState.finalHodApproved === ""
      ? true
      : rowState.finalHodApproved.trim().toLowerCase() === "true"
      ? true
      : false;
  } else if (
    authData.roleId === TRoleType.Initiator &&
    (rowState.status === TLabelStatus.Draft ||
      rowState.status === TLabelStatus.Resend)
  ) {
    return false;
  }

  return true;
}
export function showButton(params: IShowButtonProps) {
  const { rowState, currentButton, authData, isCreateNew } = params;

  const { status } = rowState;

  if (isCreateNew) return true;

  if (status === TLabelStatus.Active || status === undefined) {
    const eligibleButton = ["AddNotes", "CreateNewVersion"];
    const eligibleRole = [TRoleType.Initiator];

    const isValid =
      eligibleButton.includes(currentButton) &&
      eligibleRole.includes(authData.roleId);

    return isValid;
  } else if (status === undefined) return;

  if (status === TLabelStatus.UnderReview) {
    //const eligibleButton = ["Approve", "Resend"];
    const eligibleButton = ["Approve", "Resend", "Review"];
    const eligibleRole = [
      TRoleType.QA,
      TRoleType.PackingDepartment,
      TRoleType.LabelViewers,
      TRoleType.FinalHOD,
      TRoleType.HOD,
    ];

    const isValid =
      eligibleButton.includes(currentButton) &&
      eligibleRole.includes(authData.roleId);

    //const isApproved = checkAlreadyApproved({ authData, rowState });

    return isValid; // && isApproved;
  }

  // if (
  //   status === TLabelStatus.UnderReview &&
  //   TRoleType.HOD.includes(authData.roleId)
  // ) {
  //   const eligibleButton = ["Review"];
  //   const eligibleRole = [TRoleType.HOD];

  //   const isValid =
  //     eligibleButton.includes(currentButton) &&
  //     eligibleRole.includes(authData.roleId);

  //   //const isApproved = checkAlreadyApproved({ authData, rowState });

  //   return isValid; // && isApproved;
  // }
  if (
    status === TLabelStatus.Draft ||
    status === TLabelStatus.Resend ||
    !rowState
  ) {
    const eligibleButton = ["Save", "SubmitForReview", "Edit"];
    const eligibleRole = [TRoleType.Initiator];

    const isValid =
      eligibleButton.includes(currentButton) &&
      eligibleRole.includes(authData.roleId);
    return isValid;
  }

  return false;
}

export function canEdit(roleId: any) {
  const eligibleRole = [TRoleType.Initiator];
  const isValid = eligibleRole.includes(roleId);

  return isValid;
}
