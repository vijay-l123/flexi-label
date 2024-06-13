import {
  blue,
  green,
  deepOrange,
  indigo,
  lightGreen,
  orange,
  red,
} from "@mui/material/colors";
import * as React from "react";

const CustomColor = {
  Common: {
    black: "#000000",
    white: "#ffffff",
    textblue: "#13A7C8",
  },
  Indigo: {
    main: indigo.A200,
    light: indigo.A100,
    dark: indigo.A400,
  },
  Green: {
    main: green.A200,
    light: green.A100,
    dark: green.A400,
    darker: green.A700,
  },
  DeepOrange: {
    main: deepOrange.A200,
    light: deepOrange.A100,
    dark: deepOrange.A400,
  },
  Primary: {
    //seablue
    // main: "#2460a7",
    // light: "#5f8dd9",
    // dark: "#003777",
    //flexilab
    // main: "#0f297f",
    // light: "#4d51af",
    // dark: "#000152",

    //slategrey
    // main: "#6e8898",
    // light: "#9db8c9",
    // dark: "#000152",
    //slatepurple
    // main: "#603f83",
    // light: "#331656",
    // dark: "#8f6bb3",
    //purple
    // main: "#673ab7",
    // light: "#9a67ea",
    // dark: "#320b86",
    //custom navy --1
    //  main: "#1C3879",
    //  light: "#607EAA",
    //  dark: "#00144c",
    //custom blue ---2
    main: "#30A7CD", //#112f92",
    light: "#F2FBFE", //#5358c3",
    dark: "#178EB4", //"#000b63",
    //custom purple
    // main: "#7371fc", //"#1C3879",
    // light: "#aaa0ff", //"#607EAA",
    // dark: "#3646c8", //"#00144c",
    //custom darkblue
    // main: "#1f487e",
    // light: "#5373ae",
    // dark: "#002151",
    contrastText: "#ffffff",
  },
  Secondary: {
    main: "#ef5b0c",
    light: "#ff8c41",
    dark: "#b52700",
    contrastText: "#ffffff",
  },
  Error: {
    main: "#D32F2F",
    light: "#D32F2F",
    dark: "#D32F2F",
    contrastText: "#FFFFFF",
  },
  Tab: {
    bgColor: "#F2FBFE", //#DCE1E3", //"#f4d8ae", //#DCE1E3  #f4d8ae #5C5F58 #DADED4 #D32F2F  ffd6af
    indBgColor: "#30A7CD", //"#EF5B0C", //"#D32F2F",
  },
  Alert: {
    success: lightGreen[200],
    error: red[200],
    warning: orange[200],
    info: blue[200],
  },
  Site: {
    bgColor: "#F9F9F9", //"#f2f6fc",
    lbText: "#F6AE84",
    lbAdminText: "#fafafa",
  },
};

//HOVER TEXT COLOR
//color: "#212B36",

const CustomTheme = {
  CustomColor,
};

export default CustomTheme;
