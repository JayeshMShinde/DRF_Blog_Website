import * as AllServices from "../../services/AllServices";
import React, { useContext, useEffect, useRef, useState } from 'react';
import TopNavBar from '../TopNavBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { baseUrl } from '../../utils/useAxios';
import axiosInstance from '../../utils/axiosInstance';
import { Container, Grid, Paper } from '@mui/material';
import blogimg from '../../Static/images/blog.svg';
import { Link } from 'react-router-dom';
import LoadingBar from "react-top-loading-bar";
import BlogContext from "../../services/blog/BlogContext";

export const BlogPage = () => {
  const ref = useRef(null)
  // const { blog, setBlog } = useContext(BlogContext);
  const [blog, setBlog] = useState([]);
  const [user_name, setUsername] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {

    setTimeout(() => {
      setProgress(100); 
      getBlogs();
      getuser();
    }, 1000);
  }, []);

  const getuser = async () => {
    let usr = await AllServices.get_register_user();
    setUsername(usr);
  };

  const getBlogs = async () => {
    try {
      const resp = await axiosInstance.get(baseUrl + '/api/post/');
      const data = resp.data;

      if (resp.status === 200) {
        setBlog(data);
      } else {
        console.error('Received a non-200 status code:', resp.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const userName_author = (author_id) => {
    for (let i = 0; i < user_name.length; i++) {
      if (author_id === user_name[i].id) {
        return user_name[i].first_name + ' ' + user_name[i].last_name;
      }
    }
    return author_id;
  };

  const containerStyle = {
    padding: '12px',
  };

  const cardStyle = {
    display: 'flex',
    marginBottom: '1px',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.3s',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    },
  };

  const cardMediaStyle = {
    width: 200,
    backgroundSize: 'cover',
  };

  const cardContentStyle = {
    flex: 1,
    padding: '16px',
  };

  const buttonStyle = {
    color: '#9575DE',
    fontWeight: 'bold',
  };

  return (
    <div style={{
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#EEEEEE',
      minHeight: '100vh'
    }} >
      <LoadingBar
        color='#E966A0'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      
      <TopNavBar />
      <Container style={containerStyle}>
        <Grid container spacing={2}>
          {blog.map((blogItem, index) => (
            <Grid item xs={12} md={12} key={blogItem.id}>
              <Card style={cardStyle} component={Paper}>
                <CardMedia
                  component="img"
                  style={cardMediaStyle}
                  image={blogimg}
                  alt="Blog Image"
                />
                <CardContent style={cardContentStyle}>
                  <Typography variant="h6" gutterBottom>
                    {blogItem.title}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    By {userName_author(blogItem.author)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {blogItem.date}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {blogItem.excerpt}
                  </Typography>
                  <Link to={`/blog/${blogItem.slug}`} style={{ textDecoration: 'none' }}>
                    <Button style={buttonStyle} size="small">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

