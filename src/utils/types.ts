import common from "./common";

export interface IModalProps {
  isOpen: boolean;
  closeModal: (val: boolean) => void;
  defaultToLabel: boolean;
  editState: boolean;
  rowState: any;
  newTypeState: number;
  isCreateNewVersion: boolean;
  setNewTypeState: (val: number) => void;
}

export interface IPdfParams {
  show: boolean;
  fileId: number;
}

export interface IHistoryPopupParams {
  show: boolean;
  fileId: number;
}

export interface INotesPopupParams {
  show: boolean;
  id: number;
}

export interface IReviewPopupParams {
  show: boolean;
  fileId?: number;
}

interface IMenuNavItem {
  icon: React.ReactNode;
  label: string;
  id: number;
  component: string;
  role: any;
}

export interface IMenuNavItems extends Array<IMenuNavItem> {}
