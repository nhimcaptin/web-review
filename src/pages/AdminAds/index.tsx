import IconsMoreAction from "@/assets/moreAction.svg";
import IF from "@/components/IF";
import MenuListActions from "@/components/MenuListActions";
import MESSAGE_API from "@/constants/message";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";
import {
  Button,
  IconButton,
  Paper,
  Popover,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import ModalAdminAds from "./modal";
import dayjs from "dayjs";
import moment from "moment";
import { useLoading } from "@/stores/loadingStore";

const columns: any = [
  { id: "status", label: "On/Off", align: "center", minWidth: 50 },
  {
    id: "ad",
    label: "Ad",
    minWidth: 150,
    align: "start",
  },
  {
    id: "adSetName",
    label: "Ad Set Name",
    minWidth: 150,
    align: "start",
  },
  {
    id: "deliveryStatus",
    label: "Delivery Status",
    minWidth: 150,
    align: "start",
  },
  {
    id: "deliveryDescription",
    label: "Delivery Description",
    minWidth: 150,
    align: "start",
  },
  {
    id: "bidStrategyCost",
    label: "Bid Strategy Cost",
    minWidth: 150,
    align: "start",
  },
  {
    id: "bidStrategyDescription",
    label: "Bid Strategy Description",
    minWidth: 150,
    align: "start",
  },
  {
    id: "lastSignificantEdit",
    label: "Last Significant Edit",
    minWidth: 150,
    align: "start",
  },
  {
    id: "budgetCost",
    label: "Budget Cost",
    minWidth: 150,
    align: "start",
  },
  {
    id: "budgetDescription",
    label: "Budget Description",
    minWidth: 150,
    align: "start",
  },
  {
    id: "attributionSetting",
    label: "Attribution Setting",
    minWidth: 150,
    align: "start",
  },
  {
    id: "resultsCost",
    label: "Results Cost",
    minWidth: 150,
    align: "start",
  },
  {
    id: "resultsDescription",
    label: "Results Description",
    minWidth: 150,
    align: "start",
  },
  {
    id: "reach",
    label: "Reach",
    minWidth: 150,
    align: "start",
  },
  {
    id: "impressions",
    label: "Impressions",
    minWidth: 150,
    align: "start",
  },
  {
    id: "costPerResultCost",
    label: "Cost PerResult Cost",
    minWidth: 150,
    align: "start",
  },
  {
    id: "costPerResultDescription",
    label: "Cost PerResult Description",
    minWidth: 150,
    align: "start",
  },
  {
    id: "amountSpent",
    label: "Amount Spent",
    minWidth: 150,
    align: "start",
  },
  {
    id: "endsOngoing",
    label: "Ends OnGoing",
    minWidth: 150,
    align: "center",
  },
  {
    id: "endsDate",
    label: "Ends Date",
    minWidth: 150,
    align: "start",
  },
  {
    id: "qualityRankingTitle",
    label: "Quality Ranking Title",
    minWidth: 150,
    align: "start",
  },
  {
    id: "qualityRankingDescription",
    label: "Quality Ranking Description",
    minWidth: 150,
    align: "start",
  },
  {
    id: "engagementRateRankingTitle",
    label: "Engagement Rate Ranking Title",
    minWidth: 150,
    align: "start",
  },
  {
    id: "engagementRateRankingDescription",
    label: "Engagement Rate Ranking Description",
    minWidth: 150,
    align: "start",
  },
  {
    id: "conversionRateRankingTitle",
    label: "Conversion Rate Ranking Title",
    minWidth: 150,
    align: "start",
  },
  {
    id: "conversionRateRankingDescription",
    label: "Conversion Rate Ranking Description",
    minWidth: 150,
    align: "start",
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AdminAds = () => {
  const { showLoading, hideLoading } = useLoading();
  const [dataList, setDataList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);
  const [dataDetail, setDataDetail] = useState(null);
  const [isView, setIsView] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataAdSets, setDataAdSets] = useState([]);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    getList();
    getListAdSets();
  }, []);

  const getList = async () => {
    try {
      showLoading();
      const data: any = await axiosInstance.get(URL_PATHS.GET_AD);
      if (data?.status === 200) {
        setDataList(data?.data);
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

  const handleClickAction = (event: React.SyntheticEvent<Event> | any, item: any) => {
    setAnchorEl(event.currentTarget);
    setDataSelected(item);
  };

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const getDetail = async (item: any) => {
    try {
      showLoading();
      const data: any = await axiosInstance.get(URL_PATHS.GET_DETAIL_AD.replace(":id", item?.id));
      if (data?.status === 200) {
        setDataDetail({
          ...data?.data,
          endsDate: dayjs(data?.data?.endsDate),
          lastSignificantEdit: dayjs(data?.data?.lastSignificantEdit),
          scheduleFrom: dayjs(data?.data?.scheduleFrom),
          scheduleTo: dayjs(data?.data?.scheduleTo),
          status: data?.data?.status === 1,
          endsOngoing: data?.data?.endsOngoing === 1,
        });
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

  const handleView = async () => {
    await getDetail(dataSelected);
    setIsOpen(true);
    setAnchorEl(null);
    setIsView(true);
  };

  const handleEdit = async () => {
    await getDetail(dataSelected);
    setIsOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = async (item: any) => {
    setAnchorEl(null);
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        showLoading();
        const data = await axiosInstance.delete(URL_PATHS.DELETE_AD.replace(":id", item?.id));
        if (data?.status === 200) {
          await getList();
          toast.error(MESSAGE_API.deleteSuccessAds, {
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
    }
  };

  const getListAdSets = async () => {
    try {
      const data: any = await axiosInstance.get(URL_PATHS.GET_AD_SET);
      if (data?.status === 200) {
        setDataAdSets(data?.data);
      }
    } catch (error) {}
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        style={{ marginBottom: "20px", marginTop: "30px" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add new
      </Button>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column: any) => (
                  <TableCell key={column.id} align={column?.align || ""} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell style={{ minWidth: 50 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((row: any) => {
                return (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((col: any, index: number) => {
                      if (["status", "endsOngoing"].includes(col?.id)) {
                        return (
                          <TableCell key={`${col?.id}${index}`} align={col.align}>
                            {row[col?.id] ? "On" : "Off"}
                          </TableCell>
                        );
                      }
                      if (col?.id === "endsDate") {
                        return (
                          <TableCell key={`${col?.id}${index}`} align={col.align}>
                            {row[col?.id] ? moment(row[col?.id]).format("DD/MM/YYYY") : ""}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={`${col?.id}${index}`} align={col.align}>
                          {row[col?.id]}
                        </TableCell>
                      );
                    })}
                    <TableCell align="left">
                      <IconButton aria-label="more" onClick={(e) => handleClickAction(e, row)}>
                        <img
                          style={{ width: "20px", height: "20px", cursor: "pointer" }}
                          src={IconsMoreAction}
                          alt=""
                        />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <IF condition={open}>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseActionMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MenuListActions
            actionEdit={() => {
              handleEdit();
            }}
            actionView={() => {
              handleView();
            }}
            actionDelete={() => {
              handleDelete(dataSelected);
            }}
          />
        </Popover>
      </IF>
      {isOpen && (
        <ModalAdminAds
          open={isOpen}
          handleClose={() => {
            setIsOpen(false);
            setIsView(false);
            setDataDetail(null);
          }}
          defaultValues={dataDetail}
          getList={getList}
          isView={isView}
          dataAdSets={dataAdSets}
        />
      )}
    </div>
  );
};

export default AdminAds;
