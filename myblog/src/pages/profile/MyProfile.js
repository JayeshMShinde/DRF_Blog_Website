import React, { useContext, useState } from 'react';
import AuthContext from '../../services/AuthContext';
import * as AllServices from '../../services/AllServices';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const [photo , setPhotot] = useState('')
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user: user.user_id,
        bio: '', // Default value for 'bio'
        website: '', // Default value for 'website'
        profileImage: null, // To store the selected image file
    });

    const [selectedFileName, setSelectedFileName] = useState('');


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name);   
        }
        setPhotot(file)
        
    };

    const addUserProfile = async () => {
        try {
            const form = new FormData();
            form.append('user',user.user_id)
            form.append('bio',formData.bio)
            form.append('website',formData.website)
            form.append('image',photo)
            await AllServices.addUser(form);
            console.log('User profile added successfully');
            navigate('profile/view-profile')
        } catch (error) {
            console.error('Failed to add user profile', error);
        }
    };

    return (
        <div>
            <Paper
                id='my-profile'
                sx={{
                    padding: "2rem",
                    backgroundColor: "#EEEEEE",
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: "1rem", fontWeight: 'bold' }}>
                    My Profile
                </Typography>
                <form enctype="multipart/form-data">
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        variant="filled"
                        disabled
                        value={user.username}
                        sx={{ marginTop: "1rem" }}
                    />
                    <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        variant="filled"
                        multiline
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        sx={{ marginTop: "1rem" }}
                    />
                    <TextField
                        fullWidth
                        type='url'
                        label="Website"
                        name="website"
                        variant="filled"
                        value={formData.website}
                        onChange={handleInputChange}
                        sx={{ marginTop: "1rem" }}
                    />
                    <label htmlFor='image-upload'>
                        <input
                            accept='image/*'
                            style={{ display: 'none' }}
                            id='image-upload'
                            type='file'
                            onChange={handleImageChange}
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            component='span'
                            sx={{ marginTop: '1rem' }}
                        >
                            Upload Image
                        </Button>
                    </label>
                    <span>{selectedFileName}</span>
                    <br/>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addUserProfile}
                        sx={{ marginTop: "1rem" }}
                    >
                        Save
                    </Button>
                </form>
            </Paper>
        </div>
    );
};
