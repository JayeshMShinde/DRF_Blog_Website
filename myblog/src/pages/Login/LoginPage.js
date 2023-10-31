import React, { useState, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import AuthContext from '../../services/AuthContext';

const LoginPage = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { loginUser } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault(); 
    const loginData = {
      username: username,
      password: password,
    };
  
    loginUser(loginData);
  
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        &nbsp;
        <TextField
          label="Username"
          required
          fullWidth
          name="username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        &nbsp;
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPage;
