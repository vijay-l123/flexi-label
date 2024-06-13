import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Typography from "@mui/material/Typography";

import bgIcon from "../../Images/newbg.png";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useNavigate } from "react-router-dom";
import { FormHelperText } from "@mui/material";
import Controls from "../../Controls/Controls";
import useAuthContext from "../../Authentication/AuthProvider";
import common from "../../utils/common";
import logo from "../../Images/flexielabel-logo.png";
import { ReactComponent as LoginSvg } from "../../Images/login.svg";
import { ReactComponent as FlexiLoginLogo } from "../../Images/flexiloginlogo.svg";

const { roles } = common;

interface navProps {
  setNav: any;
}

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {`Copyright © ${new Date().getFullYear()} Flexi-elabel. Powered by 3SSolutions`}
    </Typography>
  );
}

function isValidEmail(val: string) {
  // let regEmail =
  //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // if (!regEmail.test(val)) {
  //   return true;
  // }
  // return false;
  return val.length === 0;
}

function isValidPassword(val: string) {
  return val.length === 0;
}

function isValidRoles(val: string) {
  return val.length === 0;
}

interface formParams {
  name: string;
  value: string;
}

interface IKeyMapping {
  [propertyName: string]: {
    value: string;
    error: string;
  };
}

function SignInSide() {
  const { login } = useAuthContext();

  const [formValues, setFormValues] = React.useState<IKeyMapping>({
    email: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
    roles: {
      value: "",
      error: "",
    },
  });

  const navigate = useNavigate();

  function checkErrorValidation(params: formParams) {
    const { name, value } = params;

    if (name === "email")
      return {
        error: isValidEmail(value) ? "You must enter username" : "",
      };
    if (name === "password")
      return {
        error: isValidPassword(value) ? "You must enter a password" : "",
      };
    // if (name === "roles")
    //   return { error: isValidRoles(value) ? "You must select roles" : "" };
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      email: data.get("email"),
      password: data.get("password"),
      roles: data.get("roles"),
    });

    const formData = [
      {
        target: {
          name: "email",
          value: data.get("email") as string,
        },
      },
      {
        target: {
          name: "password",
          value: data.get("password") as string,
        },
      },
      // {
      //   target: {
      //     name: "roles",
      //     value: data.get("roles") as string,
      //   },
      // },
    ];

    let temp = JSON.parse(JSON.stringify(formValues));

    formData.map((item) => {
      const { name, value } = item.target;

      const updatedValues = {
        ...temp,
        [name]: {
          ...formValues[name],
          value,
          ...checkErrorValidation(item.target),
        },
      };
      temp = updatedValues;
    });

    setFormValues(temp);

    let hasError = false;

    Object.values(temp).forEach((item: any) => {
      if (item.error) hasError = item.error;
    });

    if (!hasError) {
      const inputParams = {
        userName: data.get("email") as string,
        password: data.get("password") as string,
        // roleId: data.get("roles") as string,
      };

      login(inputParams);

      // const response = await AuthService.authenticate(inputParams);
      // console.log(response);
      // const {
      //   authToken: token,
      //   logIn: user,
      //   name: userName,
      //   token_ID: tokenId,
      //   user_Id: userId,
      //   validTo,
      // } = response.data;
      // setAuth({ token, user, userName, tokenId, userId, validTo });
      // props.setNav(true);
      // navigate("/dashboard");
    }
  };

  const handleTextChange = (e: any) => {
    let temp = JSON.parse(JSON.stringify(formValues));

    const { name, value } = e.target;

    const updatedValues = {
      ...temp,
      [name]: {
        ...formValues[name],
        value,
        ...checkErrorValidation(e.target),
      },
    };
    temp = updatedValues;

    setFormValues(temp);
    console.log("handletext", temp);
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
      }}
    >
      <CssBaseline />
      <Grid item xs={6}>
        <div className="loginImg">
          <LoginSvg />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="loginScreen">
          <div className="loginContent">
            <div className="loginLogo">
              <FlexiLoginLogo />
            </div>
            <div className="loginAccount">
              Login your account
              <div className="stripLine" style={{ width: "50%" }}></div>
            </div>

            <Box
              noValidate
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <Controls.Input
                autoFocus
                required
                fullWidth
                margin="normal"
                id="email"
                label="Enter Username"
                name="email"
                autoComplete="email"
                value={formValues.email.value}
                onChange={handleTextChange}
                error={formValues.email.error}
              ></Controls.Input>
              <Controls.Input
                required
                fullWidth
                margin="normal"
                name="password"
                label="Enter Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formValues.password.value}
                onChange={handleTextChange}
                error={formValues.password.error}
              />
              {/* <Box>
              <FormControl
                required
                fullWidth
                variant="filled"
                sx={{
                  mt: 1,
                  mb: 1,
                }}
              >
                <InputLabel id="select-roles-input">Roles</InputLabel>
                <Select
                  required
                  fullWidth
                  labelId="select-roles-label"
                  id="select-roles"
                  value={formValues.roles.value}
                  label="Roles"
                  name="roles"
                  onChange={handleTextChange}
                  error={
                    formValues.roles.error && formValues.roles.error.length > 0
                      ? true
                      : false
                  }
                >
                  {roles.map((role, index) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: "#D32F2F" }}>
                  {formValues.roles.error && formValues.roles.error.length > 0
                    ? formValues.roles.error
                    : ""}
                </FormHelperText>
              </FormControl>
            </Box> */}
              {/* <FormControlLabel
              control={<Controls.Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}

              <Controls.Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
                endIcon={<LoginOutlinedIcon></LoginOutlinedIcon>}
              >
                Login
              </Controls.Button>
              {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
            </Box>
          </div>
          <div className="loginBottom">
            <div className="stripLine" style={{ width: "100%" }}></div>
            <Copyright sx={{ mt: 2, mb: 2 }} />
          </div>
        </div>
      </Grid>
      {/* <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bgIcon})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={logo}
          style={{ marginLeft: "20px", marginTop: "10px", maxWidth: "100px" }}
          alt="FlexiELabel"
        ></img>
      </Box> */}
    </Grid>
  );
}

const Login = SignInSide;

export default Login;
