import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './../ScreensCss/SelectedUser.css';
import axios from 'axios';
import CartProvider from './../contextApi';
import LeftDrawer from './LeftDrawer';
import { Link } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

function SelectedUserDetails() {
  const location = useLocation();
  const { user } = location.state;
  const [getProductFromBackend, setProductFromBackend] = useState({});

  const { cookies, setCookie } = useContext(CartProvider);
  const url = '/Backend/public/images/users/' + user.photo;

  const getData = () => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .get(`http://localhost:3000/product/shopOwnerProducts/${user._id}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setProductFromBackend(res.data.data);

        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  React.useEffect(() => {
    getData();
    console.log('Hello');
  }, []);
  if (user.role === 'shopOwner') {
    if (Object.keys(getProductFromBackend).length === 0) {
      return (
        <div>
          <p>Please wait</p>
        </div>
      );
    } else {
      return (
        <div className="topContainer" style={{ display: 'flex' }}>
          <LeftDrawer />
          <div style={{ width: '100%' }}>
            <div className="UserImage">
              <img className="Image" src={url} alt="No photo" />
            </div>
            <div>
              <h1>Details</h1>
              <p>
                Name: {user.firstname} {user.lastname}
              </p>
              <p>Role: {user.role}</p>
              <p>Email: {user.email}</p>
              <h1>Products</h1>
              <div class="row">
                {getProductFromBackend.map((data) => {
                  const imageUrl =
                    '/Backend/public/images/products/' + data.imageCover;
                  console.log(imageUrl);
                  return (
                    <div class="col-xl-3 col-md-6 col-sm-12">
                      <Link
                        to="/AllProducts/SelectedProductDetails"
                        state={{ product: data }}
                        className="boxLowerTextLink"
                        style={{ color: 'white' }}
                      >
                        <Card style={{ margin: '40px', marginTop: '20px' }}>
                          <CardMedia
                            component="img"
                            height="194"
                            image={imageUrl}
                            alt="Paella dish"
                          />
                          <CardContent>
                            <p>{data.title}</p>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {data.description}
                              </Typography>
                              <Rating
                                style={{ alignSelf: 'end', marginTop: '-24px' }}
                                name="text-feedback"
                                value={data.ratingsAverage}
                                readOnly
                                precision={0.5}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="topContainer" style={{ display: 'flex' }}>
        <LeftDrawer />
        <div style={{ width: '100%' }}>
          <div className="UserImage">
            <img className="Image" src={url} alt="No photo" />
          </div>
          <div>
            <h1>Details</h1>
            <p>
              Name: {user.firstname} {user.lastname}
            </p>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectedUserDetails;
