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
  const [deleteImageUrls, setDeleteImageUrls] = useState<string[]>([]);
  const [deleteVideoUrls, setDeleteVideoUrls] = useState<string[]>([]);
  const { handleSubmit, control } = useForm<any>({
    defaultValues: {
      images: defaultValues?.image || [],
      videos: defaultValues?.videos || [],
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      rate: defaultValues?.rate || 1,
      verified_purchase: defaultValues?.verified_purchase || false,
      would_recommend: defaultValues?.would_recommend || false,
      user: defaultValues?.user || "",
      like: defaultValues?.like || 0,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputVideoRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: any) => {
    try {
      showLoading();
    } catch (error) {
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
                    <label htmlFor="multiple-images-upload">
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
                        {value.map((img: File | string, index: number) => (
                          <div key={index} style={{ height: "100px", width: "100px", position: "relative" }}>
                            <img
                              src={
                                typeof img === "string"
                                  ? import.meta.env.VITE_BASE_FOLDER + img
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
                    <label htmlFor="multiple-videos-upload">
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
                        {value.map((vid: File | string, index: number) => {
                          const src =
                            vid instanceof File ? URL.createObjectURL(vid) : import.meta.env.VITE_BASE_FOLDER + vid;

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
              <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 5 }}>Like</p>
              <Controller
                control={control}
                name="like"
                render={({ field }) => (
                  <TextFieldCustom
                    {...field}
                    fullWidth
                    disabled={props?.isView}
                    placeholder="Enter Like"
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
