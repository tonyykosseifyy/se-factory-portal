import React, { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './index.scss' ;
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@emotion/react';



const BootcampSelect = () => {
  const [bootcamp, setbootcamp] = useState('FSW');
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleChange = (event) => {
    setbootcamp(event.target.value);
  };

  const toggleOpen = useCallback(() => {
    setOpen(!open);
  },[])
  const bootcampColor = useMemo(() => {
    const { palette } = theme;
    switch (bootcamp) {
      case 'FSW':
        return palette.primary.main;
      case 'FSD':
        return palette.quaternary.main;
      case 'UIX':
        return palette.tertiary.main;
      default:
        return palette.primary.main;
  }}, [ bootcamp ]);

  return (
    <div className='bootcamp-select'>
      <Select
        open={open}
        onAbort={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        value={bootcamp}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        mr={4}
        size='small'
        sx={{color: bootcampColor , fontWeight: 'bold' }}

        IconComponent={() => <ArrowDropDownIcon onClick={() => toggleOpen()} sx={{cursor: 'pointer'}} color='secondary' />}
      >
        <MenuItem value='FSW'>FSW</MenuItem>
        <MenuItem value='FSD'>FSD</MenuItem>
        <MenuItem value='UIX'>UIX</MenuItem>
      </Select>
    </div>
  )
}

export default BootcampSelect;