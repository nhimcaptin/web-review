import SelectCustom from "@/components/SelectCustom";
import TextFieldCustom from "@/components/TextFieldCustom";
import { Button, Grid, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IconClose from "@/assets/close.svg";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";
import { Bounce, toast } from "react-toastify";
import MESSAGE_API from "@/constants/message";
import moment from "moment";
import { useLoading } from "@/stores/loadingStore";

const AdminFormFace: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      namePage: "",
      locations: "",
      age: "",
      gender: "",
      budget: "",
      idPost: "",
      datePost: "",
      Description: "",
      image: "",
      image_urls: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [imageUrl, setImageUrl] = useState<string>("");
  const [deleteImageUrls, setDeleteImageUrls] = useState<string[]>([]);

  const onSubmit = async (data: any) => {
    showLoading();
    let imageUrlDelete = "";
    const imageUrls = data.image_urls.filter((item: any) => typeof item !== "string");
    const imageUrlsString = data.image_urls.filter((item: any) => typeof item === "string");
    if (typeof data.image === "string" && !imageUrl.includes(data.image) && !!imageUrl) {
      imageUrlDelete = imageUrl;
    }
    if (imageUrl != data?.image && !!data?.image) {
      try {
        const formData = new FormData();
        formData.append("image", data.image);
        const uploadResponse = await axiosInstance.post(URL_PATHS.UPLOAD_IMAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        data.image = uploadResponse?.data?.filename;
      } catch (error) {}
    }

    if (Array.isArray(imageUrls)) {
      const uploadPromises = imageUrls.map(async (image: any) => {
        if (image instanceof File) {
          try {
            const formData = new FormData();
            formData.append("image", image);
            const uploadResponse = await axiosInstance.post(URL_PATHS.UPLOAD_IMAGE, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            return uploadResponse?.data?.filename;
          } catch (error) {
            console.error("Error uploading image:", error);
            return null;
          }
        }
        return image;
      });

      const results = await Promise.all(uploadPromises);
      data.image_urls = [...imageUrlsString, ...results.filter(Boolean)];
    } else {
      data.image_urls = [];
    }
    try {
      delete data?.id;
      const response: any = await axiosInstance.put(URL_PATHS.UPDATE_FACE, {
        ...data,
        datePost: data?.datePost ? moment(data?.datePost).format("YYYY-MM-DD") : null,
      });
      const _deleteImageUrls = deleteImageUrls.filter((item: any) => typeof item === "string");
      const deleteImage = [..._deleteImageUrls, imageUrlDelete].filter(Boolean);
      if (deleteImage.length > 0) {
        try {
          const deletePromises = deleteImage.map((filename) =>
            axiosInstance.delete(URL_PATHS.DELETE_IMAGE.replace(":filename", filename))
          );
          await Promise.all(deletePromises);
        } catch (error) {}
      }

      if (response?.status === 200) {
        toast.success(MESSAGE_API.updateSuccessFormFace, {
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
        await getDetailPost();
        setDeleteImageUrls([]);
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
    } finally {
      hideLoading();
    }
  };

  const getDetailPost = async () => {
    try {
      showLoading();
      const response = await axiosInstance.get(URL_PATHS.GET_DETAIL_FACE);
      if (response?.status === 200) {
        reset(response?.data);
        setImageUrl(response?.data?.image || "");
      }
    } catch (error) {
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getDetailPost();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h1>Admin Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Controller
              control={control}
              name="image"
              render={({ field: { onChange, value } }) => (
                <div style={{ marginBottom: 20 }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="image-upload"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                  />
                  <label htmlFor="image-upload">
                    <Button variant="contained" component="span">
                      Upload Avatar Page
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
        <Grid container spacing={2} style={{ marginBottom: 20 }}>
          <Grid size={12}>
            <Controller
              control={control}
              name="image_urls"
              render={({ field: { onChange, value } }) => (
                <div>
                  <input
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
                    <Button variant="contained" component="span">
                      Upload Multiple Images
                    </Button>
                  </label>
                  {value && value.length > 0 && (
                    <div style={{ marginTop: 15, display: "flex", flexWrap: "wrap", gap: 10 }}>
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
        </Grid>

        <Grid container spacing={2}>
          <Grid size={12}>
            <Controller
              control={control}
              name="namePage"
              render={({ field }) => <TextFieldCustom {...field} label="Page Name" fullWidth />}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={control}
              name="locations"
              render={({ field }) => <TextFieldCustom {...field} label="Locations" fullWidth />}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value } }) => (
                <SelectCustom
                  value={value ?? ""}
                  onChange={onChange}
                  name="Age"
                  options={[
                    { value: "18-20", label: "18-20" },
                    { value: "21-25", label: "21-25" },
                    { value: "26-30", label: "26-30" },
                    { value: "31-35", label: "31-35" },
                    { value: "36+", label: "36+" },
                  ]}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <SelectCustom
                  value={value ?? ""}
                  onChange={onChange}
                  name="Gender"
                  options={[
                    { value: "Men", label: "Men" },
                    { value: "Women", label: "Women" },
                    { value: "All", label: "All" },
                  ]}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={control}
              name="budget"
              render={({ field }) => <TextFieldCustom {...field} label="Budget" fullWidth type="number" />}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={control}
              name="idPost"
              render={({ field }) => <TextFieldCustom {...field} label="Post ID" fullWidth />}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={control}
              name="datePost"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Post Date"
                  value={value ? dayjs(value) : null}
                  onChange={(newValue) => onChange(newValue?.toISOString())}
                  slots={{
                    textField: TextFieldCustom,
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              control={control}
              name="Description"
              render={({ field }) => <TextFieldCustom {...field} label="Description" fullWidth multiline rows={6} />}
            />
          </Grid>

          <Grid size={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AdminFormFace;
