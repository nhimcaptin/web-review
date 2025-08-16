import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MenuItem, MenuList, Typography } from "@mui/material";

interface MenuListActionsProps {
  actionEdit?: (param: any) => void | undefined;
  actionView?: (param: any) => void | undefined;
  actionDelete?: (param: any) => void | undefined;
}

const MenuListActions = (props: MenuListActionsProps) => {
  const { actionView, actionEdit, actionDelete } = props;

  const listOptions = [
    {
      icon: <VisibilityIcon className="icon-view" />,
      label: "View",
      action: actionView,
    },
    {
      icon: <EditIcon className="icon-edit" />,
      label: "Edit",
      action: actionEdit,
    },
    {
      icon: <DeleteForeverIcon style={{ color: "red" }} className="icon-delete" />,
      label: "Delete",
      action: actionDelete,
    },
  ];

  return (
    <MenuList>
      {listOptions.map((option, xIndex) => {
        // eslint-disable-next-line array-callback-return
        if (!option.action) return;
        return (
          <MenuItem onClick={option.action} key={xIndex}>
            {option.icon}
            <Typography marginLeft={2} variant="inherit">
              {option.label}
            </Typography>
          </MenuItem>
        );
      })}
    </MenuList>
  );
};

export default MenuListActions;
