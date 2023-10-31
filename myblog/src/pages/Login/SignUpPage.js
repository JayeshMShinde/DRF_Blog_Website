    import React, { useState } from 'react';
    import Dialog from '@mui/material/Dialog';
    import DialogTitle from '@mui/material/DialogTitle';
    import DialogContent from '@mui/material/DialogContent';
    import TextField from '@mui/material/TextField';
    import DialogActions from '@mui/material/DialogActions';
    import Button from '@mui/material/Button';
    import axiosInstance from '../../utils/axiosInstance';
    import { baseUrl } from '../../utils/useAxios';

    const SignUpPage = ({ open, onClose }) => {
        const [username, setUsername] = useState('');
        const [fname, setFname] = useState('');
        const [lname, setLname] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [cnfpass, setCnfPassword] = useState('');


        const handleRegister = async (e) => {
            try {
                e.preventDefault();
                const registerData = {
                    username: username,
                    first_name: fname,
                    last_name: lname,
                    email: email,
                    password: password,
                };

                if (password === cnfpass) {
                    let resp = await axiosInstance.post(baseUrl + '/api/register/', registerData)

                    if (resp.status === 201) {
                        alert("User Registered Successfully");
                    } else if (resp.status === 400) {
                        const data = await resp.json();
                        alert(data.message); 
                    }
                    else {
                        alert("Something went wrong")
                    }
                }
            } catch (e){
                console.log("Error while registering the user :",e);
            }
        onClose();
        };

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    &nbsp;
                    <TextField
                        label="Username"
                        fullWidth
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    &nbsp;
                    <TextField
                        label="First Name"
                        fullWidth
                        required
                        name="fname"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                    />
                    &nbsp;
                    <TextField
                        label="Last Name"
                        fullWidth
                        required
                        name="lname"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                    />
                    &nbsp;
                    <TextField
                        label="Email Address"
                        fullWidth
                        required
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    &nbsp;
                    <TextField
                        label="Password"
                        name="password" 
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    &nbsp;
                    <TextField
                        label="Confirm Password"
                        name="cnfpass" 
                        type="password"
                        required
                        fullWidth
                        value={cnfpass}
                        onChange={(e) => setCnfPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRegister} color="warning">
                        Register
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    export default SignUpPage;
