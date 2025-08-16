import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SelectCustom = (props: any) => {
  const { name, options, ...rest } = props;
  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel id={`${name}-small-label`}>{name}</InputLabel>
      <Select {...rest} labelId={`${name}-small-label`} id="demo-select-small" label={name}>
        {options.map((option: any) => {
          return <MenuItem value={option.value}>{option.label}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default SelectCustom;
