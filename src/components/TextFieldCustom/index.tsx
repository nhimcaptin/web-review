import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  textField: {
    "& label.MuiInputLabel-root": {
      fontSize: "14px",
    },
    "& textarea": {
      fontSize: "14px",
    },
    "& input": {
      fontSize: "14px",
    },
    "& div.Mui-disabled": {
      backgroundColor: "#E7E7E7",
      "& .MuiAutocomplete-endAdornment": {
        display: "none",
      },
    },
  },
}));
const TextFieldCustom = (props: any) => {
  const classes = useStyles();
  return (
    <>
      <TextField {...props} className={classes.textField} size="small" fullWidth />
    </>
  );
};

export default TextFieldCustom;
