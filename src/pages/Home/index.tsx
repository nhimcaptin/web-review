import IconsMoreAction from "@/assets/moreAction.svg";
import IF from "@/components/IF";
import MenuListActions from "@/components/MenuListActions";
import MESSAGE_API from "@/constants/message";
import axiosInstance from "@/services/api-services";
import URL_PATHS from "@/services/url-path";
import { useLoading } from "@/stores/loadingStore";
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
import moment from "moment";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import ModalReview from "./modal";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const columns: any = [
  {
    id: "user",
    label: "User Name",
    minWidth: 150,
    align: "start",
  },
  {
    id: "title",
    label: "Title",
    minWidth: 150,
    align: "start",
  },
  {
    id: "rate",
    label: "Rate",
    minWidth: 150,
    align: "start",
  },
  {
    id: "like",
    label: "Like",
    minWidth: 150,
    align: "start",
  },
  {
    id: "created",
    label: "Created",
    minWidth: 150,
    align: "start",
  },
];

const Home = () => {
  const { showLoading, hideLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataSelected, setDataSelected] = useState(null);
  const [isView, setIsView] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClickAction = (event: React.SyntheticEvent<Event> | any, item: any) => {
    setAnchorEl(event.currentTarget);
    setDataSelected(item);
  };

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
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

  const getDetail = async (item: any) => {
    try {
      showLoading();
      const data: any = await axiosInstance.get(URL_PATHS.GET_DETAIL_HOME.replace(":id", item?.id));
      if (data?.success) {
        setDataDetail(data?.data);
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

  const getList = async () => {
    try {
      showLoading();
      const data: any = await axiosInstance.get(URL_PATHS.GET_HOME);
      if (data?.success) {
        setDataList(data?.data?.reviews);
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

  const handleDelete = async (item: any) => {};

  useEffect(() => {
    getList();
  }, []);

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
        <ModalReview
          open={isOpen}
          handleClose={() => {
            setIsOpen(false);
            setIsView(false);
            setDataDetail(null);
          }}
          defaultValues={dataDetail}
          getList={getList}
          isView={isView}
        />
      )}
    </div>
  );
};

export default Home;
