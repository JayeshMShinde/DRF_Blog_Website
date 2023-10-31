// import React, { useEffect, useState } from "react";
// import {
//     AppBar,
//     Box,
//     Drawer,
//     IconButton,
//     Toolbar,
//     Typography,
//     MenuItem,
//     Menu,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { Link, NavLink } from "react-router-dom";
// import "../../Style/HeaderStyles.css";
// import Logo from '../../images/shreelogo.jpg';
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [user, setUser] = useState(""); 
//     const [anchorEl, setAnchorEl] = useState(null); 
//     const [anchorElservice, setAnchorElservice] = useState(null); 
//     const navigate = useNavigate();
//     // Handle menu click
//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };
//     // Handle user greeting click
//     const handleUserClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleUserClickService = (event) => {
//         setAnchorElservice(event.currentTarget);
//     };

//     // Handle menu close
//     const handleMenuClose = () => {
//         setAnchorEl(null);
//         setAnchorElservice(null);
//     };

//     const handleSignOut = () => {
//         // Your signout logic here
//         console.log(localStorage.getItem("username"));
//         localStorage.removeItem("username"); // Remove user from local storage
//         setUser(""); // Clear user state
//         handleMenuClose();
//         navigate("/signin");
//     };

//     // Check if user is logged in
//     const isLoggedIn = user !== "";

//     useEffect(() => {
//         // Retrieve user data from local storage on component mount
//         const storedUser = localStorage.getItem("username");
//         if (storedUser) {
//             setUser(storedUser);
//         }
//     }, []);

//     return (
//         <>
//             <Box>
//                 <AppBar component={"nav"} sx={{ bgcolor: "#333333" }}>
//                     <Toolbar>
//                         <IconButton
//                             color="inherit"
//                             aria-label="open drawer"
//                             edge="start"
//                             sx={{
//                                 mr: 2,
//                                 display: { sm: "none" },
//                             }}
//                             onClick={handleDrawerToggle}
//                         >
//                             <MenuIcon />
//                         </IconButton>
//                         <Typography
//                             color={"white"}
//                             variant="body2"
//                             component="div"
//                         >
//                             <div className="circle-image">
//                                 <img src={Logo} alt="logo" />
//                                 &nbsp;

//                             </div>
//                         </Typography>
//                         <Typography
//                             color={"white"}
//                             variant="h6"
//                             component="div"
//                             sx={{ flexGrow: 1, fontFamily: "Caveat Brush" }}
//                         >
//                             &nbsp;
//                             Blog
//                         </Typography>
//                         <Box sx={{ display: { xs: "none", sm: "block" } }}>
//                             <ul className="navigation-menu">
//                                 <li>

//                                     {
//                                         isLoggedIn ? (
//                                             <NavLink activeClassName="active" to={"/admin/dashboard"}>
//                                                 Dashboard
//                                             </NavLink>
//                                         ) : (
//                                             <NavLink activeClassName="active" to={"/"}>
//                                                 Home
//                                             </NavLink>
//                                         )
//                                     }
//                                 </li>
//                                 <li>
//                                     {isLoggedIn ? (
//                                         <div>
//                                             <Typography
//                                                 variant="body1"
//                                                 onClick={handleUserClick}
//                                                 style={{ cursor: "pointer" }}
//                                             >
//                                                 Hello, {user}
//                                             </Typography>
//                                             <Menu
//                                                 anchorEl={anchorEl}
//                                                 open={Boolean(anchorEl)}
//                                                 onClose={handleMenuClose}
//                                             >
//                                                 <MenuItem onClick={handleMenuClose}>
//                                                     Profile
//                                                 </MenuItem>
//                                                 <MenuItem onClick={handleSignOut}>
//                                                     Sign Out
//                                                 </MenuItem>
//                                             </Menu>
//                                         </div>
//                                     ) : (
//                                         <NavLink to={"/signin"}>Login/Sign up</NavLink>
//                                     )}
//                                 </li>
//                             </ul>
//                         </Box>
//                     </Toolbar>
//                 </AppBar>
//             </Box>
//         </>
//     );
// };

// export default Header;
