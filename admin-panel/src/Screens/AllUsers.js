import React, { useContext, useState } from "react";

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
        setUsersFromBackend(res.data.data.doc);
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
        <div style={{ display: "flex" }}>
          <LeftDrawer />
          <div className="RightSide" style={{ width: "100%" }}>
            <div className="NavBar">
              <h1 className="NavBarText">All Users</h1>
            </div>
            <div
              class="row"
              style={{
                marginLeft: "90px",
                marginTop: "30px",
                marginBottom: "-10px",
              }}
            >
              <div
                style={{ padding: "0px" }}
                class="col-xl-3 col-md-3 col-sm-3"
              >
                <p>#</p>
              </div>
              <div
                style={{ padding: "0px" }}
                class="col-xl-3 col-md-3 col-sm-3"
              >
                <p>Name</p>
              </div>
              <div
                style={{ padding: "0px" }}
                class="col-xl-3 col-md-3 col-sm-3"
              >
                <p>Role</p>
              </div>
              <div
                style={{ padding: "0px" }}
                class="col-xl-3 col-md-3 col-sm-3"
              >
                <p>Action</p>
              </div>
            </div>
            <hr style={{ marginLeft: "20px", marginRight: "20px" }} />

            {getUsersFromBackend.map((data, index) => {
              const url = "/Backend/public/images/users/" + data.photo;

              return (
                <div
                  class="row"
                  style={{
                    marginLeft: "90px",
                    marginBottom: "20px",
                    width: "90%",

                    borderBottom: "0.2px solid #D3D3D3",
                  }}
                >
                  <div style={{ padding: "0px" }} class="col-sm-3">
                    <p
                      className="DivOfListContent"
                      style={{ marginTop: "20px" }}
                    >
                      {index + 1}
                    </p>
                  </div>
                  <div style={{ padding: "0px" }} class="col-sm-3">
                    <p
                      className="DivOfListContent"
                      style={{ marginLeft: "-50px" }}
                    >
                      <img
                        className="Photo"
                        src={data.photoUrl}
                        alt="No photo"
                      />
                      <span className="DivOfListContentText">
                        {data.firstname} {data.lastname}
                      </span>
                    </p>
                  </div>
                  <div style={{ padding: "0px" }} class="col-sm-3">
                    <p
                      className="DivOfListContentRole"
                      style={{ marginTop: "20px" }}
                    >
                      {data.role}
                    </p>
                  </div>
                  <div
                    style={{ padding: "0px", marginLeft: "-23px" }}
                    class="col-sm-3"
                  >
                    <p
                      className="DivOfListContentView"
                      style={{ marginTop: "15px" }}
                    >
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
                          let text = "Do you really want to delete a User.";
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
                    </p>
                  </div>
                  <Modal isOpen={modalIsOpen} style={customStyles}>
                    <div>
                      <AiFillCloseCircle
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        style={{
                          color: "red",
                          fontSize: "27px",
                          marginLeft: "346px",
                          marginTop: "-31px",
                        }}
                      />
                      <h4 style={{ color: "white" }}>Write Warning here</h4>
                      <TextField
                        id="outlined-multiline-static"
                        label="Warning"
                        multiline
                        rows={4}
                        placeholder="Warning"
                        onChange={handleChange}
                        style={{ width: "350px" }}
                        inputProps={{ style: { color: "white" } }}
                      />
                    </div>
                    <Button
                      variant="contained"
                      style={{
                        marginTop: "8px",
                        marginLeft: "280px",
                      }}
                      onClick={() => {
                        sendWarning();
                      }}
                    >
                      Send
                    </Button>
                  </Modal>
                </div>
              );
            })}
          </div>
        </div>
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
