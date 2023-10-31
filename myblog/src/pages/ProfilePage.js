import { Button, Container, Divider, Grid, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import TopNavBar from './TopNavBar';
import * as AllServices from '../services/AllServices';
import AuthContext from '../services/AuthContext';

export const UserProfile = () => {
  const location = useLocation(); // Get the current location
  const [userExist, setUserExist] = useState(false);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await AllServices.getUserProfile();
      const isfound = response.find(item => item.user === user.user_id);
      if (isfound) {
        setUserExist(true);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  return (
    <>
      <TopNavBar />
      <Container maxWidth="lg">
        <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
          <Grid item xs={3}>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/profile/view-profile"
                  sx={{
                    backgroundColor: location.pathname === '/profile/view-profile' ? '#9575DE' : 'transparent',
                    color: location.pathname === '/profile/view-profile' ? 'white' : 'inherit',
                  }}
                >
                  <ListItemText primary="View Profile" />
                </ListItemButton>
              </ListItem>
              {
                userExist ? (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/profile/update-profile"
                      sx={{
                        backgroundColor: location.pathname === '/profile/update-profile' ? '#9575DE' : 'transparent',
                        color: location.pathname === '/profile/update-profile' ? 'white' : 'inherit',
                      }}
                    >
                      <ListItemText primary="Update Profile" />
                    </ListItemButton>
                  </ListItem>
                ) :(
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/profile/my-profile"
                      sx={{
                        backgroundColor: location.pathname === '/profile/my-profile' ? '#9575DE' : 'transparent', // Change background color for the active item
                        color: location.pathname === '/profile/my-profile' ? 'white' : 'inherit', // Change text color for the active item
                      }}
                    >
                      <ListItemText primary="My Profile" />
                    </ListItemButton>
                  </ListItem>
                )
              }
            </List>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={7}>
            <Outlet></Outlet>
          </Grid>
        </Grid>
      </Container >
    </>
  );
}

