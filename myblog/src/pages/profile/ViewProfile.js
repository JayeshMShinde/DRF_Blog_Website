import { Avatar, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../services/AuthContext';
import * as AllServices from '../../services/AllServices';

const styles = {
    paper: {
        padding: '2rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    avatar: {
        width: 100,
        height: 100,
        marginBottom: '1rem',
    },
    loader: {
        margin: '2rem auto',
    },
    name: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    bio: {
        fontSize: '1rem',
    },
    website: {
        fontSize: '1rem',
        color: 'blue',
    },
};

export const ViewProfile = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState({});
    const [user_name, setUsername] = useState([]);

    useEffect(() => {
        fetchUserData();
        getuser();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await AllServices.getUserProfile();
            const userProfile = response.find(item => item.user === user.user_id);

            if (userProfile) {
                setUserData(userProfile);
            }
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const getuser = async () => {
        let users = await AllServices.get_register_user();
        setUsername(users);
    };

    const userName_author = (author_id) => {
        const user = user_name.find(user => user.id === author_id);
        if (user) {
            return user.first_name + ' ' + user.last_name;
        }
        return author_id;
    };

    return (
        <div>
            <Paper id="my-profile" sx={styles.paper}>
                {userData ? (
                    <>
                        <Avatar
                            alt={user.username}
                            src={userData.image || '/default-profile-image.jpg'}
                            sx={styles.avatar}
                        />
                        <Typography variant="h5" sx={styles.name}>
                            <strong>{userName_author(userData.user)}</strong>
                        </Typography>
                        <Typography variant="body1" sx={styles.bio}>
                            {userData.bio}
                        </Typography>
                        <Typography variant="body1" component="a" href={userData.website} sx={styles.website}>
                            {userData.website}
                        </Typography>
                    </>
                ) : (
                    <>
                        <div style={styles.loader}>
                            <CircularProgress color="primary" />
                        </div>
                    </>
                )}
            </Paper>
        </div>
    );
};
