import { Avatar, Box, Button, Card, CardHeader, Modal, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import * as AllServices from "../../services/AllServices";
import { useParams } from 'react-router-dom';
import BlogContext from '../../services/blog/BlogContext';

export const Follower = ({ followers, open, handleClose }) => {
    const params = useParams();
    const {blog, setBlog} = useContext(BlogContext);
    const [followerList, setFollowerList] = useState([]);
    const [userData, setUserData] = useState([]);
    const [user_name, setUsername] = useState([]);

    useEffect(() => {
        getBlog_by_slug();
        getuser();
    }, []);

    useEffect(() => {
        if(blog){
            getFollowersList();
        }
    }, [blog]);

    const getBlog_by_slug = async () => {
        try {
            let response = await AllServices.getBlogBySlug(params.slug);
            setBlog(response);
            // getFollowersList();
        }
        catch (error) {
            alert('Error: ', error);
        }
    }

    const getFollowersList = () => {
        const updatedFollowerList = [];
        console.log("followers:", followers);
        followers.forEach((item) => {
            if (item.user === blog.author) {
                for (let i = 0; i < item.followers.length; i++) {
                    if (item.followers[i] !== blog.author) {
                        updatedFollowerList.push(item.followers[i]);
                    }
                }
            }
        });
        // console.log("updatedFollowerList:", updatedFollowerList);
        setFollowerList(updatedFollowerList);
        fetchUserData();
    };

    const fetchUserData = async () => {
        try {
            const response = await AllServices.getUserProfile();
            const user_data = response.filter((userProfile) => {
                return followerList.includes(userProfile.user);
            });
            setUserData(user_data);
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const getuser = async () => {
        let users = await AllServices.get_register_user();
        setUsername(users);
    };

    const userName_author = (author_id) => {
        const _user = user_name.find(user => user.id === author_id);
        if (_user) {
            return _user.first_name + ' ' + _user.last_name;
        }
        return author_id;
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="follower-modal-title"
                aria-describedby="follower-modal-description"
            >
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        p: 2,
                        borderRadius: '10px',
                    }}
                >
                    <Typography variant="h6" id="follower-modal-title" sx={{ marginBottom: 2 }}>
                        <strong>Followers</strong>
                    </Typography>
                    <Box>
                        {userData.map((user, index) => (
                            <Card
                                key={index}
                                sx={{
                                    marginBottom: 2,
                                    borderRadius: '10px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            alt={user.username}
                                            src={user.image || '/default-profile-image.jpg'}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                marginRight: 2,
                                            }}
                                        />
                                    }
                                    title={
                                        <Typography variant="h6">
                                            {userName_author(user.user)}
                                        </Typography>
                                    }
                                />
                            </Card>
                        ))}
                    </Box>
                    <Button variant="contained" onClick={handleClose} sx={{ marginTop: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};
