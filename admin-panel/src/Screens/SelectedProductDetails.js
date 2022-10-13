import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import LeftDrawer from "./LeftDrawer";
import Carousel from "better-react-carousel";
import Rating from "@mui/material/Rating";
import axios from "axios";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";

import CartProvider from "./../contextApi";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const PUBLIC_KEY =
  "pk_test_51LcNiZDfjQDKNGNJCnxuhFqlQVq3RMTmc7PF1VyckZc1NvxHaNvNiiaQYizidxp3f0zUd8XCshH5GqZsRZXX0zaX00qzWx0ciu";

// var stripe = await stripeTestPromise;
const stripe = window.Stripe(PUBLIC_KEY);

function SelectedProductDetails() {
  const { cookies, setCookie } = useContext(CartProvider);
  const location = useLocation();
  const { product } = location.state;
  const url = "/Backend/public/images/products/" + product.imageCover;

  console.log("THeee Product is");
  console.log(product);

  const [getReview, setReview] = React.useState({});

  const getData = () => {
    axios
      .get(`http://localhost:3000/review/getProductReview/${product._id}`)
      .then((res) => {
        console.log(res.data.data);
        setReview(res.data.data);

        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const GetStripeDataFromBackEnd = async () => {
    axios
      .get(`http://localhost:3000/booking/checkout-session/${product._id}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        // console.log(res.data.data);
        //Is sa hum new stripe page pa redirect ho jay ga
        stripe.redirectToCheckout({
          sessionId: res.data.session.id,
        });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };
  React.useEffect(() => {
    getData();
    console.log("Hello");
  }, []);

  // if (Object.keys(getReview).length === 0) {
  //   return (
  //     <div>
  //       <p>Please wait</p>
  //     </div>
  //   );
  // } else {
  return (
    <div style={{ display: "flex" }}>
      <LeftDrawer />
      <div style={{ width: "100%" }}>
        <div className="carouselImage" style={{ margin: "30px" }}>
          <Carousel
            cols={1}
            rows={1}
            gap={100}
            loop
            showDots
            autoplay={4000}
            dotColorActive="#8b008b"
          >
            {product.imageUrl.map((image) => {
              return (
                <Carousel.Item>
                  <img width="100%" height="500px" src={image} />
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
        <div className="ProductDetails">
          <p>{product.title}</p>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
          <p>Category: {product.category}</p>
          <p>Condition: {product.condition}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Rating</p>
          <Rating
            style={{ alignSelf: "end", marginTop: "-24px" }}
            name="text-feedback"
            value={product.ratingsAverage}
            readOnly
            precision={0.5}
          />
        </div>
        <div className="StripePayment">
          <Button variant="contained" onClick={GetStripeDataFromBackEnd}>
            Buy
          </Button>
        </div>

        <div>
          <h1>Reviews</h1>
          <div>
            {getReview ? (
              <div>
                <p>No Review yet</p>
              </div>
            ) : (
              getReview?.map((data) => {
                const imageUrl =
                  "/Backend/public/images/users/" + data.refOfUser.photo;
                console.log(imageUrl);
                return (
                  <div class="col-sm-12">
                    <Card style={{ margin: "70px", marginTop: "20px" }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ bgcolor: red[500] }}
                            aria-label="recipe"
                          >
                            <img width="100%" src={imageUrl} />
                          </Avatar>
                        }
                        title={
                          data.refOfUser.firstname +
                          " " +
                          data.refOfUser.lastname
                        }
                        subheader={"Reviewed on data: " + data.createdAt}
                      />
                      <Rating
                        style={{
                          alignSelf: "end",
                          marginTop: "-24px",
                          marginLeft: "70px",
                        }}
                        name="text-feedback"
                        value={data.rating}
                        readOnly
                        precision={0.5}
                      />

                      <CardContent>
                        <p style={{ marginLeft: "20px" }}>{data.review}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
  // }
}

export default SelectedProductDetails;
