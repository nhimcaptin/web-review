import IconClose from "@/assets/close.svg";
import SelectCustom from "@/components/SelectCustom";
import TextFieldCustom from "@/components/TextFieldCustom";
import MESSAGE_API from "@/constants/message";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";
import { useLoading } from "@/stores/loadingStore";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ModalAdminAds = (props: any) => {
  const { showLoading, hideLoading } = useLoading();
  const { handleSubmit, control } = useForm<any>({
    defaultValues: props?.defaultValues
      ? {
          image: props?.defaultValues?.image || "",
          status: props?.defaultValues?.status || false,
          ad: props?.defaultValues?.ad || "",
          adSetName: props?.defaultValues?.adSetName || "",
          deliveryStatus: props?.defaultValues?.deliveryStatus || "",
          deliveryDescription: props?.defaultValues?.deliveryDescription || "",
          qualityRankingTitle: props?.defaultValues?.qualityRankingTitle || "",
          qualityRankingDescription: props?.defaultValues?.qualityRankingDescription || "",
          engagementRateRankingTitle: props?.defaultValues?.engagementRateRankingTitle || "",
          engagementRateRankingDescription: props?.defaultValues?.engagementRateRankingDescription || "",
          conversionRateRankingTitle: props?.defaultValues?.conversionRateRankingTitle || "",
          conversionRateRankingDescription: props?.defaultValues?.conversionRateRankingDescription || "",
          ad_set_id: props?.defaultValues?.ad_set_id || "",
        }
      : {
          image: "",
          status: false,
          ad: "",
          adSetName: "",
          deliveryStatus: "",
          deliveryDescription: "",
          qualityRankingTitle: "",
          qualityRankingDescription: "",
          engagementRateRankingTitle: "",
          engagementRateRankingDescription: "",
          conversionRateRankingTitle: "",
          conversionRateRankingDescription: "",
        },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: any) => {
    try {
      showLoading();
      let imageUrlDelete = "";
      if (data.image !== props?.defaultValues?.image && !!props?.defaultValues?.image) {
        imageUrlDelete = props?.defaultValues?.image;
      }
      if (data.image && data.image !== props?.defaultValues?.image) {
        const formData = new FormData();
        formData.append("image", data.image);
        try {
          const uploadResponse = await axiosInstance.post(URL_PATHS.UPLOAD_IMAGE, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (uploadResponse?.status !== 200) {
            toast.error(MESSAGE_API.errorApi, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
            return;
          }
          data.image = uploadResponse?.data?.filename;
        } catch (error) {
          toast.error(MESSAGE_API.errorApi, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          return;
        }
      }
      const dataAdSet = props.dataAdSets.find((item: any) => item?.id === data?.ad_set_id);
      const lastSignificantEdit = dataAdSet?.lastSignificantEdit
        ? moment(new Date(dataAdSet?.lastSignificantEdit)).format("YYYY/MM/DD")
        : null;
      const endsDate = dataAdSet?.endsDate ? moment(new Date(dataAdSet?.endsDate)).format("YYYY/MM/DD") : null;
      const dataSubmit = {
        bidStrategyCost: dataAdSet?.bidStrategyCost || "",
        bidStrategyDescription: dataAdSet?.bidStrategyDescription || "",
        lastSignificantEdit,
        endsDate,
        budgetCost: dataAdSet?.budgetCost || "",
        budgetDescription: dataAdSet?.budgetDescription || "",
        attributionSetting: dataAdSet?.attributionSetting || "",
        resultsCost: dataAdSet?.resultsCost || "",
        resultsDescription: dataAdSet?.resultsDescription || "",
        reach: dataAdSet?.reach || "",
        impressions: dataAdSet?.impressions || "",
        costPerResultCost: dataAdSet?.costPerResultCost || "",
        costPerResultDescription: dataAdSet?.costPerResultDescription || "",
        amountSpent: dataAdSet?.amountSpent || "",
        endsOngoing: dataAdSet?.endsOngoing || false,
        ...data,
        adSetName: dataAdSet?.adSet,
      };
      const response: any = props?.defaultValues
        ? await axiosInstance.put(URL_PATHS.UPDATE_AD.replace(":id", props?.defaultValues?.id), dataSubmit)
        : await axiosInstance.post(URL_PATHS.CREATE_AD, dataSubmit);

      if (imageUrlDelete) {
        try {
          await axiosInstance.delete(URL_PATHS.DELETE_IMAGE.replace(":filename", imageUrlDelete));
        } catch (error) {}
      }

      if (response?.status === 200) {
        await props.getList();
        toast.success(props?.defaultValues ? MESSAGE_API.updateSuccessAds : MESSAGE_API.createSuccessAds, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        props.handleClose();
      } else {
        toast.error(MESSAGE_API.errorApi, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error(MESSAGE_API.errorApi, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <BootstrapDialog
      maxWidth="md"
      fullWidth
      onClose={props.handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {props?.isView ? "View" : props?.defaultValues ? "Edit" : "Add New"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={props.handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <img
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
            onClick={props.handleClose}
            src={IconClose}
            alt=""
          />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2} style={{ marginTop: 15 }}>
            <Grid size={5.5}>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <div>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="image-upload"
                      type="file"
                      disabled={props?.isView}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                    />
                    <label htmlFor="image-upload">
                      <Button variant="contained" component="span" disabled={props?.isView}>
                        Upload Image
                      </Button>
                    </label>
                    {value && (
                      <div style={{ marginTop: 15, height: "100px", width: "100px", position: "relative" }}>
                        <img
                          src={
                            typeof value === "string"
                              ? import.meta.env.VITE_BASE_FOLDER + value
                              : URL.createObjectURL(value)
                          }
                          alt="Preview"
                          style={{ height: "100px", width: "100px", objectFit: "cover" }}
                        />
                        <IconButton
                          onClick={() => onChange(null)}
                          disabled={props?.isView}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            width: "10px",
                            height: "10px",
                            backgroundColor: "#fff",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <img src={IconClose} alt="remove" style={{ width: 16, height: 16 }} />
                        </IconButton>
                      </div>
                    )}
                  </div>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <div style={{ display: "flex", alignItems: "center", marginTop: 15 }}>
                    <p>On/Off</p>
                    <Checkbox onChange={onChange} value={value} defaultChecked={value} />
                  </div>
                )}
              />
            </Grid>

            <Grid size={5.5}>
              <Controller
                control={control}
                name="ad"
                render={({ field }) => <TextFieldCustom {...field} label="Ad" fullWidth disabled={props?.isView} />}
              />
            </Grid>
            <Grid size={1}></Grid>

            <Grid size={5.5}>
              <Controller
                control={control}
                name="ad_set_id"
                render={({ field: { onChange, value } }) => (
                  <SelectCustom
                    value={value ?? ""}
                    onChange={onChange}
                    name="Ad Set Name"
                    options={props?.dataAdSets?.map((item: any) => ({
                      value: item?.id,
                      label: item?.adSet,
                    }))}
                  />
                )}
              />
            </Grid>
            <Grid size={5.5}>
              <Controller
                control={control}
                name="deliveryStatus"
                render={({ field: { onChange, value } }) => (
                  <SelectCustom
                    value={value ?? ""}
                    onChange={onChange}
                    name="Delivery Status"
                    options={[
                      { value: "Active", label: "Active" },
                      { value: "Off", label: "Off" },
                    ]}
                  />
                )}
              />
            </Grid>
            <Grid size={1}></Grid>

            <Grid size={5.5}>
              <Controller
                control={control}
                name="deliveryDescription"
                render={({ field }) => (
                  <TextFieldCustom {...field} label="Delivery Description" fullWidth disabled={props?.isView} />
                )}
              />
            </Grid>

            <Grid size={5.5}>
              <Controller
                control={control}
                name="qualityRankingTitle"
                render={({ field: { onChange, value } }) => (
                  <SelectCustom
                    value={value ?? ""}
                    onChange={onChange}
                    name="Quality Ranking Title"
                    options={[
                      { value: "Average", label: "Average" },
                      { value: "Above average", label: "Above average" },
                      { value: "Below average", label: "Below average" },
                    ]}
                  />
                )}
              />
            </Grid>
            <Grid size={1}></Grid>

            <Grid size={5.5}>
              <Controller
                control={control}
                name="qualityRankingDescription"
                render={({ field }) => (
                  <TextFieldCustom {...field} label="Quality Ranking Description" fullWidth disabled={props?.isView} />
                )}
              />
            </Grid>
            <Grid size={5.5}>
              <Controller
                control={control}
                name="engagementRateRankingTitle"
                render={({ field: { onChange, value } }) => (
                  <SelectCustom
                    value={value ?? ""}
                    onChange={onChange}
                    name="Engagement Rate Ranking Title"
                    options={[
                      { value: "Average", label: "Average" },
                      { value: "Above average", label: "Above average" },
                      { value: "Below average", label: "Below average" },
                    ]}
                  />
                )}
              />
            </Grid>
            <Grid size={1}></Grid>

            <Grid size={5.5}>
              <Controller
                control={control}
                name="engagementRateRankingDescription"
                render={({ field }) => (
                  <TextFieldCustom
                    {...field}
                    label="Engagement Rate Ranking Description"
                    fullWidth
                    disabled={props?.isView}
                  />
                )}
              />
            </Grid>
            <Grid size={5.5}>
              <Controller
                control={control}
                name="conversionRateRankingTitle"
                render={({ field }) => (
                  <TextFieldCustom
                    {...field}
                    label="Conversion Rate Ranking Title"
                    fullWidth
                    disabled={props?.isView}
                  />
                )}
              />
            </Grid>
            <Grid size={1}></Grid>

            <Grid size={5.5}>
              <Controller
                control={control}
                name="conversionRateRankingDescription"
                render={({ field }) => (
                  <TextFieldCustom
                    {...field}
                    label="Conversion Rate Ranking Description"
                    fullWidth
                    disabled={props?.isView}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={props?.isView} variant="contained" color="success" autoFocus type="submit">
            Save changes
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
};

export default ModalAdminAds;
