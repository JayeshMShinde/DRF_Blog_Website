import { Card, CardContent, CardMedia, Grid, IconButton, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import * as AllServices from "../../services/AllServices";
import { baseUrl } from '../../utils/useAxios';
import blogimg from '../../Static/images/blog.svg';
import AuthContext from '../../services/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlogContext from '../../services/blog/BlogContext';

export const MyPost = () => {
    const {blog, setBlog} = useContext(BlogContext);
    const [user_name, setUsername] = useState([]);
    const { user } = useContext(AuthContext)

    useEffect(() => {
        getBlogs();
        getuser();
    }, []);

    const getuser = async () => {
        let usr = await AllServices.get_register_user();
        setUsername(usr);
    };

    const getBlogs = async () => {
        try {
            let resp = await axiosInstance.get(baseUrl + '/api/post/');
            let data = resp.data;

            if (resp.status === 200) {
                const userBlogs = data.filter(blogItem => blogItem.author === user.user_id);
                setBlog(userBlogs);
                console.log(userBlogs);
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

    const handleDelete = async (post_slug) => {
        console.log(post_slug);
        let resp = await AllServices.deletePost(post_slug);
        getBlogs();
    }

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


    return (
        <div>
            {blog.map((blogItem, index) => (
                <>
                    <Grid item xs={12} md={12} key={blogItem.pk}>
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
                                <IconButton component={Link} to={`/edit-blog/${blogItem.slug}`}>
                                    <EditIcon fontSize='small' sx={{ color: '#6554AF' }} />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(blogItem.slug)}>
                                    <DeleteForeverIcon fontSize='small' sx={{ color: '#E966A0' }} />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                    <br />
                </>
            ))}

        </div>
    )
}
