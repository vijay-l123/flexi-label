import { Label } from "@mui/icons-material";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import {
  TextField,
  InputAdornment,
  Button,
  FormControl,
  Typography,
} from "@mui/material";
import React, { MutableRefObject } from "react";

export default function InputUpload(props: any) {
  const { name, label, value, onChange, error = null, ...other } = props;
  const inputRef = React.useRef() as MutableRefObject<HTMLInputElement>;

  const [actualFile, setActualFile] = React.useState<any>();

  const handleChange = (event: any) => {
    const files: any[] = Array.from(event.target.files);

    const [file] = files;
    // let r = new FileReader();
    // r.onload = function () {
    //   // alert(r.result);
    //   setActualFile(r.result);
    // };
    // r.readAsDataURL(file);

    setActualFile(file);

    //console.log(r);
    if (!!onChange) onChange({ target: { name: name, value: file } });
  };

  const getFileName = (text: string) => {
    if (!text || text === "") return "";

    let fileName = text + ".pdf";

    var fileNames = text;
    var leftRightStrings = fileNames.split(".");
    //file name
    var fName = leftRightStrings[0];
    //file extension
    var fExtention = leftRightStrings[1];
    var lengthFname = fName.length;
    //if file name without extension contains more than 15 characters
    if (lengthFname > 15) {
      fileName =
        fName.slice(0, 10) + "..." + fName.slice(-5) + "." + fExtention;
    }

    return fileName;
  };

  return (
    <>
      <FormControl>
        <TextField
          sx={{ maxWidth: "75%" }}
          disabled
          id="filetype"
          label={label}
          name="filetype"
          {...(error && { error: true, helperText: error })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Button
                  component="label"
                  variant="contained"
                  endIcon={<UploadRoundedIcon />}
                  {...other}
                >
                  Upload
                  <input
                    width="0px !important"
                    name={name}
                    ref={inputRef}
                    id="filetype"
                    accept=".pdf"
                    type="file"
                    hidden
                    onChange={handleChange}
                  />
                </Button>
                <Typography>{getFileName(value?.name)}</Typography>
                {/* <IconButton
                color="primary"
                aria-label="upload files"
                component="label"
                htmlFor="filetype"
              >
                <input
                  ref={inputRef}
                  id="filetype"
                  accept=".pdf"
                  type="file"
                  hidden
                  onChange={handleChange}
                />
                <UploadRoundedIcon />
              </IconButton> */}
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      {/* <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          /> */}
    </>
  );
}
