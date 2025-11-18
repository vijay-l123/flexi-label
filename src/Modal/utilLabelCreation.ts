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
  setLabelversionAPiCall: (val: any) => void;
  LabelversionAPiCall?: any;
  rowState: any;
  selectedTab?: any;
  isCreateNewVersion: boolean;
  isChangeColor: any;
  isApproved:any;
  isImplementationDate:any;
  
}
// const formatToISOString = (dateStr: string) => {
//   if (!dateStr) return null;
//   try {
//     // Expect input in MM-DD-YYYY
//     const [month, day, year] = dateStr.split("-");
//     const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
//     return date.toISOString(); // Always in UTC
//   } catch (error) {
//     console.error("Invalid date format:", dateStr);
//     return null;
//   }
// };

// const formatToISOString = (dateStr: string) => {
//   if (!dateStr) return null;

//   try {
//     // Expected format: "MM/DD/YYYY hh:mm:ss A"
//     // Example: "10/22/2025 6:30:00 PM"

//     const [datePart, timePart, meridian] = dateStr.split(" "); // ["10/22/2025", "6:30:00", "PM"]
//     const [month, day, year] = datePart.split("/").map(Number);
//     let [hour, minute, second] = timePart.split(":").map(Number);

//     // Convert 12-hour to 24-hour format
//     if (meridian === "PM" && hour < 12) hour += 12;
//     if (meridian === "AM" && hour === 12) hour = 0;

//     // Construct UTC date
//     const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second || 0));
//     return date.toISOString(); // "2025-10-22T18:30:00.000Z"
//   } catch (error) {
//     console.error("Invalid date format:", dateStr, error);
//     return null;
//   }
// };
const formatToISOString = (dateStr: string) => {
  if (!dateStr) return null;

  try {
    // Handle multiple formats gracefully
    // Examples: "10/22/2025", "10/22/2025 6:30:00 PM", "2025-10-22"
    const datePart = dateStr.split(" ")[0]; // take only date part
    const parts = datePart.includes("/") ? datePart.split("/") : datePart.split("-");

    let month, day, year;

    if (parts[0].length === 4) {
      // Format: YYYY-MM-DD
      [year, month, day] = parts.map(Number);
    } else {
      // Format: MM/DD/YYYY or MM-DD-YYYY
      [month, day, year] = parts.map(Number);
    }

    // Construct UTC date with midnight time (00:00:00)
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    return date.toISOString(); // e.g. "2025-10-22T00:00:00.000Z"
  } catch (error) {
    console.error("Invalid date format:", dateStr, error);
    return null;
  }
};

export function createLabelData(labelParams: ICreateLabelParams, dispatch: any) {
  // debugger
  const {
    newType,
    event,
    data,
    values,
    updateMasterData,
    selectedTab,
    triggerUpdateMasterData,
    editState,
    updateLabelsData,
    isChangeColor,
    isApproved,
    rowState,
    isCreateNewVersion,
    setLabelversionAPiCall,
    LabelversionAPiCall,
    isImplementationDate
  } = labelParams;
  let apiParams: any;
  // console.log("newType", newType);
  // console.log("rowState", rowState.color);
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
        // console.log(response);
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
      // andaId: data.get("selectedAnda") ?? values?.selectedAnda,
      andaId: values?.selectedAnda,
      remarks: data.get("remarks"),
      isActive: true,
      productId: Number(values.selectedProduct),
    };

    const addProduct = async () => {
      try {
        let response = await Services.Product.addProduct(apiParams).then((success) => {
          updateMasterData(true);
        });
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateProduct = async () => {
      try {
        let response = await Services.Product.updateProduct(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        // console.log(response);
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
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updatePmCode = async () => {
      try {
        let response = await Services.PmCode.updatePmCode(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        // console.log(response);
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
        
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateCustomer = async () => {
      try {
        let response = await Services.Customer.updateCustomer(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        // console.log(response);
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
      // description: data.get("description"),
      description: data.get("description"),
      typeId: values?.selectedLabelType,
    };

    const addLabelType = async () => {
      try {
        let response = await Services.LabelType.addLabelType(apiParams).then((success) => {
          updateMasterData(true);
        });
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    const updateLabelType = async () => {
      try {
        let response = await Services.LabelType.updateLabelType(apiParams).then((success) => {
          updateMasterData(true);
        });
        
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (editState) updateLabelType();
    else addLabelType();
  }

  //label
  if (newType === 5 && !isCreateNewVersion && selectedTab != 2) {
    apiParams = {
      andaId: values.selectedAnda,
      // andaId: data.get("selectedAnda") ?? values.selectedAnda,
      andaNumber:  "",
      // andaNumber: values.andaNumber ?? "",
      productId:  values.selectedProduct,
      // productId: data.get("selectedProduct") ?? values.selectedProduct,
      productName: "",
      // productName: values?.productName ?? "",
      pmCodeId: values.selectedPmCode,
      // pmCodeId: data.get("selectedPmCode") ?? values.selectedPmCode,
      pmCode: "",
      // pmCode: values?.pmCode ?? "",
      labelTypeId:  values.selectedLabelType,
      // labelTypeId: data.get("selectedLabelType") ?? values.selectedLabelType,
      printer:data.get("printer") ?? values.printer,
      labelType:  "",
      // labelType: values?.labelType ?? "",
      customerId: values.selectedCustomer,
      // customerId: data.get("selectedCustomer") ?? values.selectedCustomer,
      colorcode: values.colorcode,
      // implementationDate: formatToISOString(values.implementationDate),
      implementationDate: values.implementationDate,
      customerName: "",
      // customerName: values?.customerName ?? "",
      ndcNumber: data.get("ndcNumber") ?? values.ndcNumber,
      tabletCount: data.get("tabletCount") ?? values.tabletCount,
      labelDescription: data.get("labelDescription") ?? values.labelDescription,
      remarks: data.get("remarks") ?? values.remarks,
    };

    const addLabel = async () => {
      try {
        let response = await Services.Label.addLabel(apiParams).then((success) => {
          updateMasterData(true);
        });
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    // const updateLabelColor = async () => {
    //   // debugger
    //   try {
    //     const updatedParams = {
    //       ...apiParams,
    //       id: rowState.id,
    //       colorCode: rowState?.colorCode
    //     };
    //     let response = await Services.Label.updateLabelColor(updatedParams).then((success) => {
    //       // updateMasterData(true);
    //       triggerUpdateMasterData()
    //     });
    //     console.log(response);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    const updateLabel = async () => {
      // debugger
      try {
        const updatedParams = {
          ...apiParams,
          id: rowState.lableInfoId ?? rowState.id,
          // printer: rowState?.printer
        };
        let response = await Services.Label.updateLabel(updatedParams).then((success) => {
          // updateMasterData(true);
          triggerUpdateMasterData()
          setLabelversionAPiCall(true);
        });
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
         const updateImplementaionDate = async () => {
      // debugger
      try {
        const updatedParams = {
            ...apiParams,
          id: rowState.currentVersionId,
          implementationDate: apiParams?.implementationDate
        };
        let response = await Services.LabelVersion.updateImplementaionDate(updatedParams).then((success) => {
          // updateMasterData(true);
          triggerUpdateMasterData()
          setLabelversionAPiCall(true);
        });
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    // if (editState && !isChangeColor) updateLabel();
    // if (!editState && !isChangeColor) {
    //   addLabel();
    // } 
    if (editState && !isChangeColor && !isImplementationDate) {updateLabel();}
    if (!editState && !isChangeColor && !isImplementationDate) {
      addLabel();
    } 
    if (editState && !isChangeColor && isImplementationDate) {
      updateImplementaionDate();
    } 
    // if (editState) updateLabel();
    // else addLabel();
    // if(isChangeColor) updateLabelColor();
    // else if (editState) updateLabel();
    
  }

  if (newType === 5 && isCreateNewVersion) {
      const hasFile = values.fileData;
    apiParams = {
      labelInfoId: rowState.id,
      andaId: data.get("selectedAnda"),
      productId: data.get("selectedProduct"),
      pmCodeId: data.get("selectedPmCode"),
      labelTypeId: data.get("selectedLabelType"),
      customerId: data.get("selectedCustomer"),
      printer: values.printer,
      ndcNumber: data.get("ndcNumber"),
      jobNumber: data.get("jobNumber"),
      tabletCount: data.get("tabletCount"),
      proofNum: data.get("proofNum") || data.get("proofNumber") || "",
    //   implementationDate: values.implementationDate
    // ? formatToISOString(values.implementationDate)
    // : null,
      implementationDate: values.implementationDate
    ? values.implementationDate
    : null,
      color: values.color,
      // colorcode: values.colorcode,
      /////////
      versionNo: data.get("versionNumber")||"",
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
// console.log("23232",apiParams);

    // const addLabelVersion = async () => {
    //   try {
    //     if (apiParams.fileName === "") {
    //       let version = await Services.LabelVersion.addLabelVersion(
    //         apiParams
    //       ).then((success) => {
    //         updateLabelsData(true);
    //       });
    //       console.log("labelinformation", version);
    //     } else {
    //       let upload: any = await Services.Document.uploadDocument(
    //         apiParams
    //       ).then((uploadResponse) => {
    //         async function labelVersionAddition() {
    //           const updatedParams = {
    //             ...apiParams,
    //             fileId: uploadResponse.data,
    //             fileData: null,
    //           };
    //           let version = await Services.LabelVersion.addLabelVersion(
    //             updatedParams
    //           ).then((success) => {
    //             updateLabelsData(true);
    //           });
    //           console.log("labelinformation", version);
    //         }
    //         labelVersionAddition();
    //       });
    //       console.log("labelinformation", upload);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
     const addLabelVersion = async () => {
    try {
      // if file present  upload
      
      if (hasFile[0]) {
         const uploadResponse = await Services.Document.uploadDocument(apiParams);
        //  debugger
      const updatedParams = {
        ...apiParams,
        fileId: uploadResponse.data,
        fileData: null,
      };

      const version = await Services.LabelVersion.addLabelVersion(updatedParams);
      updateLabelsData(true);
      // console.log("Label version created (with file)", version);
      }else{
         // no file upload
        const version = await Services.LabelVersion.addLabelVersion(apiParams);
        updateLabelsData(true);
        // console.log("Label version created (no file)", version);
        return;
      }
    } catch (error) {
      console.error("Error creating label version:", error);
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
                  // console.log("labelinformation", version);
                }
                labelVersionAddition();
              });
              // console.log("labelinformation", upload);
            }
            uploadDocument();
          }
        );
        // console.log("labelinformation", label);
      } catch (error) {
        console.log(error);
      }
    };
if (selectedTab == 2) {
  updateLabelVersion();
}else{
   addLabelVersion();
}
   

    
    // if (editState) updateLabelVersion();
    // else addLabelVersion();
  }
  if (newType === 5 && !isCreateNewVersion && selectedTab == 2) {
    // debugger
      const hasFile = values.fileData;
    apiParams = {
      id: rowState.id,
      labelInfoId: rowState.lableInfoId,
      andaId: data.get("selectedAnda"),
      productId: data.get("selectedProduct"),
      pmCodeId: data.get("selectedPmCode"),
      labelTypeId: data.get("selectedLabelType"),
      customerId: data.get("selectedCustomer"),
      printer: values.printer,
      ndcNumber: data.get("ndcNumber"),
      jobNumber: data.get("jobNumber"),
      tabletCount: data.get("tabletCount"),
      proofNum: data.get("proofNum") || data.get("proofNumber") || "",
    //   implementationDate: values.implementationDate
    // ? formatToISOString(values.implementationDate)
    // : rowState?.implementationDate ? formatToISOString(rowState?.implementationDate) :null,
      implementationDate: values.implementationDate
    ? values.implementationDate
    : rowState?.implementationDate ? rowState?.implementationDate :null,
      color: values.color,
      // colorcode: values.colorcode,
      /////////
      versionNo: data.get("versionNumber")||"",
      foldSize: data.get("foldSize"),
      flatSize: data.get("flatSize"),
      ccf: data.get("ccf"),
      labelDescription: data.get("labelDescription") || values.labelDescription,
      fileData: values.fileData,
      fileName: data.get("fileName"),
      isFileInfoChanged: true,
      fileId: data.get("fileId") || values?.fileId  ? values?.fileId  :"-1",
      remarks: data.get("remarks"),
    };
// console.log("23232",apiParams);

    // const addLabelVersion = async () => {
    //   try {
    //     if (apiParams.fileName === "") {
    //       let version = await Services.LabelVersion.addLabelVersion(
    //         apiParams
    //       ).then((success) => {
    //         updateLabelsData(true);
    //       });
    //       console.log("labelinformation", version);
    //     } else {
    //       let upload: any = await Services.Document.uploadDocument(
    //         apiParams
    //       ).then((uploadResponse) => {
    //         async function labelVersionAddition() {
    //           const updatedParams = {
    //             ...apiParams,
    //             fileId: uploadResponse.data,
    //             fileData: null,
    //           };
    //           let version = await Services.LabelVersion.addLabelVersion(
    //             updatedParams
    //           ).then((success) => {
    //             updateLabelsData(true);
    //           });
    //           console.log("labelinformation", version);
    //         }
    //         labelVersionAddition();
    //       });
    //       console.log("labelinformation", upload);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
 
    const updateLabelVersion = async () => {
      // try {
      //   let label = await Services.Label.updateLabel(apiParams).then(
      //     (labelResponse) => {
      //       async function uploadDocument() {
      //         let upload: any = await Services.Document.updateDocument(
      //           apiParams
      //         ).then((uploadResponse) => {
      //           async function labelVersionAddition() {
      //             const updatedParams = {
      //               ...apiParams,
      //               id: rowState.id,
      //               labelInfoId: rowState.lableInfoId,
      //               fileId: values.fileId,
      //               fileData: null,
      //             };
      //             let version = await Services.LabelVersion.updateLabelVersion(
      //               updatedParams
      //             ).then((success) => {
      //               updateLabelsData(true);
      //             });
      //             console.log("labelinformation", version);
      //           }
      //           labelVersionAddition();
      //         });
      //         console.log("labelinformation", upload);
      //       }
      //       uploadDocument();
      //     }
      //   );
      //   console.log("labelinformation", label);
      // } catch (error) {
      //   console.log(error);
      // }
          try {
      // if file present  upload
      
      if (hasFile[0]) {
         const uploadResponse = await Services.Document.uploadDocument(apiParams);
        //  console.log("uploadResponse",uploadResponse);
        //  debugger
      const updatedParams = {
        ...apiParams,
        fileId: uploadResponse.data[0],
        fileData: null,
      };

      const version = await Services.LabelVersion.updateLabelVersion(updatedParams);
      updateLabelsData(true);
      // console.log("Label version created (with file)", version);
      }else{
         // no file upload
        const version = await Services.LabelVersion.updateLabelVersion(apiParams);
        updateLabelsData(true);
        // console.log("Label version created (no file)", version);
        return;
      }
    } catch (error) {
      console.error("Error creating label version:", error);
    }
    };

  updateLabelVersion();

  }
  if (isChangeColor) {
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
    //   implementationDate: values.implementationDate
    // ? new Date(values.implementationDate).toISOString()
    // : null,
      implementationDate: values.implementationDate
    ? values.implementationDate
    : null,
      color: values.color,
      colorcode: values.colorcode,
      /////////
      versionNo: data.get("versionNumber")||"",
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

    const updateLabelVersionColorCode = async () => {
      // debugger
      try {
        const updatedParams = {
          ...apiParams,
          // id: rowState.id,
          id: rowState.currentVersionId,
          colorCode: rowState?.colorCode
        };
        let response = await Services.LabelVersion.updateLabelVersionColorCode(updatedParams).then((success) => {
          // updateMasterData(true);
          triggerUpdateMasterData()
          setLabelversionAPiCall(true);
        });
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    updateLabelVersionColorCode();
    
    // if (editState) updateLabelVersion();
    // else addLabelVersion();
  }

  //label version
  if (newType === 6 && isCreateNewVersion) {
    apiParams = {
      versionNo: data.get("versionNumber") || "",
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
            // console.log(response1);
          }
          labelVersionAddition();
        });
        // console.log(response);
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
        // console.log(response);
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
        
        // console.log(response);
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
