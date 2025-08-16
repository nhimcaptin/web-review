import { Box, Checkbox, CheckboxProps } from "@mui/material";
import React from "react";

const CheckboxCustom = (props: CheckboxProps) => {
  return (
    <Checkbox
      sx={{
        padding: 0,
        ".MuiBox-root": {
          padding: "0px !important",
        },
      }}
      icon={
        <Box
          width="22px"
          height="22px"
          border="1px solid #cbd2d9"
          borderRadius="6px"
        />
      }
      checkedIcon={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="22px"
          height="22px"
          border="1px solid #cbd2d9"
          borderRadius="6px"
        >
          <Box
            sx={{
              width: "16px",
              height: "16px",
              maskImage:
                "url(https://static.xx.fbcdn.net/rsrc.php/v4/yH/r/4uSWT7f8xsz.png?_nc_eui2=AeELvwE_1Snrp73cViBoS83cZgSDTUs6p0pmBINNSzqnSv1j1jdZzkvYLXi_Ea3MoGImH_NFt_jw3pkEBK6PBg9j)",
              maskPosition: "0px -501px",
              background: "#0a78be",
            }}
          />
        </Box>
      }
      {...props}
    />
  );
};

export default CheckboxCustom;
