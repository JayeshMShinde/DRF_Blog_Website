import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LoginPage from "./Login/LoginPage";
import { Link } from "react-router-dom";
import { ButtonGroup } from "@mui/material";
import AuthContext from "../services/AuthContext";
import userimg from "../Static/images/user.png";
import SignUpPage from "./Login/SignUpPage";
import * as AllServices from "../services/AllServices";

const pages = ["Blog"];

function TopNavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRegister, setUserRegister] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("Home");
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  const { logoutUser } = useContext(AuthContext);
  useEffect(() => {
    // Check if the user is logged in using your authentication logic
    const isLoggedIn = localStorage.getItem("authTokens") ? true : false;
    setUserLoggedIn(isLoggedIn);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await AllServices.getUserProfile();
      const userProfile = response.find((item) => item.user === user.user_id);

      if (userProfile) {
        setUserData(userProfile);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };

  const handleLogin = () => {
    setUserLoggedIn(true);
    closeLoginModal();
  };

  const handleSignup = () => {
    setUserRegister(true);
    closeLoginModal();
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#2B2730  ",
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
                color: "#9575DE",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Gabarito",
                fontWeight: 600,
                letterSpacing: ".2rem",
                color: "inherit",
                textDecoration: "none",
                color: "#9575DE",
              }}
            >
              BLOG
            </Typography>

            <Box
              sx={{
                flexGrow: 2,
                fontFamily: "Gabarito",
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      component={Link}
                      to={`/${page}`}
                      sx={{
                        my: 2,
                        color: "white",
                        color: "#9575DE",
                        fontWeight: "bold",
                        alignContent: "center",
                        fontFamily: "Gabarito",
                        textDecoration:"none",
                      }}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'Gabarito',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            BLOG
                        </Typography> */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  color: "#9575DE",
                  fontWeight: "bold",
                  alignContent: "center",
                  fontFamily: "Gabarito",
                }}
                component={Link}
                to="/"
                onClick={() => setActiveButton("Home")}
              >
                Home
              </Button>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  color: "#9575DE",
                  fontWeight: "bold",
                  alignContent: "center",
                  fontFamily: "Gabarito",
                }}
                component={Link}
                to="/blog"
                onClick={() => setActiveButton("Blog")}
              >
                Blog
              </Button>
            </Box>

            {userLoggedIn ? (
              <Box sx={{ display: { xs: "flex" } }}>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, height: "50px", width: "50px" }}
                  >
                    <Avatar
                      alt="user"
                      sx={{ bgcolor: "#E966A0" }}
                      src={userData.image}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <ButtonGroup
                      orientation="vertical"
                      aria-label="vertical contained button group"
                      variant="text"
                    >
                      <Button
                        sx={{ color: "white", fontFamily: "Gabarito" }}
                        component={Link}
                        to="/profile"
                      >
                        My Profile
                      </Button>
                      <Button
                        sx={{ color: "white", fontFamily: "Gabarito" }}
                        component={Link}
                        to="/add-blog"
                      >
                        Add Blog
                      </Button>
                      <Button
                        sx={{ color: "white", fontFamily: "Gabarito" }}
                        component={Link}
                        to="/my-blog"
                      >
                        View My Blog
                      </Button>
                      <Button
                        sx={{ color: "white", fontFamily: "Gabarito" }}
                        onClick={logoutUser}
                      >
                        Logout
                      </Button>
                    </ButtonGroup>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Button
                  sx={{ my: 2, color: "white", fontFamily: "Gabarito" }}
                  onClick={openLoginModal}
                >
                  Login
                </Button>
                &nbsp;
                <Button
                  sx={{ my: 2, color: "white", fontFamily: "Gabarito" }}
                  onClick={openSignupModal}
                >
                  Signup
                </Button>
              </>
            )}
            <LoginPage
              open={loginModalOpen}
              onClose={closeLoginModal}
              onLogin={handleLogin}
            />

            <SignUpPage
              open={signupModalOpen}
              onClose={closeSignupModal}
              onLogin={handleSignup}
            />
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default TopNavBar;
