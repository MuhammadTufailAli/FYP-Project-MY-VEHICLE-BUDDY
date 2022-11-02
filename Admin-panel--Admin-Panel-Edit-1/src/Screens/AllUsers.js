import React, { useContext, useState } from "react";

// MUI Table Imports
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Button from "@mui/material/Button";
import axios from "axios";
import Modal from "react-modal";
import TextField from "@mui/material/TextField";
import { AiFillCloseCircle } from "react-icons/ai";
import "./../ScreensCss/AllUsers.css";

import LeftDrawer from "./LeftDrawer";
import { Link } from "react-router-dom";

import CartProvider from "./../contextApi";

function AllUsers() {
  const { cookies, setCookie } = useContext(CartProvider);
  const [getUsersFromBackend, setUsersFromBackend] = React.useState({});
  const [authCondition, setauthCondition] = React.useState(true);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [warning, setWarning] = React.useState("");
  const [userId, setUserId] = React.useState();

  const [currentUserName, setCurrentUserName] = React.useState();
  console.log(cookies);

  const getData = () => {
    axios
      .get("http://localhost:3000/users/allUsers", {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        setUsersFromBackend(
          res.data.data.doc.filter((data) => {
            return data.role !== "admin";
          })
        );

        setCurrentUserName(
          res.data.user.firstname + " " + res.data.user.lastname
        );
        console.log(res.data.data);
      })
      .catch((err) => {
        setauthCondition(false);
        console.log(err.response.data.message);
      });
  };

  const sendWarning = () => {
    axios
      .post(
        "http://localhost:3000/userNotification/postNotification",
        {
          refOfUser: userId,
          refOfProduct: null,
          warning: warning,
          warningFrom: currentUserName,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then((res) => {
        alert("Warning send to Product Owner");

        console.log(getUsersFromBackend);
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      backgroundColor: "grey",
      borderRadius: "25px",
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWarning(event.target.value);
    console.log(event.target.value);
  };

  React.useEffect(() => {
    getData();
    console.log("Hello");
  }, []);
  if (authCondition) {
    if (Object.keys(getUsersFromBackend).length === 0) {
      return (
        <div>
          <p>Waiting</p>
        </div>
      );
    } else {
      return (
        <>
          <div style={{ display: "flex" }}>
            <LeftDrawer />
            <div className="RightSide" style={{ width: "100%" }}>
              <div className="NavBar">
                <h1 className="NavBarText">All Users</h1>
              </div>
              <Box sx={{ ml: 3, mt: 3, mr: 3 }}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Id</TableCell>
                        <TableCell align="center">Avatar</TableCell>
                        <TableCell align="center">First Name</TableCell>
                        <TableCell align="center">Last Name</TableCell>
                        <TableCell align="center">Role</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getUsersFromBackend.map((data) => (
                        <TableRow
                          key={data.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{data._id}</TableCell>
                          <TableCell align="center">
                            <img
                              className="Photo"
                              src={data.photoUrl}
                              alt="Avatar"
                            />
                          </TableCell>
                          <TableCell align="center">{data.firstname}</TableCell>
                          <TableCell align="center">{data.lastname}</TableCell>
                          <TableCell align="center"> {data.role}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              style={{ marginRight: "8px" }}
                            >
                              <Link
                                to="/AllUsers/SelectedUserDetails"
                                state={{ user: data }}
                                className="boxLowerTextLink"
                                style={{ color: "white" }}
                              >
                                View
                              </Link>
                            </Button>

                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => {
                                let text =
                                  "Do you really want to delete a User.";
                                if (window.confirm(text) == true) {
                                  axios
                                    .delete(
                                      `http://localhost:3000/users/deleteUser/${data._id}`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${cookies.jwt}`,
                                        },
                                      }
                                    )
                                    .then((res) => {
                                      alert("Deleted Successfully");
                                      window.location.reload(false);
                                      console.log(res);
                                    })
                                    .catch((err) => {
                                      console.log(err.response.data.message);
                                    });
                                }
                              }}
                            >
                              Delete
                            </Button>
                            <br />
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#FFCC00",
                                marginLeft: "22px",
                                marginTop: "10px",
                              }}
                              onClick={() => {
                                setUserId(data._id);

                                setIsOpen(true);
                              }}
                            >
                              Warning
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </div>
          </div>
        </>
      );
    }
  } else {
    return (
      <div>
        <h1>You are not logged in</h1>
      </div>
    );
  }
}

export default AllUsers;
