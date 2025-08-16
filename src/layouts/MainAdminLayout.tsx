import React from "react";

import LoadingScreen from "@/components/Loading";
import useStoreLoading from "@/stores/loadingStore";
import { makeStyles } from "@mui/styles";
import ROUTERS_PATHS from "@/constants/router-paths";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const useStyles = makeStyles({
  mainContainer: {
    marginTop: 0,
    marginLeft: 140,
    left: 0,
    position: "relative",
    transition: "all 0.3s ease-in-out",
    // padding: "8px 24px 16px 24px",
    background: "transparent",
  },
  paperContainer: {
    height: "100%",
    borderRadius: "unset !important",
    boxShadow: "unset !important",
    background: "transparent",
  },
});

interface MainAdminLayoutProps {
  children: React.ReactNode;
}

const MainAdminLayout = ({ children }: MainAdminLayoutProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isLoading = useStoreLoading((state) => state.loading);
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight - 0);

  const updateHeight = () => {
    setWindowHeight(window.innerHeight - 0);
  };

  React.useEffect(() => {
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  });

  return (
    <>
      
        <div className={classes.paperContainer}>{children}</div>
      <div className={classes.mainContainer} style={{ minHeight: windowHeight }}>
      </div>
      {isLoading && <LoadingScreen />}
    </>
  );
};

export default MainAdminLayout;
