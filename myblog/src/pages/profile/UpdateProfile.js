import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../services/AuthContext';
import * as AllServices from '../../services/AllServices';
import { Button, Paper, TextField, Typography, Avatar } from '@mui/material';
import { FormControl, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const styles = {
    paper: {
        padding: '2rem',
        backgroundColor: '#EEEEEE',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    avatar: {
        width: 100,
        height: 100,
        marginBottom: '1rem',
    },
};

export const UpdateProfile = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState({});
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [photo, setPhoto] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await AllServices.getUserProfile();
            const userProfile = response.find(item => item.user === user.user_id);

            if (userProfile) {
                setUserData(userProfile);
                setBio(userProfile.bio || ''); // Set initial values for bio and website
                setWebsite(userProfile.website || '');
                setSelectedFileName(userProfile.image || '');
            }
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBio(name === 'bio' ? value : bio);
        setWebsite(name === 'website' ? value : website);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            setPhoto(file);
        }
    };

    const updateUserProfile = async () => {
        try {
            const formD = new FormData();
            formD.append('user', user.user_id);
            formD.append('bio', bio);
            formD.append('website', website);
            formD.append('image', photo);

            const response = await AllServices.updateUser(userData.id, formD);
            console.log('User profile updated successfully');
            navigate('/profile/view-profile');
        } catch (error) {
            console.error('Failed to update user profile', error);
        }
    };

    return (
        <div>
            <Paper id='my-profile' sx={styles.paper}>
                <Typography variant='h4' sx={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                    Update Profile
                </Typography>
                <Avatar
                    alt={user.username}
                    src={userData.image || '/default-profile-image.jpg'}
                    sx={styles.avatar}
                />
                <form>
                    <TextField
                        fullWidth
                        label='Username'
                        name='username'
                        variant='filled'
                        disabled
                        value={user.username}
                        sx={{ marginTop: '1rem' }}
                    />
                    <TextField
                        fullWidth
                        label='Bio'
                        name='bio'
                        variant='filled'
                        multiline
                        rows={4}
                        helperText={userData.bio}
                        value={bio}
                        onChange={handleInputChange}
                        sx={{ marginTop: '1rem' }}
                    />
                    <TextField
                        fullWidth
                        type='url'
                        label='Website'
                        name='website'
                        variant='filled'
                        helperText={userData.website}
                        value={website}
                        onChange={handleInputChange}
                        sx={{ marginTop: '1rem',marginBottom: '1rem' }}
                    />
                    <br/>
                    <InputGroup >
                        <FormControl
                            type='text'
                            readOnly
                            placeholder={selectedFileName}
                            aria-describedby='file-upload'
                        />
                        <label htmlFor='image-upload' className='input-group-text'>
                            Upload Image
                            <input
                                accept='image/*'
                                style={{ display: 'none' }}
                                id='image-upload'
                                type='file'
                                onChange={handleImageChange}
                            />
                        </label>
                    </InputGroup>
                    <br />
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={updateUserProfile}
                        sx={{ marginTop: '1rem' }}
                    >
                        Save
                    </Button>
                </form>
            </Paper>
            <br />
        </div>
    );
};
