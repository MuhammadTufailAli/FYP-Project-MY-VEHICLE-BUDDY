import React, { useContext, useState } from "react";
import "./../ScreensCss/WelcomeScreen.css";
import LeftDrawer from "./LeftDrawer";
import { useParams } from "react-router-dom";

import Chart from "react-apexcharts";

import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";

// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";

import CartProvider from "./../contextApi";
import axios from "axios";
import {
  AiFillDashboard,
  AiOutlineUser,
  AiFillShopping,
  AiFillCaretRight,
} from "react-icons/ai";

function Dashboard() {
  const queryParams = new URLSearchParams(window.location.search);
  const product = queryParams.get("product");
  const user = queryParams.get("user");
  const price = queryParams.get("price");
  console.log(product, user, price);

  const { cookies, setCookie } = useContext(CartProvider);
  const [getUsersFromBackend, setUsersFromBackend] = React.useState({});
  const [getProductsFromBackend, setProductsFromBackend] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [loadingCondition1, setLoadingCondition1] = React.useState(true);
  const [loadingCondition2, setLoadingCondition2] = React.useState(true);
  const [loadingCondition3, setLoadingCondition3] = React.useState(true);
  const [totalNotifications, setTotalNotifications] = React.useState(true);

  const [series, setSeries] = useState([
    {
      name: "Registered",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Active",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Pending",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
    {
      name: "Inactive",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ]);

  const [series2, setSeries2] = useState([100, 70, 15, 15]);

  const [options2, setOptions2] = useState({
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Registered", "Active", "Pending", "InActive"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Total Users",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Users";
        },
      },
    },
  });
  const getData = () => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .get(
        "http://localhost:3000/users/allUsers",

        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then((res) => {
        setUsersFromBackend(res);

        setCurrentUser(res.data.user);
        setLoadingCondition1(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
    //get products
    axios
      .get(
        "http://localhost:3000/product/allProduct",

        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then((res) => {
        setProductsFromBackend(res);
        setLoadingCondition2(false);
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
    //get all notifications
    axios
      .get(
        "http://localhost:3000/adminNotification/getNotification",

        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then((res) => {
        // setProductsFromBackend(res);
        setLoadingCondition3(false);
        setTotalNotifications(res.data.result);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });

    //Jab hum stripe sa dasboard pa aya to product user and price ki value set ho jay gi
    //Hum na vo values db ma store kar di or us k bad url change kar diya
    if (product) {
      axios
        .post("http://localhost:3000/booking/Postbooking", {
          Product: product,
          User: user,
          Price: price,
        })
        .then((res) => {
          console.log(res);
          const nextURL = "http://localhost:3001/";
          const nextTitle = "Dashboard";
          const nextState = {
            additionalInformation: "Updated the URL with JS",
          };
          window.history.pushState(nextState, nextTitle, nextURL);
          window.history.replaceState(nextState, nextTitle, nextURL);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  React.useEffect(() => {
    getData();
    console.log("Hello");
  }, []);
  if (loadingCondition1 || loadingCondition2 || loadingCondition3) {
    return (
      <div>
        <p>It will show soon</p>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex" }}>
        <LeftDrawer />
        <div className="rightSideContainer">
          <div className="Header">
            <p className="HeaderText">Dashboard</p>
          </div>
          <div className="UpperPart">
            <div>
              <p className="UnderHeaderText">
                Welcome {currentUser.firstname} {currentUser.lastname},
                everything looks great
              </p>
            </div>
            <div className="NotificationBell">
              <Link to="/Notification" className="boxLowerTextLink">
                <Badge
                  badgeContent={totalNotifications}
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "white",
                      backgroundColor: "red",
                    },
                  }}
                >
                  <NotificationsActiveIcon color="action" />
                </Badge>
              </Link>
            </div>
          </div>
          <div class="row">
            <div style={{ padding: "0px" }} class="col-xl-3 col-md-6 col-sm-12">
              <div className="boxForInfo">
                <div className="boxForInfoUpperContainer">
                  <p className="boxNumber">{getUsersFromBackend.data.result}</p>
                  <p className="boxUpperText">Total Users</p>
                </div>
                <div className="boxForInfoLowerContainer">
                  <p className="boxLowerText">
                    <Link to="/AllUsers" className="boxLowerTextLink">
                      View All Users
                    </Link>
                  </p>
                  <p className="boxLowerTextIcon">
                    <Link to="/AllUsers" className="boxLowerTextIconLink">
                      <AiFillCaretRight className="icon" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: "0px" }} class="col-xl-3 col-md-6 col-sm-12">
              <div className="boxForInfo">
                <div className="boxForInfoUpperContainer">
                  <p className="boxNumber">
                    {getProductsFromBackend.data.result}
                  </p>
                  <p className="boxUpperText">Total Products</p>
                </div>
                <div className="boxForInfoLowerContainer">
                  <p className="boxLowerText">
                    <Link to="/AllProducts" className="boxLowerTextLink">
                      View All Products
                    </Link>
                  </p>
                  <p className="boxLowerTextIcon">
                    <Link to="/AllProducts" className="boxLowerTextIconLink">
                      <AiFillCaretRight className="icon" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: "0px" }} class="col-xl-3 col-md-6 col-sm-12">
              <div className="boxForInfo">
                <div className="boxForInfoUpperContainer">
                  <p className="boxNumber">2</p>
                  <p className="boxUpperText">New Users</p>
                </div>
                <div className="boxForInfoLowerContainer">
                  <p className="boxLowerText">View All New Users</p>
                  <p className="boxLowerTextIcon">
                    <AiFillCaretRight className="icon" />
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: "0px" }} class="col-xl-3 col-md-6 col-sm-12">
              <div className="boxForInfo">
                <div className="boxForInfoUpperContainer">
                  <p className="boxNumber">20</p>
                  <p className="boxUpperText">Total Reports</p>
                </div>
                <div className="boxForInfoLowerContainer">
                  <p className="boxLowerText">View All Reports</p>
                  <p className="boxLowerTextIcon">
                    <AiFillCaretRight className="icon" />
                  </p>
                </div>
              </div>
            </div>
            <div className="Graphs">
              <div className="BarGraph">
                <Chart
                  options={options}
                  series={series}
                  type="bar"
                  width={"100%"}
                  height={320}
                />
              </div>
              <div className="PieGraph">
                <Chart
                  options={options2}
                  series={series2}
                  type="pie"
                  width={"80%"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
