import React from 'react';
import TopNavBar from '../TopNavBar';
import { Container, Divider, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const MyBlogPage = () => {
    const location = useLocation();
    return (
        <div style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#F1F3E7',
            minHeight: '100vh',  
        }}>
            <TopNavBar />
            <Container maxWidth="lg">
                <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
                    <Grid item xs={3}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to="/my-blog/my-post"
                                    sx={{
                                        backgroundColor: location.pathname === '/my-blog/my-post' ? '#9575DE' : 'transparent', // Change background color for the active item
                                        color: location.pathname === '/my-blog/my-post' ? 'white' : 'inherit', // Change text color for the active item
                                    }}
                                >
                                    <ListItemText primary="My post" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={8}>
                        <Outlet></Outlet>
                    </Grid>
                </Grid>
            </Container >
        </div>
    );
};
