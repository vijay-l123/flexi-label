import { BorderColorOutlined, ClearAll, Save } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
import useUserAuthContext from "../../Context/UserAuthContext";
import Controls from "../../Controls/Controls";
import DisplayGrid from "../../Controls/DisplayGrid";
import withPaperLayout from "../../HOC/withPaperLayout";
import withUser from "../../HOC/WithUser";
import { useFormValidation } from "../../hooks/useFormValidation";
import Services from "../../Services/Services";
import CustomTheme from "../../Theme/CustomTheme";
import common from "../../utils/common";

const { isValidEmail, isValidPassword, roles } = common;

const initialFValues = {
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  selectedRole: "",
  roleName: "",
  isActive: true,
};

function User(): JSX.Element {
  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("firstName" in fieldValues) {
      temp.firstName = fieldValues.firstName
        ? false
        : "First Name is required.";
    }
    if ("lastName" in fieldValues) {
      temp.lastName = fieldValues.lastName ? false : "Last Name is required.";
    }
    if ("userName" in fieldValues) {
      // temp.userName = fieldValues.userName
      //   ? isValidEmail(fieldValues.userName)
      //     ? "Enter Valid User Name."
      //     : false
      //   : "User Name is required.";
      temp.userName = fieldValues.userName ? false : "User Name is required.";
    }

    if ("password" in fieldValues) {
      temp.password = fieldValues.password ? false : "Password is required.";
    }
    if ("selectedRole" in fieldValues) {
      temp.selectedRole = fieldValues.selectedRole ? false : "Select Role.";
    }

    setErrors((prevState: any) => ({
      ...prevState,
      ...temp,
    }));

    //if (fieldValues == values) return Object.values(temp).every((x) => x == false);

    return Object.values(temp).every((x) => x === false);
  };

  const { gridData, updateUsersData } = useUserAuthContext();
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetValidationState,
  } = useFormValidation(initialFValues, true, validate);

  const [isUpdate, setUpdateflag] = React.useState<boolean>(false);

  function updateUserData(params: any) {
    setUpdateflag(true);
    console.log("ngx-edituserparams", params);
    setValues((prevState: any) => ({
      ...prevState,
      firstName: params.row.firstName,
      lastName: params.row.lastName,
      userName: params.row.logInName,
      password: params.row.password,
      selectedRole: params.row.roleId,
      roleName: params.row.role,
      isActive: params.row.isActive,
      userId: params.row.userId,
    }));
  }

  const gridProps = {
    colDefs: [
      {
        field: "edit",
        headerName: "Edit User",
        type: "edit",
        headerClassName: "super-app-theme--header",
        cellClassName: "super-app-theme--cell",
        maxWidth: 200,
        renderCell: (params: any) => {
          const id = +params.row.id;

          return (
            <React.Fragment>
              <>
                <Controls.IconButton
                  value={id}
                  aria-label="close"
                  onClick={(e: any) => {
                    console.log("event", e);
                    updateUserData(params);
                  }}
                  sx={{ color: CustomTheme.CustomColor.Primary }}
                >
                  <BorderColorOutlined />
                </Controls.IconButton>
              </>
            </React.Fragment>
          );
        },

        // getActions: (params: any) => [
        //   <GridActionsCellItem
        //     showInMenu
        //     icon={<BorderColorOutlinedIcon />}
        //     label="Edit"
        //     onClick={() => {
        //       console.log("popupdata", params);
        //       modalState(true);
        //       rowState(params.row);
        //       editState(true);
        //     }}
        //   />,
        // ],
      },
      ...gridData.colDefs,
    ],
    rowData: gridData.rowData,
  };
  console.log("====gridprops", gridProps);

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const currKeys = [...new FormData(event.currentTarget).keys()];

    const temp: any[] = [];

    currKeys.forEach((key) => {
      temp.push({ [key]: data.get(key) });
    });

    const isValid: any[] = [];
    temp.forEach((target: any) => {
      isValid.push(validate(target));
    });
    if (isValid.every((i) => i === true)) {
      const addUser = async () => {
        try {
          const apiParams: any = {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            logIn: data.get("userName"),
            password: data.get("password"),
            roleId: data.get("selectedRole"),
            userId: 0,
            roleName: roles.find(
              (i) => i.value === Number(data.get("selectedRole"))
            )?.name,
            isActive: data.get("isActive") === "true" ? true : false,
          };
          let response;
          if (isUpdate) {
            const updateApiParams = {
              ...apiParams,
              userId: values?.userId,
            };
            response = await Services.User.updateUser(updateApiParams).then(
              (success) => {
                console.log("updateusertriggered");
                updateUsersData(true);
              }
            );
          } else {
            response = await Services.User.addUser(apiParams).then(
              (success) => {
                console.log("updateusertriggered");
                updateUsersData(true);
              }
            );
          }
          setUpdateflag(false);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      addUser();
    }
  }

  function handleReset() {
    setUpdateflag(false);
    resetValidationState();
  }

  return (
    <div>
      <Box
        noValidate
        component="form"
        onSubmit={handleSave}
        id="userForm"
        sx={{
          height: "100%",
          width: "100%",
          py: "0.5rem",
          boxShadow: 6,
          border: 1,
          borderColor: CustomTheme.CustomColor.Primary.light,
          "& .super-app-theme--header": {
            backgroundColor: CustomTheme.CustomColor.Primary.main,
            color: CustomTheme.CustomColor.Common.white,
            "& .MuiSvgIcon-root": {
              color: CustomTheme.CustomColor.Common.white,
            },
          },
        }}
      >
        <Grid container spacing={0} sx={{ paddingLeft: "30px" }}>
          <Grid item md={10}>
            <Grid container>
              <Grid item md={4}>
                <FormControl
                  required
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <FormLabel
                    sx={{
                      //color: "#212B36",
                      width: "30%",
                    }}
                  >
                    {" "}
                    First Name:
                  </FormLabel>
                  <Controls.Input
                    required
                    name="firstName"
                    label="First Name"
                    type="text"
                    size="small"
                    value={values.firstName}
                    error={errors.firstName}
                    onChange={handleInputChange}
                  ></Controls.Input>
                </FormControl>
                <FormControl
                  required
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <FormLabel
                    sx={{
                      //color: "#212B36",
                      width: "30%",
                    }}
                  >
                    {" "}
                    Last Name:
                  </FormLabel>
                  <Controls.Input
                    required
                    name="lastName"
                    label="Last Name"
                    type="text"
                    size="small"
                    value={values.lastName}
                    error={errors.lastName}
                    onChange={handleInputChange}
                  ></Controls.Input>
                </FormControl>
                <FormControl
                  required
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <FormLabel
                    sx={{
                      //color: "#212B36",
                      width: "30%",
                    }}
                  >
                    {" "}
                    User Name:
                  </FormLabel>
                  <Controls.Input
                    required
                    name="userName"
                    label="User Name"
                    type="text"
                    size="small"
                    value={values.userName}
                    error={errors.userName}
                    onChange={handleInputChange}
                  ></Controls.Input>
                </FormControl>
                <FormControl
                  required
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <FormLabel
                    sx={{
                      //color: "#212B36",
                      width: "30%",
                    }}
                  >
                    {" "}
                    Passord:
                  </FormLabel>
                  <Controls.Input
                    required
                    name="password"
                    label="Password"
                    type="password"
                    size="small"
                    value={values.password}
                    error={errors.password}
                    onChange={handleInputChange}
                  ></Controls.Input>
                </FormControl>
              </Grid>
              <Grid item md={6}>
                <FormControl
                  required
                  fullWidth
                  variant="filled"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <FormLabel
                    sx={{
                      //color: "#212B36",
                      width: "20%",
                    }}
                  >
                    Role:
                  </FormLabel>
                  <Select
                    sx={{
                      width: "40%",
                    }}
                    required
                    displayEmpty
                    size="small"
                    variant="outlined"
                    labelId="select-role"
                    id="selectRole"
                    name="selectedRole"
                    value={values.selectedRole || ""}
                    error={
                      errors.selectedRole && errors.selectedRole.length > 0
                    }
                    onChange={handleInputChange}
                    //onChange={handleTypeChange}

                    // error={formValues.roles.error}
                  >
                    {roles.map((role, index) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {errors.selectedRole && errors.selectedRole}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  required
                  variant="filled"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <FormLabel
                    sx={{
                      //color: "#212B36",
                      width: "20%",
                    }}
                  >
                    IsActive:
                  </FormLabel>
                  <Controls.Checkbox //TODO BUG ONCHANGE
                    name="isActive"
                    isChecked={values.isActive || true}
                  ></Controls.Checkbox>
                </FormControl>
                <Box>
                  <Controls.Button
                    sx={{ mx: 2 }}
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<ClearAll></ClearAll>}
                  >
                    Reset
                  </Controls.Button>

                  <Controls.Button
                    sx={{ mx: 2 }}
                    type="submit"
                    variant="contained"
                    form="userForm"
                    startIcon={<Save></Save>}
                  >
                    {isUpdate ? "Update" : "Save"}
                  </Controls.Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            md={10}
            sx={{
              display: "flex",
              displayDirection: "row",
              justifyContent: "center",
            }}
          ></Grid>
        </Grid>
        <Box height={"45vh"}>
          <DisplayGrid {...gridProps} />
        </Box>
      </Box>
    </div>
  );
}

const paperLayoutProfileProps = {
  paperHeight: "85vh",
  boxHeight: "70vh",
};

export default withPaperLayout(withUser(User), paperLayoutProfileProps);
