import React, { useState, useCallback, useMemo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './index.scss' ;
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@emotion/react';
import { useLocation, useHistory } from 'react-router-dom';

const getBootcamp = (queryParams, history, location) => {
	const bootcamp = queryParams.get('bootcamp');
	if (!bootcamp || !['UIX'].includes(bootcamp)) {
		queryParams.set('bootcamp', 'UIX');
    history.push({
      pathname: location.pathname,
      search: `?${queryParams.toString()}`,
    });
		return 'UIX';
	}
  // only for uix: temporary solution to redirect to uix page if bootcamp is not set
  // 	if (!bootcamp || !['FSD', 'FSW', 'UIX'].includes(bootcamp)) {
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
        // open={open}
        // onAbort={() => setOpen(false)}
        // onClose={() => setOpen(false)}
        // onOpen={() => setOpen(true)}
        value={'UIX'}
        // onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'select bootcamp' }}
        mr={4}
        size='small'
        sx={{color: theme.palette.uix.main , fontWeight: 'bold' }}
        readOnly
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