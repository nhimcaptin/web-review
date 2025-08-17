import React from "react";

import LoadingScreen from "@/components/Loading";
import useStoreLoading from "@/stores/loadingStore";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  mainContainer: {
    marginTop: 0,
    marginLeft: 56,
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
    padding: '0px 10px'
  },
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const classes = useStyles();
  const isLoading = useStoreLoading((state) => state.loading);

  return (
    <>
      <div className={classes.paperContainer}>{children}</div>
      {isLoading && <LoadingScreen />}
    </>
  );
};

export default MainLayout;
