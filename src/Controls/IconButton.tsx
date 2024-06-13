import { IconButton as MuiIconButton } from "@mui/material";

export default function IconButton(props: any) {
  const { onClick, children, ...other } = props;
  return (
    <MuiIconButton aria-label="aria-iconbutton" onClick={onClick} {...other}>
      {children}
    </MuiIconButton>
  );
}
