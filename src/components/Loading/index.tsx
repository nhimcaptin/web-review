import useStoreLoading from "@/stores/loadingStore";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingScreen = () => {
  const isLoading = useStoreLoading((state) => state.loading);

  return (
    <Backdrop
      transitionDuration={0}
      sx={{
        color: "#ffffff",
        zIndex: (theme) => theme.zIndex.drawer + 10000,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingScreen;
