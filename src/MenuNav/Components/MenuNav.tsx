import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListSubheader } from "@mui/material";
import { NavLink } from "react-router-dom";

// const FireNav = styled(List)<{ component?: React.ElementType }>({
//   "& .MuiListItemButton-root": {
//     paddingLeft: 24,
//     paddingRight: 24,
//   },
//   "& .MuiListItemIcon-root": {
//     minWidth: 0,
//     marginRight: 16,
//   },
//   "& .MuiSvgIcon-root": {
//     fontSize: 20,
//   },
// });

export default function MenuNav(props: any) {
  const { data, selectedNavItem, handleNavItemChanged } = props;

  return (
    <Box sx={{ minWidth: 200 }}>
      <Paper elevation={6}>
        <nav aria-label="main mailbox folders">
          <Box sx={{ px: 1 }}>
            <List
              component="nav"
              // subheader={
              //   <ListSubheader
              //     sx={{
              //       fontSize: "0.75rem",
              //       fontWeight: 600,
              //       color: "#212B36",
              //       textTransform: "uppercase",
              //     }}
              //     component="nav"
              //   >
              //     {subHeader.subHeader}
              //   </ListSubheader>
              // }
            >
              {data.map((item: any, index: any) => (
                <ListItem
                  disablePadding
                  key={item.id}
                  component={NavLink}
                  to={item.component}
                  selected={selectedNavItem === item.id}
                  onClick={(event: any) => handleNavItemChanged(event, item.id)}
                >
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "0.85rem",
                        fontWeight: 400,
                      }}
                    ></ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </nav>
      </Paper>
    </Box>
  );
}
