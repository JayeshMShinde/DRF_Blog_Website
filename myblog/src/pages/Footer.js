import React from 'react';
import { Typography, Container, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const Footer = () => {
    const footerStyle = {
        backgroundColor: '#333', // Background color for the footer
        color: 'white', // Text color
        padding: '20px 0', // Add padding to the top and bottom
    };

    const linkButtonStyle = {
        textTransform: 'none', // Remove uppercase styling from the button text
        color: 'white',
        '&:hover': {
            textDecoration: 'underline', // Underline text on hover
        },
    };

    return (
        <div style={footerStyle}>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" color="primary" sx={{color:'#9575DE'}}>
                            About Us
                        </Typography>
                        <Typography variant="body2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula lacinia metus, at dignissim.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6" color="primary" sx={{color:'#9575DE'}}>
                            Quick Links
                        </Typography>
                        <Typography variant="body2">
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                <li>
                                    <Button style={linkButtonStyle} component='a' href="/">Home</Button>
                                </li>
                                <li>
                                    <Button style={linkButtonStyle}>Services</Button>
                                </li>
                                <li>
                                    <Button style={linkButtonStyle} component='a' href="/blog" >Blog</Button>
                                </li>
                                <li>
                                    <Button style={linkButtonStyle}>Contact</Button>
                                </li>
                            </ul>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" color="primary" sx={{color:'#9575DE'}}>
                            Contact Us
                        </Typography>
                        <Typography variant="body2">
                            <address>
                                123 Main Street<br />
                                City, Country 12345<br />
                                Email: example@example.com<br />
                                Phone: +1 (123) 456-7890
                            </address>
                        </Typography>
                    </Grid>
                </Grid>
                <div style={{ marginTop: '20px', borderTop: '1px solid #555', paddingTop: '10px', color:'white'}}>
                    <Typography variant="body2" color="textSecondary" align="center" sx={{color:'white'}}>
                        &copy; {new Date().getFullYear()} Your Website. All Rights Reserved.
                    </Typography>
                </div>
            </Container>
        </div>
    );
};

