import React from 'react'
import TopNavBar from './TopNavBar';
import { Typography, Button, Box, Grid, Paper } from '@mui/material';
import bg_blog from '../Static/images/bg_blog.avif'
import { Footer } from './Footer';

export const HomePage = () => {
  const boxStyles = {
    textAlign: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'transparent',
    minHeight: '80vh',
    width: '100vh', 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#E5CFF7',
    minHeight: '80vh',
    position: 'relative', 
  };
  return (

    <>
      <TopNavBar />
      <div
        style={containerStyles}
      >
        <div style={boxStyles}>
          <Typography variant="h2" component="h1" sx={{ color: '#6554AF' }}>
            <strong> Welcome to the Blogger</strong>
          </Typography>
          <Typography variant="body2" component="p" style={{ marginTop: '16px' }}>
            This is a blogging platform where you can share your thoughts and ideas with others.
          </Typography>
          <Button variant="contained" component="a" href="/blog" style={{ marginTop: '16px', backgroundColor: '#6554AF' }}>
            Get Started
          </Button>
        </div>
      </div>
      <Grid container spacing={3} style={{ padding: '24px' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center', backgroundColor: '#9575DE', color: 'white' }}>
            <Typography variant="h4" component="h2">
              Discover Blogs
            </Typography>
            <Typography variant="body2" component="p" style={{ marginTop: '8px' }}>
              Explore a wide range of blogs on various topics.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center', backgroundColor: '#2B2730', color: 'white' }}>
            <Typography variant="h4" component="h2">
              Share Your Ideas
            </Typography>
            <Typography variant="body2" component="p" style={{ marginTop: '8px' }}>
              Write and share your own thoughts with the community.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center', backgroundColor: '#9575DE', color: 'white' }}>
            <Typography variant="h4" component="h2">
              Join the Community
            </Typography>
            <Typography variant="body2" component="p" style={{ marginTop: '8px' }}>
              Connect with like-minded bloggers and readers.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
