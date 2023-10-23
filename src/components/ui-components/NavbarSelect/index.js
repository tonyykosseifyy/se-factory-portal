import React, { useState, useCallback, useMemo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './index.scss' ;
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@emotion/react';
import { useLocation, useHistory } from 'react-router-dom';

const getBootcamp = (queryParams, history, location) => {
	const bootcamp = queryParams.get('bootcamp');
	if (!bootcamp || !['FSW', 'UIX', 'FSD'].includes(bootcamp)) {
		queryParams.set('bootcamp', 'FSW');
    history.push({
      pathname: location.pathname,
      search: `?${queryParams.toString()}`,
    });
		return 'FSW';
	}
  return bootcamp;
};


const BootcampSelect = () => {
  const location = useLocation();
  const history = useHistory();

  const queryParams = new URLSearchParams(location.search);

  const [bootcamp, setbootcamp] = useState(getBootcamp(queryParams, history, location));
  const [open, setOpen] = useState(false);
  const theme = useTheme();


  const handleChange = (event) => {
    setbootcamp(event.target.value);
    queryParams.set('bootcamp', event.target.value);
    // Updating the URL with modified bootcamp query parameter
    history.push({
      pathname: location.pathname,
      search: `?${queryParams.toString()}`,
    });
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
        return palette.fsd.main;
      case 'UIX':
        return palette.uix.main;
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
        inputProps={{ 'aria-label': 'select bootcamp' }}
        mr={4}
        size='small'
        sx={{color: bootcampColor , fontWeight: 'bold', fontSize:"14px" }}
        IconComponent={() => <ArrowDropDownIcon onClick={() => toggleOpen()} sx={{cursor: 'pointer'}} color='secondary' />}
      >
        <MenuItem sx={{fontSize: "14px"}} value='FSW'>Full-Stack Web (FSW)</MenuItem>
        <MenuItem sx={{fontSize: "14px"}} value='FSD'>Full-Stack Data (FSD)</MenuItem>
        <MenuItem sx={{fontSize: "14px"}} value='UIX'>UI/UX (UIX)</MenuItem>
      </Select>
    </div>
  )
}

export default BootcampSelect;
