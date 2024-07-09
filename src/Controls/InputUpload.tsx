import { Description, Close } from "@mui/icons-material";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import {
  TextField,
  InputAdornment,
  Button,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import React, { MutableRefObject } from "react";

export default function InputUpload(props: any) {
  const { name, label, value, onChange, error = null, ...other } = props;
  const inputRef = React.useRef() as MutableRefObject<HTMLInputElement>;

  const [actualFiles, setActualFiles] = React.useState<any[]>([]);

  const handleChange = (event: any) => {
    const files: File[] = Array.from(event.target.files);
    setActualFiles(files);

    if (!!onChange) onChange({ target: { name: name, value: files } });
  };

  const getFileNames = (files: File[]) => {
    if (!files || files.length === 0) return "";

    return files.map((file) => getFileName(file.name)).join(", ");
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

  const handleRemoveFile = (index: number) => {
    const updatedFiles = actualFiles.filter((_, i) => i !== index);
    setActualFiles(updatedFiles);

    if (!!onChange) onChange({ target: { name: name, value: updatedFiles } });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                    multiple // Allows multiple file selection
                    onChange={handleChange}
                  />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <List >
        {actualFiles.map((file, index) => (
          <Paper elevation={3} sx={{mt:1}}>
            <ListItem key={index} >
              <ListItemIcon>
                <Description fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={getFileName(file.name)} />
              <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                <Close fontSize="small" />
              </IconButton>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
}
