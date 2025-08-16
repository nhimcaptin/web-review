import Radio from "@mui/material/Radio";
import { Box } from "@mui/material";

const OuterCircle = ({ checked }: { checked: boolean }) => (
  <Box
    sx={{
      width: 22,
      height: 22,
      borderRadius: "50%",
      border: "1px solid",
      borderColor: "rgb(218, 221, 225)",
      backgroundColor: "transparent",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {checked && (
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "rgb(61, 145, 255)",
        }}
      />
    )}
  </Box>
);

export default function CustomRadio({ checked }: { checked: boolean }) {
  return (
    <Radio
      icon={<OuterCircle checked={false} />}
      checkedIcon={<OuterCircle checked={true} />}
      checked={checked}
      sx={{ padding: 0 }}
    />
  );
}
