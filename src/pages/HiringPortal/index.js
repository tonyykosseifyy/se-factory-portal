import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/styles";
import {
  Autocomplete,
  Checkbox,
  Divider,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
	Stack
} from "@mui/material";
import HiringCard from "../../components/HiringCard";
import bootcamps_languages from "../../utils/constants/languages";
import bootcamps_project_types from "../../utils/constants/projects-types";
import fsd_filters from '../../utils/constants/fsd_filters';
import "./styles.scss";
import { useLocation } from "react-router-dom";
import Partners from "../../assets/partners/SEF_sponsors apr 2023.png";
import { hooks } from "../../api";
import Loader from "../../components/Loader";
import { portalAccessed, searchLog } from "../../logger/analyticsTracking";
import { useMemo } from "react";
import portalData from "./portal-data";
import CustomButton from "../../components/ui-components/CustomButton";
import "./border.scss";


export const CustomTextField = styled(TextField)({
  "& .MuiFilledInput-root": {
    borderRadius: "10px",
    background: "white",
  },
  "& .MuiFilledInput-underline:before": {
    borderBottom: "none !important",
  },
  "& .MuiFilledInput-underline:after": {
    borderBottom: "none !important",
  },
});

const HiringPortal = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { data: user, isLoading: isLoadingUser } = hooks.useCurrentUser();
  
  // common filters 
  const [ languages, setLanguages ] = useState([]);
  const [ projectTypes, setProjectTypes ] = useState([]);
  const [ favoritesOnly, setFavoritesOnly ] = useState(false);

  const [ bootcamp, setBootcamp ] = useState(queryParams.get('bootcamp'));
  
  // fsd filters 
  const [ databaseTechnologies, setDatabaseTech ] = useState([]);
  const [ cloudPlatforms, setCloudPlatforms ] = useState([]);
  const [ dataVisualizationTools, setDataVisualization ] = useState([]);

  const [ filters, setFilters ] = useState({ bootcamp });

  const { data: students, isLoading: isLoadingStudents, refetch } = hooks.useStudents({ filters });

  const theme = useTheme();
  

  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isSM = useMediaQuery(theme.breakpoints.down("sm"));

  
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
  }}, [ location, bootcamp ]);


  useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      setBootcamp(queryParams.get('bootcamp')) ;
  }, [location]);

  const reset = () => {
    setLanguages([]);
    setProjectTypes([]);
    setFavoritesOnly(false);
    // reset fsd filters
    setDatabaseTech([]);
    setCloudPlatforms([]);
    setDataVisualization([]);
    setFilters({
      favorite: false,
			bootcamp 
    });
  };


  useEffect(() => {
    reset();
    setFilters({ bootcamp, favorite: false });
    searchLog({ user, bootcamp });
    refetch();
  },[bootcamp]);


  useEffect(() => {
    portalAccessed({ user });
  }, [user]);

  return (
    <div className={"hiring-portal-wrapper"}>
      <div className={"hiring-portal-container"}>
				<div
					className={`hiring-portal-filters-container ${bootcamp?.toLowerCase()}-container`}
					style={{ width: "100%" }}
				>
					<div className='filters-content'>
						<Stack flexDirection='row' alignItems='center' justifyContent='space-between'>
							<Stack flexDirection='row' >
								<Typography sx={{transition:'.4s ease-out'}} variant='h1' fontWeight={900} fontSize={isSmall ? isSM ? 16 : 18 : 25} color={bootcampColor}>&gt;</Typography>
								<Typography sx={{transition:'.4s ease-out'}} ml={2} variant='h1' fontWeight={900} fontSize={isSmall ? isSM ? 16 : 18 : 25} color={bootcampColor}>{portalData[bootcamp]?.title}</Typography>
								<Typography ml={isSmall ? 1: 2} variant='h1' fontWeight={900} fontSize={isSmall ? isSM ? 16 : 18 : 25} color='white'>hiring portal</Typography>
							</Stack>
							<Stack flexDirection='row' alignItems='center' gap={1}>
								<div className='se-dot se-dot-white'/>
								<div className='se-dot se-dot-grey'/>
								<div className={`se-dot se-dot-${bootcamp?.toLowerCase()}`}/>
							</Stack>
						</Stack>
						<Typography mb={bootcamp === 'UIX' ? 2: 5} mt={2} variant='h5' fontWeight={800} fontSize={isSmall ? isSM ? 12 : 14 : 18} color='#888888'>
							<span style={{marginRight:'7px'}}>//</span> {portalData[bootcamp]?.below_title}
						</Typography>
						{bootcamp !== 'UIX' && 
						<div className='filters-wrapper'>
              <Stack my={2} flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Typography fontWeight={800} textTransform='uppercase' fontSize={isSM ? 14 : 17} variant='h6' color='#A5A6A9'>Filter By</Typography>
                { bootcamp !== 'UIX' && <Typography onClick={() => reset()} fontWeight={800} fontSize={isSM ? 12 : 14} variant='h6' color='#A5A6A9' sx={{cursor:'pointer'}}>reset all</Typography> }
              </Stack>
							<div className="filter-by-container">
								{ bootcamp !== 'UIX' && <>
									<div
										style={{
											width: !isSmall ? "50%" : "100%",
											flexBasis: !isSmall ? "50%" : "100%",
										}}
									>
										<Autocomplete
											multiple
											size='small'
											value={projectTypes}
											onChange={(e, newValue) => {
												setProjectTypes(newValue);
											}}
											options={bootcamps_project_types[bootcamp]}
											filterSelectedOptions
											sx={{ fontSize:isSM ? 12: 16 , zIndex: "10000000000" }}
											renderInput={(params) => (
												<CustomTextField
													{...params}
													id={"languages"}
													variant={"filled"}
													label="Project Type"
												/>
											)}
										/>
									</div>
									<div
										style={{
											width: !isSmall ? "50%" : "100%",
											flexBasis: !isSmall ? "50%" : "100%",
											padding: !isSmall ? "0 0 0 10px" : "5px 0",
											marginTop: !isSmall ? 0 : 20,
										}}
									>
										<Autocomplete
											multiple
											size="small"
											value={languages}
											onChange={(e, newValue) => {
												setLanguages(newValue);
											}}
											options={bootcamps_languages[bootcamp]}
											filterSelectedOptions
											sx={{ fontSize:isSM ? 12: 16 , zIndex: "10000000000" }}
											renderInput={(params) => (
												<CustomTextField
													{...params}
													id={"languages"}
													variant={"filled"}
													label="Technologies Used"
												/>
											)}
										/>
									</div>
								</>
								}
            { bootcamp === 'FSD' && 
            <>
                <div
									style={{
										width: !isSmall ? "33%" : "100%",
										flexBasis: !isSmall ? "33%" : "100%",
                    marginTop: '20px'
									}}
								>
									<Autocomplete
										multiple
                    size='small'
										value={cloudPlatforms}
										onChange={(e, newValue) => {
											setCloudPlatforms(newValue);
										}}
										options={fsd_filters["Cloud Platforms"]}
										filterSelectedOptions
										sx={{ fontSize:isSM ? 12: 16 , zIndex: "10000000000" }}
										renderInput={(params) => (
											<CustomTextField
												{...params}
												id={"Cloud_Platforms"}
												variant={"filled"}
												label="Cloud Platforms"
											/>
										)}
									/>
								</div>
                <div
									style={{
										width: !isSmall ? "33%" : "100%",
										flexBasis: !isSmall ? "33%" : "100%",
                    marginTop: '20px',
                    padding: !isSmall ? "0 0 0 10px" : "5px 0",
									}}
								>
									<Autocomplete
										multiple
                    size='small'
										value={dataVisualizationTools}
										onChange={(e, newValue) => {
											setDataVisualization(newValue);
										}}
										options={fsd_filters["Data Visualization"]}
										filterSelectedOptions
										sx={{ fontSize:isSM ? 12: 16 , zIndex: "10000000000" }}
										renderInput={(params) => (
											<CustomTextField
												{...params}
												id={"Data_Visualization "}
												variant={"filled"}
												label="Data Visualization"
											/>
										)}
									/>
								</div>
                <div
									style={{
										width: !isSmall ? "33%" : "100%",
                    flex: 1,
                    marginTop: '20px',
                    padding: !isSmall ? "0 0 0 10px" : "5px 0",
									}}
								>
									<Autocomplete
										multiple
                    size='small'
										value={databaseTechnologies}
										onChange={(e, newValue) => {
                      setDatabaseTech(newValue);
										}}
										options={fsd_filters["Database Technologies"]}
                    getOptionLabel={(option) => option.name}
                    groupBy={(option) => option.category}

										filterSelectedOptions
										sx={{ fontSize:isSM ? 12: 16 , zIndex: "10000000000" }}
										renderInput={(params) => (
											<CustomTextField
												{...params}
												id={"Database_Technologies"}
												variant={"filled"}
												label="Database Technologies"
											/>
										)}
									/>
								</div>
              </>
              }
								<div
									style={{
										width: !isSmall ? "50%" : "100%",
										flexBasis: !isSmall ? "50%" : "100%",
										padding: "5px 0",
									}}
								>
									<div style={{ display: "flex", marginTop: "10px", alignItems:'center' }}>
										<Typography
											my={1}
											mr={isSM ? 1: 2}
											variant={"h5"}
											fontSize={isSM ? 14 : 16}
										>
											Only Favorites
										</Typography>
										<Checkbox
                    sx={{color: 'white'}}
                    color="secondary"
                    size='small'
											checked={favoritesOnly}
											onChange={(event) =>
												setFavoritesOnly(event.target.checked)
											}
											inputProps={{ "aria-label": "controlled" }}
										/>
									</div>
								</div>
							</div>
							<Stack mt={2} mb={1} flexDirection='row' justifyContent='center'>
								<CustomButton
                  className={`${bootcamp?.toLowerCase()}-button`}
									sx={{
										height: "40px",
										color: "black",
                    minWidth: isSM ? '160px':'220px'
									}}
                  onClick={() => {
                    setFilters({
                      languages,
                      projectTypes,
                      favorite: favoritesOnly,
                      bootcamp,
                      databaseTechnologies: databaseTechnologies?.map(item => item.name) ,
                      cloudPlatforms,
                      dataVisualizationTools
                    });
                    searchLog({
											user,
                      languages,
                      projectTypes,
                      favorite: favoritesOnly,
                      bootcamp,
                      databaseTechnologies: databaseTechnologies?.map(item => item.name) ,
                      cloudPlatforms,
                      dataVisualizationTools
                    })
                    refetch();
                  }}
								>
									Show Results
								</CustomButton>
							</Stack>
						</div>
						}
						
					</div>
				</div>
				<Grid container spacing={isSM ? 0 : isSmall ? 2 : 5} marginBottom={3}>
					{ isLoadingUser || isLoadingStudents ? (
						<Loader SELogo />
					) : (
						<>
							<Grid item xs={12} my={2}>
								<Typography variant={"h5"} fontSize={isSmall ? isSM  ? 14 : 16 : 18 }>
									Can't find what you're looking for? Some students? might have
									in-depth knowledge in specific technologies and didn't use
									them in the final project.
									<span style={{ fontWeight: "700" }}>
										{" "}
										Please reach out!{" "}
										<a
											href="mailto: hire@sefactory.io"
											style={{ color: `unset` }}
										>
											hire@sefactory.io
										</a>
									</span>
								</Typography>
							</Grid>
							{
                students && Array.isArray(students) && students.map((props, index) => (
									<Grid
										style={{
											marginTop: isSmall && "10px",
											marginBottom: isSmall && "10px",
										}}
										key={`card-${props.id}`}
										item
										xs={12}
										sm={6}
										md={6}
										lg={4}
										mt={2}
									>
                    <HiringCard key={props.id} {...props} bootcamp={bootcamp} />
									</Grid>
								))
							}
						</>
					)}
				</Grid>
        <Grid container spacing={3} mt={5}>
          <Grid item xs={12}>
            <Typography variant={isSmall ? "h5" : "h3"} textAlign={"center"}>
              Our Funding Partners
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={isSmall ? "body1" : "h6"} textAlign={"center"}>
              SE Factory partners have been critical to the success, growth, and
              expansion of our programs.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ height: "2px" }} />
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <div
              style={{
                display: "flex",
                height: "100%",
              }}
            >
              <img
                className="partners-picture"
                style={{
                  width: "250%",
                  margin: "auto",
                  mixBlendMode: "multiply",
                }}
                src={Partners}
                alt={"partners"}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default HiringPortal;
