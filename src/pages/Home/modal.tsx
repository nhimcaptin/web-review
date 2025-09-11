import IconClose from "@/assets/close.svg";
import TextFieldCustom from "@/components/TextFieldCustom";
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
  Rating,
  styled,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { Bounce, toast } from "react-toastify";
import MESSAGE_API from "@/constants/message";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ModalReview = (props: any) => {
  const { defaultValues } = props;
  const { showLoading, hideLoading } = useLoading();
  const [deleteImageUrls, setDeleteImageUrls] = useState<any[]>([]);
  const [deleteVideoUrls, setDeleteVideoUrls] = useState<any[]>([]);
  const { handleSubmit, control } = useForm<any>({
    defaultValues: {
      // images: [],
      // videos: [],
      images: defaultValues?.images || [],
      videos: defaultValues?.videos || [],
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      rate: defaultValues?.rate || 1,
      verified_purchase: defaultValues?.verified_purchase || false,
      would_recommend: defaultValues?.would_recommend || false,
      user: defaultValues?.user || "",
      likes: defaultValues?.likes || 0,
      orderSort: defaultValues?.orderSort ?? null,
      outstanding: defaultValues?.outstanding || false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputVideoRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: any) => {
    const urlsFile = files.filter((item: any) => item instanceof File);
    const urlsString = files.filter((item: any) => !(item instanceof File));
    if (Array.isArray(urlsFile) && urlsFile.length > 0) {
      const formData = new FormData();
      urlsFile.forEach((file: File) => {
        formData.append("files", file);
      });
      try {
        const uploadResponse: any = await axiosInstance.post(URL_PATHS.UPLOAD_IMAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!uploadResponse?.success) {
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
          return [];
        }
        const uploadedFiles = uploadResponse?.data?.map((x: any) => ({
          filename: x?.filename || "",
          frame: x?.extractedFrame?.frameFilename || "",
        }));
        return [...uploadedFiles, ...urlsString];
      } catch (error: any) {
        return Promise.reject(error);
      }
    }
    return files;
  };

  const onSubmit = async (data: any) => {
    try {
      const _data = {
        ...data,
        orderSort: data?.orderSort ?? null,
        likes: data?.likes ?? 0,
      };
      showLoading();
      data.images = await uploadFiles(data?.images);
      data.videos = await uploadFiles(data?.videos);
      const response: any = props?.defaultValues
        ? await axiosInstance.put(URL_PATHS.UPDATE.replace(":id", props?.defaultValues?.id), _data)
        : await axiosInstance.post(URL_PATHS.CREATE, _data);
      const _deleteImageUrls = deleteImageUrls.filter((item: any) => !(item instanceof File));
      if (_deleteImageUrls.length > 0) {
        try {
          const deletePromises = _deleteImageUrls.map((filename: any) =>
            axiosInstance.delete(URL_PATHS.DELETE_IMAGE.replace(":filename", filename?.filename), {
              params: { type: "images" },
            })
          );
          await Promise.all(deletePromises);
        } catch (error) {}
      }
      const _deleteVideoUrls = deleteVideoUrls.filter((item: any) => !(item instanceof File));
      if (_deleteVideoUrls.length > 0) {
        try {
          const deletePromises = _deleteVideoUrls.map((filename: any) =>
            axiosInstance.delete(URL_PATHS.DELETE_IMAGE.replace(":filename", filename?.filename), {
              params: { type: "videos" },
            })
          );
          await Promise.all(deletePromises);
        } catch (error) {}
      }
      if (!!response?.success) {
        await props.getList();
        toast.success(props?.defaultValues ? MESSAGE_API.createSuccess : MESSAGE_API.updateSuccess, {
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
    } catch (error: any) {
      toast.error(error?.response ? error?.response?.data?.message : MESSAGE_API.errorApi, {
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
          {props?.isView ? "View" : defaultValues ? "Edit" : "Add New"}
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
          <Grid container spacing={2} style={{ marginBottom: 20 }}>
            <Grid size={12}>
              <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>Select Images</p>
              <Controller
                control={control}
                name="images"
                render={({ field: { onChange, value } }) => (
                  <div className={styles.boxImage}>
                    <input
                      ref={inputImageRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      id="multiple-images-upload"
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          onChange([...value, ...Array.from(files)]);
                        }
                      }}
                    />
                    <label htmlFor="multiple-images-upload" style={{ marginRight: 10 }}>
                      <Button
                        onClick={() => {
                          if (inputImageRef.current) {
                            inputImageRef.current.click();
                          }
                        }}
                        variant="outlined"
                        className={styles.button}
                      >
                        <Typography className={styles.title}>Select images</Typography>
                      </Button>
                    </label>
                    {value && value.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {value.map((img: File | any, index: number) => (
                          <div key={index} style={{ height: "100px", width: "100px", position: "relative" }}>
                            <img
                              src={
                                !(img instanceof File)
                                  ? import.meta.env.VITE_BASE_IMAGE + img?.filename
                                  : URL.createObjectURL(img)
                              }
                              alt={`Preview ${index + 1}`}
                              style={{ height: "100px", width: "100px", objectFit: "cover" }}
                            />
                            <IconButton
                              onClick={() => {
                                const newImages = [...value];
                                const data = newImages.splice(index, 1);
                                setDeleteImageUrls((pre) => [...pre, data[0]]);
                                onChange(newImages);
                              }}
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
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid size={12}>
              <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>Select Videos</p>
              <Controller
                control={control}
                name="videos"
                render={({ field: { onChange, value } }) => (
                  <div className={styles.boxImage}>
                    <input
                      ref={inputVideoRef}
                      accept="video/*"
                      style={{ display: "none" }}
                      id="multiple-videos-upload"
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          onChange([...value, ...Array.from(files)]);
                        }
                        e.target.value = "";
                      }}
                    />
                    <label htmlFor="multiple-videos-upload" style={{ marginRight: 10 }}>
                      <Button
                        onClick={() => {
                          if (inputVideoRef.current) {
                            inputVideoRef.current.click();
                          }
                        }}
                        variant="outlined"
                        className={styles.button}
                      >
                        <Typography className={styles.title}>Select videos</Typography>
                      </Button>
                    </label>

                    {value?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {value.map((vid: File | any, index: number) => {
                          const src =
                            vid instanceof File
                              ? URL.createObjectURL(vid)
                              : import.meta.env.VITE_BASE_VIDEO + vid?.filename;

                          return (
                            <div key={index} style={{ height: 100, width: 150, position: "relative" }}>
                              <video src={src} style={{ height: "100%", width: "100%", objectFit: "cover" }} controls />
                              <IconButton
                                onClick={() => {
                                  const newVideos = [...value];
                                  const removed = newVideos.splice(index, 1);
                                  setDeleteVideoUrls((pre) => [...pre, removed[0]]);
                                  onChange(newVideos);
                                  if (removed[0] instanceof File) URL.revokeObjectURL(src);
                                }}
                                sx={{
                                  position: "absolute",
                                  top: -8,
                                  right: -8,
                                  backgroundColor: "#fff",
                                  "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                              >
                                <img src={IconClose} alt="remove" style={{ width: 16, height: 16 }} />
                              </IconButton>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              />
            </Grid>
            <Grid container size={12}>
              <Grid size={4}>
                <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>Order Sort</p>
                <Controller
                  control={control}
                  name="orderSort"
                  render={({ field: { onChange, value } }) => (
                    <TextFieldCustom
                      onChange={onChange}
                      value={value}
                      fullWidth
                      disabled={props?.isView}
                      placeholder="Enter order sort"
                      type="number"
                    />
                  )}
                />
              </Grid>
              <Grid size={4} style={{ display: "flex", alignItems: "end" }}>
                <Controller
                  control={control}
                  name="outstanding"
                  render={({ field: { onChange, value } }) => (
                    <div style={{ display: "flex", alignItems: "center", height: "30px" }}>
                      <p style={{ fontWeight: 500, fontSize: 16 }}>Outstanding</p>
                      <Checkbox onChange={onChange} value={value} defaultChecked={value} />
                    </div>
                  )}
                />
              </Grid>
            </Grid>
            <Grid size={4}>
              <Controller
                control={control}
                name="verified_purchase"
                render={({ field: { onChange, value } }) => (
                  <div style={{ display: "flex", alignItems: "center", height: "30px" }}>
                    <p style={{ fontWeight: 500, fontSize: 16 }}>Verified purchase</p>
                    <Checkbox onChange={onChange} value={value} defaultChecked={value} />
                  </div>
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                control={control}
                name="would_recommend"
                render={({ field: { onChange, value } }) => (
                  <div style={{ display: "flex", alignItems: "center", height: "30px" }}>
                    <p style={{ fontWeight: 500, fontSize: 16 }}>Would recommend</p>
                    <Checkbox onChange={onChange} value={value} defaultChecked={value} />
                  </div>
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                control={control}
                name="rate"
                render={({ field: { onChange, value } }) => (
                  <div style={{ display: "flex", alignItems: "center", height: "30px" }}>
                    <p style={{ fontWeight: 500, fontSize: 16, marginRight: 10 }}>Rating:</p>
                    <Rating name="simple-controlled" value={value} onChange={onChange} />
                  </div>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 20 }}>
            <Grid size={4}>
              <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>Title</p>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextFieldCustom {...field} fullWidth disabled={props?.isView} placeholder="Enter Title" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>User</p>
              <Controller
                control={control}
                name="user"
                render={({ field }) => (
                  <TextFieldCustom {...field} fullWidth disabled={props?.isView} placeholder="Enter User" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>Likes</p>
              <Controller
                control={control}
                name="likes"
                render={({ field: { onChange, value } }) => (
                  <TextFieldCustom
                    onChange={onChange}
                    value={value}
                    fullWidth
                    disabled={props?.isView}
                    placeholder="Enter likes"
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>Description</p>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextFieldCustom
                    {...field}
                    fullWidth
                    disabled={props?.isView}
                    placeholder="Enter Description"
                    multiline
                    rows={3}
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

export default ModalReview;
