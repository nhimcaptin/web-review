import { Tooltip, TooltipProps } from "@mui/material";

const TooltipCustom = ({
  children,
  title,
  placement = "bottom-start",
  ...rest
}: TooltipProps) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      slotProps={{
        tooltip: {
          sx: {
            marginTop: "4px !important",
            marginBottom: "4px !important",
            backgroundColor: "white",
            color: "#1c2b33",
            fontSize: "14px",
            lineHeight: "20px",
            borderRadius: "4px",
            padding: "8px 12px",
            maxWidth: "336px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 2px 12px 2px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
          },
        },
      }}
      {...rest}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipCustom;
