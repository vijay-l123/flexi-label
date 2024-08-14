import { useDispatch } from "react-redux";
import useMasterAuthContext from "../Context/MasterAuthContext";
import Services from "../Services/Services";
import { setIsCreate, setIsEdit } from "../Redux/MasterDataUpdateSlice/LookupUpdate";

export interface ICreateLabelParams {
  newType: number;
  event: React.FormEvent<HTMLFormElement>;
  data: FormData;
  values: any;
  triggerUpdateMasterData: () => void;
  editState: boolean;
  updateLabelsData: (val: any) => void;
  updateMasterData: (val: any) => void;
  rowState: any;
  isCreateNewVersion: boolean;
}
export function createLabelData(labelParams: ICreateLabelParams, dispatch: any) {
  // debugger
  const {
    newType,
    event,
    data,
    values,
    updateMasterData,
    triggerUpdateMasterData,
    editState,
    updateLabelsData,
    
    rowState,
    isCreateNewVersion,
  } = labelParams;
  let apiParams: any;
  console.log("newType", newType);
  const {getAndaListEx} =Services.Anda
  //ANDA
  if (newType === 0) {
    const tar = event.target;
    const ctar = event.currentTarget;

    apiParams = {
      andaNumber: data.get("andaNumber"),
      isActive: data.get("isActive") === "true" ? true : false,
      andaId: Number(values.selectedAnda),
    };
    const addAnda = async () => {
      try {
        let response = await Services.Anda.addAnda(apiParams).then((success) => {
          updateMasterData(true);
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateAnda = async () => {
      try {
        let response = await Services.Anda.updateAnda(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        getAndaListEx();
        dispatch(setIsEdit(true));
      } catch (error) {
        console.log(error);
      }
    };
    if (editState) {
      updateAnda();
    } else {
      addAnda();
    }
  }
  //PRODUCT
  if (newType === 1) {
    apiParams = {
      productName: data.get("productName"),
      andaId: data.get("selectedAnda") ?? values?.selectedAnda,
      remarks: data.get("remarks"),
      isActive: true,
      productId: Number(values.selectedProduct),
    };

    const addProduct = async () => {
      try {
        let response = await Services.Product.addProduct(apiParams).then((success) => {
          updateMasterData(true);
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateProduct = async () => {
      try {
        let response = await Services.Product.updateProduct(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (editState) updateProduct();
    else addProduct();
  }

  //PmCode
  if (newType === 2) {
    apiParams = {
      pmCode: data.get("pmCode"),
      description: data.get("description"),
      pmCodeId: Number(values.selectedPmCode),
    };

    const addPmCode = async () => {
      try {
        let response = await Services.PmCode.addPmCode(apiParams).then((success) => {
          updateMasterData(true);
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updatePmCode = async () => {
      try {
        let response = await Services.PmCode.updatePmCode(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (editState) updatePmCode();
    else addPmCode();
  }

  //customer
  if (newType === 3) {
    apiParams = {
      customerName: data.get("customerName"),
      address: data.get("address"),
      customerId: Number(values.selectedCustomer),
      //code: data.get("code"),
    };

    const addCustomer = async () => {
      try {
        let response = await Services.Customer.addCustomer(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateCustomer = async () => {
      try {
        let response = await Services.Customer.updateCustomer(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (editState) updateCustomer();
    else addCustomer();
  }

  //label types
  if (newType === 4) {
    apiParams = {
      type: data.get("labelType"),
      description: data.get("description"),
      typeId: values?.selectedLabelType,
    };

    const addLabelType = async () => {
      try {
        let response = await Services.LabelType.addLabelType(apiParams).then((success) => {
          updateMasterData(true);
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateLabelType = async () => {
      try {
        let response = await Services.LabelType.updateLabelType(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (editState) updateLabelType();
    else addLabelType();
  }

  //label
  if (newType === 5 && !isCreateNewVersion) {
    apiParams = {
      andaId: data.get("selectedAnda") ?? values.selectedAnda,
      andaNumber: values.andaNumber ?? "",
      productId: data.get("selectedProduct") ?? values.selectedProduct,
      productName: values?.productName ?? "",
      pmCodeId: data.get("selectedPmCode") ?? values.selectedPmCode,
      pmCode: values?.pmCode ?? "",
      labelTypeId: data.get("selectedLabelType") ?? values.selectedLabelType,
      labelType: values?.labelType ?? "",
      customerId: data.get("selectedCustomer") ?? values.selectedCustomer,
      customerName: values?.customerName ?? "",
      ndcNumber: data.get("ndcNumber") ?? values.ndcNumber,
      tabletCount: data.get("tabletCount") ?? values.tabletCount,
      labelDescription: data.get("labelDescription") ?? values.labelDescription,
      remarks: data.get("remarks") ?? values.remarks,
      printer: data.get("printer") ?? values.printer,
      versionNumber: data.get("versionNumber") ?? values.versionNumber,
      proofNumber: data.get("proofNumber") ?? values.proofNumber,
      flatSize: data.get("flatSize") ?? values.flatSize,
      foldSize: data.get("foldSize") ?? values.foldSize,
    };

    const addLabel = async () => {
      try {
        let response = await Services.Label.addLabel(apiParams).then((success) => {
          updateMasterData(true);
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateLabel = async () => {
      // debugger
      try {
        const updatedParams = {
          ...apiParams,
          id: rowState.lableInfoId ?? rowState.id,
          printer: values?.printer,
          versionNumber: values?.versionNumber,
          proofNumber: values?.proofNumber,
          flatSize: values?.flatSize,
          foldSize: values?.foldSize,
        };
        let response = await Services.Label.updateLabel(updatedParams).then((success) => {
          // updateMasterData(true);
          triggerUpdateMasterData()
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (editState) updateLabel();
    else addLabel();
  }

  if (newType === 5 && isCreateNewVersion) {
    apiParams = {
      labelInfoId: rowState.id,
      andaId: data.get("selectedAnda"),
      productId: data.get("selectedProduct"),
      pmCodeId: data.get("selectedPmCode"),
      labelTypeId: data.get("selectedLabelType"),
      customerId: data.get("selectedCustomer"),
      printer: data.get("printer"),
      ndcNumber: data.get("ndcNumber"),
      jobNumber: data.get("jobNumber"),
      tabletCount: data.get("tabletCount"),
      proofNum: data.get("proofNum") || data.get("proofNumber") || "",
      /////////
      versionNo: data.get("versionNumber"),
      foldSize: data.get("foldSize"),
      flatSize: data.get("flatSize"),
      ccf: data.get("ccf"),
      labelDescription: data.get("labelDescription"),
      fileData: values.fileData,
      fileName: data.get("fileName"),
      isFileInfoChanged: true,
      fileId: data.get("fileId") || "-1",
      remarks: data.get("remarks"),
    };

    const addLabelVersion = async () => {
      try {
        if (apiParams.fileName === "") {
          let version = await Services.LabelVersion.addLabelVersion(
            apiParams
          ).then((success) => {
            updateLabelsData(true);
          });
          console.log("labelinformation", version);
        } else {
          let upload: any = await Services.Document.uploadDocument(
            apiParams
          ).then((uploadResponse) => {
            async function labelVersionAddition() {
              const updatedParams = {
                ...apiParams,
                fileId: uploadResponse.data,
                fileData: null,
              };
              let version = await Services.LabelVersion.addLabelVersion(
                updatedParams
              ).then((success) => {
                updateLabelsData(true);
              });
              console.log("labelinformation", version);
            }
            labelVersionAddition();
          });
          console.log("labelinformation", upload);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    const updateLabelVersion = async () => {
      try {
        let label = await Services.Label.updateLabel(apiParams).then(
          (labelResponse) => {
            async function uploadDocument() {
              let upload: any = await Services.Document.updateDocument(
                apiParams
              ).then((uploadResponse) => {
                async function labelVersionAddition() {
                  const updatedParams = {
                    ...apiParams,
                    id: rowState.id,
                    labelInfoId: rowState.lableInfoId,
                    fileId: values.fileId,
                    fileData: null,
                  };
                  let version = await Services.LabelVersion.updateLabelVersion(
                    updatedParams
                  ).then((success) => {
                    updateLabelsData(true);
                  });
                  console.log("labelinformation", version);
                }
                labelVersionAddition();
              });
              console.log("labelinformation", upload);
            }
            uploadDocument();
          }
        );
        console.log("labelinformation", label);
      } catch (error) {
        console.log(error);
      }
    };

    addLabelVersion();
    
    // if (editState) updateLabelVersion();
    // else addLabelVersion();
  }

  //label version
  if (newType === 6 && isCreateNewVersion) {
    apiParams = {
      versionNo: data.get("versionNumber"),
      foldSize: data.get("foldSize"),
      flatSize: data.get("flatSize"),
      ccf: data.get("ccf"),
      fileData: values.fileData, // Ensure this is an array of files
      fileName: data.get("fileName"),
      isFileInfoChanged: true,
      fileId: data.get("fileId") || 0,
      remarks: data.get("remarks"),
    };

    const addLabelVersion = async () => {
      try {
        let response: any = await Services.Document.uploadDocument(apiParams).then((res) => {
          async function labelVersionAddition() {
            const updatedParams = {
              ...apiParams,
              fileId: res.data,
              fileData: null,
            };
            let response1 = await Services.LabelVersion.addLabelVersion(updatedParams);
            console.log(response1);
          }
          labelVersionAddition();
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    addLabelVersion();
  }
  

  if (newType === 6) {
    apiParams = {
      // type: data.get("lookupType"),
      // description: data.get("description"),
      type: (values.code && '1') || (values.versionNumber && '2') || (values.printer && '3') || (values.proofNumber && '4') || (values.flatSize && '5') || (values.foldSize && '6') || (values.remarks && '7'),
      description: values.code || values.printer || values.versionNumber || values.proofNumber || values.flatSize || values.foldSize || values.remarks,
    };
  
    const addLookup = async () => {
      // debugger;
      try {
        let response = await Services.Lookup.addLookup(apiParams).then((success) => {
          updateMasterData(true);
        });
        console.log(response);
        dispatch(setIsCreate(true));
      } catch (error) {
        console.log(error);
      }
    };
  
    const updateLookup = async () => {
      try {
        const updatedParams = {
          ...apiParams,
          id: rowState.id,
        };
        let response = await Services.Lookup.updateLookup(updatedParams).then((success) => {
          updateMasterData(true);
        });
        
        console.log(response);
        dispatch(setIsEdit(true));
      } catch (error) {
        console.log(error);
      }
    };
  
    if (editState) {
      updateLookup();
    } else {
      addLookup();
    }
  }
}
