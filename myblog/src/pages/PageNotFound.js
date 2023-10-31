import React from 'react';
import pnf404 from '../Static/images/pnf.svg';
import TopNavBar from './TopNavBar';
import { Paper } from '@mui/material';

export const PageNotFound = () => {
  return (
    <div>
      <TopNavBar/>
      <Paper variant="outlined">
        <img src={pnf404} />
      </Paper>
    </div>
  )
}
