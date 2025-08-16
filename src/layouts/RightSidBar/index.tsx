import { Box } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface RightSideBarProps {
  onToggleChart?: (type: string | null) => void;
  // type is  "normal" | "view" | "edit-adset" | "edit-ads"
  type?: string | null;
}

const RightSideBar = (props: RightSideBarProps) => {
  const navigate = useNavigate();
  const { onToggleChart, type = "normal" } = props;

  return (
    <div
      className={`right-side-bar ${
        type === "normal" ? "side-position-right" : ""
      }`}
    >
      <div className="right-sidebar-wrapper">
        {type !== "normal" && (
          <div
            className="menu-right-btn active-btn"
            onClick={() => onToggleChart && onToggleChart(null)}
          >
            <Box
              sx={{
                width: "16px",
                height: "16px",
                maskImage:
                  "url(https://static.xx.fbcdn.net/rsrc.php/v4/yY/r/pt0Lj1ecKyx.png?_nc_eui2=AeHwLCkNWNzZw2myX1Ar3-UtTSDsP7I53qBNIOw_sjneoK62_kNzbQZn0RM3q25Yj0-I_NzTEoKD2z5ntzVlZ4Ed)",
                maskPosition: "-289px -346px",
                maskSize: "441px 397px",
                background: "white",
              }}
            />
          </div>
        )}
        <div
          className={`menu-right-btn ${type === "view" && "active-btn"}`}
          onClick={() => onToggleChart && onToggleChart("view")}
        >
          {type === "view" ? (
            <Box
              sx={{
                width: "16px",
                height: "16px",
                maskImage:
                  "url(https://static.xx.fbcdn.net/rsrc.php/v4/yX/r/g5YqKLnlk1k.png?_nc_eui2=AeEwdYSi3g4KRA4ui8bBmD07hTGvHeFfVfyFMa8d4V9V_P6AOHlufRpsSsd_y-uRX7KJP33NUCFXlHSS61xHi-uc)",
                maskPosition: "-411px -325px",
                maskSize: "441px 397px",
                background: "white",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "16px",
                height: "16px",
                maskImage:
                  "url(https://static.xx.fbcdn.net/rsrc.php/v4/yH/r/4uSWT7f8xsz.png?_nc_eui2=AeELvwE_1Snrp73cViBoS83cZgSDTUs6p0pmBINNSzqnSv1j1jdZzkvYLXi_Ea3MoGImH_NFt_jw3pkEBK6PBg9j)",
                maskPosition: "0px -416px",
                background: type !== "normal" ? "white" : "#ffffff99",
              }}
            />
          )}
        </div>
        <div
          onClick={() => onToggleChart && onToggleChart("edit-adset")}
          className={`menu-right-btn ${
            type && ["edit-adset", "edit-ads"].includes(type) && "active-btn"
          }`}
        >
          {type && ["edit-adset", "edit-ads"].includes(type) ? (
            <Box
              sx={{
                width: "16px",
                height: "16px",
                maskImage:
                  "url(https://static.xx.fbcdn.net/rsrc.php/v4/yH/r/4uSWT7f8xsz.png?_nc_eui2=AeELvwE_1Snrp73cViBoS83cZgSDTUs6p0pmBINNSzqnSv1j1jdZzkvYLXi_Ea3MoGImH_NFt_jw3pkEBK6PBg9j)",
                maskPosition: "0px -807px",
                background: "white",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "16px",
                height: "16px",
                maskImage:
                  "url(https://static.xx.fbcdn.net/rsrc.php/v4/yl/r/_tluDGOtAlV.png?_nc_eui2=AeFWQe1bHi04-awbDGavvrLYjXcSO7ekFu2NdxI7t6QW7RbiaBOA0xM5n7Af6QrZZmVqRWlC35ipB2hgp3IC3Tyb)",
                maskPosition: "0px -841px",
                maskSize: "25px 1271px",
                background: type !== "normal" ? "white" : "#ffffff99",
              }}
            />
          )}
        </div>
        <div className="menu-right-btn">
          <Box
            sx={{
              width: "16px",
              height: "16px",
              maskImage:
                "url(https://static.xx.fbcdn.net/rsrc.php/v4/yA/r/2M_0CXhP5Bo.png?_nc_eui2=AeHiDmTsbWD5rqhVcmGmb5aEkO_Mln0pzxiQ78yWfSnPGJmTcChrNjR9FK35n4aNK5wSDmoY8GN8WZyVpMp95-Vp)",
              maskPosition: "-21px -194px",
              maskSize: "41px 489px",
              background: type !== "normal" ? "white" : "#ffffff99",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
