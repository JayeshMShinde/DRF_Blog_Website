import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  ButtonGroup,
  Breadcrumbs, // Import the Alert component
} from "@mui/material";
import { baseUrl } from "../../utils/useAxios";
import axiosInstance from "../../utils/axiosInstance";
import TopNavBar from "../TopNavBar";
import { Link, useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import { Textarea } from "@mui/joy";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../../services/AuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import * as AllServices from "../../services/AllServices";
import userimg from "../../Static/images/user.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { format } from "date-fns";
import { Follower } from "./Follower";
import { Following } from "./Following";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const BlogDetails = () => {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [user_name, setUsername] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [dislikedByCurrentUser, setDislikedByCurrentUser] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [followingcnt, setFollowingCount] = useState(0);
  const [followercnt, setFollowerCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);


  useEffect(() => {
    getBlogBySlug();
    getuser();
  }, [params.slug]);

  useEffect(() => {
    const isFollowingAuthor = () => {
      if (blog && user) {
        const userFollowingData = following.find(
          (item) => item.user === blog.author
        );

        if (userFollowingData) {
          return userFollowingData.following_user.includes(user.user_id);
        }
      }
      return false;
    };

    setIsFollowing(isFollowingAuthor());
  }, [blog, following, user]);

  useEffect(() => {
    if (blog) {
      axiosInstance
        .get(`${baseUrl}/api/followers/`)
        .then((response) => {
          setFollowers(response.data);
          const dt = response.data
          getFollowerCount();
        })
        .catch((error) => {
          console.error(error);
        });
      axiosInstance
        .get(`${baseUrl}/api/following/`)
        .then((response) => {
          setFollowing(response.data);
          getFollowingCount();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blog]);

  const getFollowerCount = async () => {
    try {
      if (blog) {
        const response = await axiosInstance.get(`${baseUrl}/api/followers/`);
        setFollowers(response.data);
        const followerCount = response.data.reduce((total, item) => {
          let cnt = 0;

          if (item.user === blog.author) {
            for (let i = 0; i < item.followers.length; i++) {
              if (item.followers[i] !== blog.author) {
                cnt = cnt + 1;
              }
            }
          }

          return total + cnt;
        }, 0);
        setFollowerCount(followerCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFollowingCount = async () => {
    try {
      if (blog) {
        const response = await axiosInstance.get(`${baseUrl}/api/following/`);
        setFollowing(response.data);

        const followingCount = response.data.reduce((total, item) => {
          let cnt = 0;
          if (item.user === blog.author) {
            for (let i = 0; i < item.following_user.length; i++) {
              if (item.following_user[i] !== blog.author) {
                cnt = cnt + 1;
              }
            }
          }
          return total + cnt;
        }, 0);
        setFollowingCount(followingCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = () => {
    if (blog.author === user.user_id) {
      alert("You can't follow yourself");
    }
    else {
      const followData = {
        user_id: blog.author,
        following_id: user.user_id,
      };
      axiosInstance
        .post(`${baseUrl}/api/follow/${blog.author}/`, followData)
        .then((response) => {
          setIsFollowing(true);
          getFollowingCount();

        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleUnfollow = () => {
    const followData = {
      user_id: blog.author,
      following_id: user.user_id,
    };
    axiosInstance
      .post(`${baseUrl}/api/unfollow/${blog.author}/`, followData)
      .then((response) => {
        setIsFollowing(false);
        getFollowingCount();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getBlogBySlug = async () => {
    try {
      const resp = await axiosInstance.get(
        baseUrl + `/api/post/${params.slug}/`
      );
      const data = resp.data;

      if (resp.status === 200) {
        let dt = data.pk;
        setBlog(data);
        getComments(dt);
        getLikeDislikeCounts(dt);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getComments = async (dt) => {
    try {
      const resp = await axiosInstance.get(
        baseUrl + `/api/blog-wise-comment/${dt}/`
      );
      const data = resp.data;
      if (resp.status === 200) {
        setComments(data);
        setCommentCount(data.length);
      } else {
        return (
          <Alert severity="error">Failed to get comments for this post</Alert>
        );
      }
    } catch (e) {
      return <Alert severity="error">Error: {e}</Alert>;
    }
  };

  const getuser = async () => {
    let usr = await AllServices.get_register_user();
    setUsername(usr);
  };

  const userName_author = (author_id) => {
    for (let i = 0; i < user_name.length; i++) {
      if (author_id === user_name[i].id) {
        return user_name[i].first_name + " " + user_name[i].last_name;
      }
    }
    return author_id;
  };

  const addComment = async () => {
    try {
      let slug = params.slug;
      var comdata = {
        comment: comment,
        user: user.user_id,
        post: blog.pk,
      };

      let response = await AllServices.Add_comment(comdata);
      getComments(blog.pk);
      cleatData();
    } catch (err) {
      return <Alert severity="error">Error while posting Comment</Alert>;
    }
  };

  const cleatData = () => {
    setComment("");
  };

  const getLikeDislikeCounts = async (id) => {
    try {
      const resp = await axiosInstance.get(
        baseUrl + `/api/blog-like-count/${id}/`
      );
      if (resp.status === 200) {
        const data = resp.data;
        setLikeCount(data.like_count);
        setDislikeCount(data.dislike_count);

        // Check if the current user has previously liked or disliked the post
        if (user) {
          setLikedByCurrentUser(data.liked_by_current_user);
          setDislikedByCurrentUser(data.disliked_by_current_user);
        }
      } else {
        return (
          <Alert severity="error">Failed to fetch like/dislike counts</Alert>
        );
      }
    } catch (error) {
      return (
        <Alert severity="error">
          Error fetching like/dislike counts: {error}
        </Alert>
      );
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await AllServices.likePost(postId, "like");

      if (response && response.status === 201) {
        setLikeCount(likeCount + 1);

        // Check if the user previously disliked the post
        if (dislikedByCurrentUser) {
          setDislikeCount(dislikeCount - 1);
        }

        // Update the likedByCurrentUser state
        setLikedByCurrentUser(true);

        // If the user previously liked the post, reset likedByCurrentUser
        if (likedByCurrentUser) {
          setLikedByCurrentUser(false);
        }
      } else if (response && response.status === 400) {
        return <Alert severity="error">You have already liked this post</Alert>;
      }
    } catch (error) {
      return (
        <Alert severity="error">
          Error while liking the blog post: {error}
        </Alert>
      );
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await AllServices.likePost(postId, "dislike");

      if (response && response.status === 201) {
        setDislikeCount(dislikeCount + 1);

        // Check if the user previously liked the post
        if (likedByCurrentUser) {
          setLikeCount(likeCount - 1);
        }

        // Update the dislikedByCurrentUser state
        setDislikedByCurrentUser(true);

        // If the user previously disliked the post, reset dislikedByCurrentUser
        if (dislikedByCurrentUser) {
          setDislikedByCurrentUser(false);
        }
      } else if (response && response.status === 400) {
        return (
          <Alert severity="error">You have already disliked this post</Alert>
        );
      }
    } catch (error) {
      return (
        <Alert severity="error">
          Error while disliking the blog post: {error}
        </Alert>
      );
    }
  };

  const handleOpenFollowers = () => {
    setShowFollowersModal(true);
  };

  const handleCloseFollowers = () => {
    setShowFollowersModal(false);
  };

  const handleOpenFollowing = () => {
    setShowFollowingModal(true);
  };

  const handleCloseFollowing = () => {
    setShowFollowingModal(false);
  };

  return (
    <>
      <TopNavBar />
      <Box
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#F1F3E7",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              padding: "2rem",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {blog ? (
              <div>
                <Breadcrumbs
                  separator={<NavigateNextIcon fontSize="small" />}
                  aria-label="breadcrumb"
                >
                  <Link color="inherit" href="/blog" style={{ textDecoration: 'none' , color:'grey'}}>
                    Blog
                  </Link>
                  <Typography color="textPrimary" sx ={{color:'grey'}}>{blog.title}</Typography>
                </Breadcrumbs>

                <Typography
                  variant="h2"
                  align="center"
                  sx={{
                    marginBottom: "1rem",
                    color: "#2B2730",
                    fontWeight: "bold",
                  }}
                >
                  {blog.title}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "1rem",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "#6554AF", fontWeight: "bold" }}
                  >
                    <i>
                      Posted on{" "}
                      {format(new Date(blog.timestamp), "MMMM d, yyyy")} By{" "}
                      {userName_author(blog.author)}
                    </i>
                  </Typography>
                  <div style={{ margin: 'auto', marginRight: 0 }}>
                    <ButtonGroup variant="text" aria-label="text button group">
                      <Button sx={{ color: '#6554AF' }} onClick={handleOpenFollowers}>
                        Followers {followercnt}
                      </Button>
                      <Button sx={{ color: '#6554AF' }} onClick={handleOpenFollowing}>
                        Following {followingcnt}
                      </Button>
                    </ButtonGroup>

                    {isFollowing ? (
                      <Button sx={{ mr: 1 }} variant="text" onClick={handleUnfollow}>
                        Unfollow
                      </Button>
                    ) : (
                      <Button variant="outlined" onClick={handleFollow}>
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
                <Divider fullWidth />
                <Typography
                  variant="body1"
                  sx={{ marginTop: "2rem", color: "#2B2730" }}
                >
                  <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                </Typography>
                {user ? (
                  <Box
                    sx={{
                      marginTop: "2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      sx={{ color: "#E966A0" }}
                      onClick={() => handleLike(blog.pk)}
                    >
                      <ThumbUpIcon /> &nbsp;
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        {likeCount}
                      </Typography>
                    </IconButton>
                    <IconButton
                      sx={{ color: "#2B2730" }}
                      onClick={() => handleDislike(blog.pk)}
                    >
                      <ThumbDownIcon /> &nbsp;
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        {dislikeCount}
                      </Typography>
                    </IconButton>
                  </Box>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ marginBottom: "2rem" }}
                >
                  <CircularProgress sx={{ color: "#2B2730" }} />
                </Typography>
              </div>
            )}
          </Paper>
          <br />
          <Paper
            sx={{
              padding: "2rem",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {blog && user ? (
              <div style={{ color: "#6554AF" }}>
                <Typography
                  variant="h4"
                  sx={{
                    marginBottom: "2rem",
                    display: "flex",
                    alignItems: "center",
                    color: "#6554AF",
                  }}
                >
                  <CommentIcon fontSize="large" /> &nbsp;Comment ({commentCount}
                  )
                </Typography>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="comment-panel"
                    id="comment-header"
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#6554AF",
                        fontWeight: "bold",
                      }}
                    >
                      <RemoveRedEyeIcon fontSize="small" />
                      &nbsp;View Comments
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {comments.map((comment_data) => (
                      <Card key={comment_data.id} sx={{ marginBottom: 1 }}>
                        <CardContent sx={{ color: "#6554AF" }}>
                          <Grid container spacing={1}>
                            <Grid
                              item
                              xs={2}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <Avatar
                                sx={{
                                  width: 50,
                                  height: 50,
                                  alignItems: "center",
                                }}
                                src={userimg}
                                alt="user"
                              />
                            </Grid>
                            <Grid item xs={10}>
                              <div className="comment-header">
                                {comment_data.user ? (
                                  <>
                                    <Typography
                                      variant="subtitle2"
                                      component="span"
                                      sx={{
                                        fontWeight: "bold",
                                        display: "inline-block",
                                        bgcolor: "grey",
                                        color: "white",
                                        borderRadius: 3,
                                        px: 2,
                                      }}
                                    >
                                      {formatDistanceToNow(
                                        new Date(comment_data.timestamp),
                                        {
                                          addSuffix: true,
                                        }
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {(() => {
                                        for (
                                          let i = 0;
                                          i < user_name.length;
                                          i++
                                        ) {
                                          if (
                                            comment_data.user ===
                                            user_name[i].id
                                          ) {
                                            return user_name[i].username;
                                          }
                                        }
                                        return comment_data.user; // If no match is found
                                      })()}
                                    </Typography>
                                  </>
                                ) : (
                                  <Typography variant="subtitle1">
                                    User not found
                                  </Typography>
                                )}
                              </div>
                              <div className="comment-body">
                                <Typography
                                  variant="body1"
                                  sx={{ fontStyle: "italic" }}
                                >
                                  {comment_data.comment}
                                </Typography>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </AccordionDetails>
                </Accordion>
                <br />
                <Textarea
                  minRows={5}
                  placeholder="Enter your comment..."
                  variant="soft"
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ marginBottom: "16px" }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ marginBottom: "20px", backgroundColor: "#6554AF" }}
                  onClick={addComment}
                >
                  Post A Comment
                </Button>
              </div>
            ) : (
              <div>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ marginBottom: "2rem" }}
                >
                  <CircularProgress color="success" />
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ marginBottom: "2rem" }}
                >
                  <Alert severity="info">Please login to post a comment!</Alert>
                </Typography>
              </div>
            )}
          </Paper>
          <br />
        </Container>
      </Box>
      {followers?.length > 0 ? (
        <Follower
          followers={followers}
          open={showFollowersModal}
          handleClose={handleCloseFollowers}
        />
      ) : (
        <></>
      )

      }
      {following?.length > 0 ? (
        <Following
          following={following}
          open={showFollowingModal}
          handleClose={handleCloseFollowing}
        />
      ) : (
        <></>
      )}



    </>
  );
};