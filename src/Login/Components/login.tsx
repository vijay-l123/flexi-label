import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Typography from "@mui/material/Typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import bgIcon from "../../Images/newbg.png";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useNavigate } from "react-router-dom";
import { FormHelperText, FormLabel, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
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
    // console.log("handletext", temp);
  };
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
      {/* <Grid item xs={6}>
        <div className="loginImg">
          <LoginSvg />
        </div>
      </Grid> */}
      <Grid
  item
  xs={false}
  sm={false}
  md={false}
  lg={6}
  sx={{
    display: { xs: "none", sm: "none", md: "none",lg: "block" }, 
  }}
>
  <div className="loginImg">
    <LoginSvg />
  </div>
</Grid>
    <Grid item xs={12} sm={12} md={12} lg={6}>
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
                    <FormControl variant="outlined" fullWidth required  error={!!formValues.password.error} >
  {/* <Grid container >
    <Grid item xs={12}> */}
      <OutlinedInput
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formValues.password?.value || ""}
        onChange={handleTextChange}
        
        required
        placeholder="Enter your password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        sx={{
          mt: 1,
          '& input::placeholder': {
            opacity: 0.7,
          },
        }}
      />
            {formValues.password.error && (
        <FormHelperText>{formValues.password.error}</FormHelperText>
      )}
    {/* </Grid>
  </Grid> */}
</FormControl>
              <Controls.Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
                endIcon={<LoginOutlinedIcon></LoginOutlinedIcon>}
              >
                Login
              </Controls.Button>
            </Box>
          </div>
          <div className="loginBottom">
            <div className="stripLine" style={{ width: "100%" }}></div>
            <Copyright sx={{ mt: 2, mb: 2 }} />
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

const Login = SignInSide;

export default Login;
