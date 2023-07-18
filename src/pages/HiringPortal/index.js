import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { LANGUAGES } from "../../utils/constants/languages";
import { PROJECT_TYPES } from "../../utils/constants/projects-types";
import { arraySubset } from "../../utils/helpers/arraySubset";
import "./styles.scss";
import { useLocation } from "react-router-dom";
import {
  AVAILABLE_FOR_HIRE,
  HIRED,
  HIRING_STATUS,
} from "../../utils/constants/hiring-status";
// import Fanar from "../../assets/partners/AlFanar.jpeg";
// import Drosos from "../../assets/partners/Drosos.png";
// import EU from "../../assets/partners/EU.png";
// import HopesLeb from "../../assets/partners/HopesLeb.png";
// import Life from "../../assets/partners/Life.jpeg";
// import Unicef from "../../assets/partners/Unicef.png";
// import Netherlands from '../../assets/partners/netherlands.png';
// import AbdelAziz from '../../assets/partners/abdelAziz.png';
// import Deloitte from '../../assets/partners/deloitte.png';
// import Generations from '../../assets/partners/generationOfInnovation.png';
import Partners from "../../assets/partners/SEF_sponsors apr 2023.png";
import { ReactComponent as ArrowDown } from "../../assets/common/Vector.svg";
import { Popover } from "react-tiny-popover";
import useResizeObserver from "beautiful-react-hooks/useResizeObserver";
import { hooks } from "../../api";
import Loader from "../../components/Loader";
import SEButton from "../../components/SEButton";
import { SE_GREY } from "../../utils/constants/colors";
import { portalAccessed, searchLog } from "../../logger/analyticsTracking";
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import portalData from "./portal-data";
import CustomButton from "../../components/ui-components/CustomButton";
import "./border.scss";

const uix_students = [
  {
    id: 1,
    name: "Majed Habli",
    aboutMe: "Passionate learner with a keen interest in computer science.Creative problem solver fascinated by the intersection of design and technology",
  },
  {
    id: 2,
    name: "Mohammad Haidar",
    aboutMe: "Creative problem solver fascinated by the intersection of design and technology.Passionate learner with a keen interest in computer science",
  },
  {
    id: 3,
    name: "Mostafa Kreidly",
    aboutMe: "Enthusiastic explorer of data analytics and its application in various industries.Passionate learner with a keen interest in computer science",
  },
  {
    id: 4,
    name: "Zeina Saleh",
    aboutMe: "Dedicated coder striving to create innovative solutions for real-world challenges.",
  },
];
const fsd_students = [
  {
    id: 1,
    name: 'Abdallah Alkhatib',
    project_name: "StockSense",
    description: "Developed a predictive model to forecast stock market trends based on historical data and technical indicators.",
    pictureUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeV2Y1QlKlIjfqEp21YDx_ExNsJWz3hjG8tQ&usqp=CAU"
  },
  {
    id: 2,
    name: 'Jana Alkhatib',
    project_name: "MovieMate",
    description: "Built a recommendation system using collaborative filtering to suggest personalized movie recommendations to users.",
    pictureUrl: "https://us.123rf.com/450wm/owline27/owline271910/owline27191000072/131291190-film-logo-design-inspiration-for-business-and-company.jpg?ver=6"
  },
  {
    id: 3,
    name: 'Khalil lakkis',
    project_name: "SocialSentinel",
    description: "Implemented a natural language processing algorithm to analyze sentiment in social media posts and classify them as positive, negative, or neutral.",
    pictureUrl: "https://assets-global.website-files.com/5cb5162c145f7c1a41cbdb88/5ef3a854ce5b318c23c2fe5e_socialsentinel%402x.jpg"
  },
  {
    id: 4,
    name: 'Samir Salloum',
    project_name: "FraudShield",
    description: "Created a machine learning model to detect fraudulent credit card transactions with high accuracy, minimizing financial losses for a bank.",
    pictureUrl: "https://as2.ftcdn.net/v2/jpg/03/31/20/23/1000_F_331202316_eoD6AcKCH1bVhx0MJe8QkmzdUaP8wIvQ.jpg"
  }
];


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
  const [languages, setLanguages] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [hiringStatus, setHiringStatus] = useState("");
  const [prevLanguages, setPrevLanguages] = useState([]);
  const [prevProjectTypes, setPrevProjectTypes] = useState([]);
  const [prevFilterOpen, setPrevFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const { data: students, isLoading: isLoadingStudents } = hooks.useStudents();
  const { data: favorites, isLoading: isLoadingFavorites } =
    hooks.useFavorites();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [prevFavoritesOnly, setPrevFavoritesOnly] = useState(false);
  const theme = useTheme();
  const [filterMounted, setFilterMounted] = useState(false);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [cards, setCards] = useState([]);

  const [ bootcamp, setBootcamp ] = useState(queryParams.get('bootcamp'));
  
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
      setBootcamp( queryParams.get('bootcamp')) ;
  }, [location]);

  const reset = useCallback(() => {
    setLanguages([]);
    setProjectTypes([]);
    setHiringStatus("");
    setPrevLanguages([]);
    setPrevProjectTypes([]);
    setPrevFavoritesOnly(false);
    setFavoritesOnly(false);
  },[]);
  useEffect(() => {
    if (students) {
      const languageOptionsTemp = new Set();

      students.forEach((student) => {
        student.attributes.programmingLanguages.forEach((e) => {
          if (e.language) {
            languageOptionsTemp.add(e.language);
          }
        });
      });

      setLanguageOptions(Array.from(languageOptionsTemp).sort());
    }
  }, [students]);

  useEffect(() => {
    if (students) {
      setCards(
        students
          .filter((proj) =>
            prevLanguages.length !== 0
              ? arraySubset(
                  prevLanguages,
                  proj.attributes.programmingLanguages.map((e) => e.language)
                )
              : true
          )
          .filter((proj) =>
            prevProjectTypes.length !== 0
              ? arraySubset(
                  prevProjectTypes,
                  proj.attributes.projectType.map((e) => e.type)
                )
              : true
          )
          .filter((proj) => {
            if (prevFavoritesOnly) {
              const favoriteIds = favorites.map(
                (e) => e?.attributes?.student?.data?.id
              );
              return favoriteIds.includes(proj.id);
            }
            return true;
          })
          .sort((a, b) => {
            return a.attributes.name > b.attributes.name ? 1 : -1;
          })
      );
      searchLog({ user, prevLanguages, prevProjectTypes });
    }
  }, [students, prevLanguages, prevProjectTypes, prevFavoritesOnly, favorites]);

  useEffect(() => {
    portalAccessed({ user });
  }, []);
  // useEffect(()=> {
  //
  //     setCards(projects.filter((proj) =>
  //             prevProjectTypes.length!==0?arraySubset(prevProjectTypes,proj.projectType):true
  //         ).filter((proj) =>
  //             prevLanguages.length!==0?arraySubset(prevLanguages,proj.languages):true
  //         ))
  //
  // },[prevLanguages,prevProjectTypes])

  return (
    <div className={"hiring-portal-wrapper"}>
      <div className={"hiring-portal-container"}>
				<div
					className={`hiring-portal-filters-container ${bootcamp?.toLowerCase()}-container`}
					style={{ width: "100%" }}
				>
          {/* <div className={`hiring-border border-top se-dot-${bootcamp.toLowerCase()}`}/>
          <div className={`hiring-border border-right se-dot-${bootcamp.toLowerCase()}`}/>
          <div className={`hiring-border border-bottom se-dot-${bootcamp.toLowerCase()}`}/>
          <div className={`hiring-border border-left se-dot-${bootcamp.toLowerCase()}`}/> */}
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
								<div className={`se-dot se-dot-${bootcamp.toLowerCase()}`}/>
							</Stack>
						</Stack>
						<Typography mb={5} mt={2} variant='h5' fontWeight={800} fontSize={isSmall ? isSM ? 12 : 14 : 18} color='#888888'>
							<span style={{marginRight:'7px'}}>//</span> {portalData[bootcamp]?.below_title}
						</Typography>
						<div className='filters-wrapper'>
              <Stack my={2} flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Typography fontWeight={800} textTransform='uppercase' fontSize={isSM ? 14 : 17} variant='h6' color='#A5A6A9'>Filter By</Typography>
                <Typography onClick={() => reset()} fontWeight={800} fontSize={isSM ? 12 : 14} variant='h6' color='#A5A6A9' sx={{cursor:'pointer'}}>reset all</Typography>
              </Stack>
							<div className="filter-by-container">
								<div
									style={{
										width: !isSmall ? "50%" : "100%",
										flexBasis: !isSmall ? "50%" : "100%",
									}}
								>
									{/* <Typography my={1} variant={"h5"} fontSize={"17px"}>
										Project Type
									</Typography> */}
									<Autocomplete
										multiple
                    size='small'
										value={projectTypes}
										onChange={(e, newValue) => {
											setProjectTypes(newValue);
										}}
										options={bootcamp === 'FSW' ? PROJECT_TYPES: []}
										onClick={(e) => {
											e.preventDefault();
											setFilterOpen(true);
										}}
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
									{/* <Typography my={1} variant={"h5"} fontSize={"17px"}>
										Stacks Used
									</Typography> */}
									<Autocomplete
										multiple
                    size="small"
										value={languages}
										onChange={(e, newValue) => {
											setLanguages(newValue);
										}}
										options={bootcamp === 'FSW' ? LANGUAGES: []}
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
										setPrevProjectTypes(projectTypes);
										setPrevLanguages(languages);
										setFilterOpen(false);
										setPrevFavoritesOnly(favoritesOnly);
									}}
								>
									Show Results
								</CustomButton>
								{/*<Typography*/}
								{/*    onClick={() => {*/}
								{/*        setPrevProjectTypes(projectTypes)*/}
								{/*        setPrevLanguages(languages)*/}
								{/*        setFilterOpen(false)*/}
								{/*        setPrevFavoritesOnly(favoritesOnly)*/}

								{/*        }*/}
								{/*    }*/}
								{/*    variant={"h5"} fontSize={"15px"} style={{cursor:'pointer'}} fontWeight={700} marginTop={4}>*/}
								{/*    Show Results*/}
								{/*</Typography>*/}
							</Stack>
						</div>
						
					</div>
				</div>
				<Grid container spacing={isSM ? 0 : isSmall ? 2 : 5} marginBottom={3}>
					{isLoadingFavorites || isLoadingStudents ? (
						<Loader SELogo />
					) : (
						<>
							<Grid item xs={12} my={2}>
								<Typography variant={"h5"} fontSize={isSmall ? isSM  ? 14 : 16 : 18 }>
									Can't find what you're looking for? Some students might have
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
								// cards?.length > 0 ?
							bootcamp === 'UIX' ? 
                cards.slice(0,4).map((props, index) => (
                  <Grid
                    style={{
                      marginTop: isSmall && "10px",
                      marginBottom: isSmall && "10px",
                    }}
                    key={`card-${index}`}
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    mt={2}
                  >
                    <HiringCard {...props} uix_user={uix_students[index]} bootcamp={bootcamp} />
                  </Grid>
                  ))
                : bootcamp === 'FSD' ? 
                cards.slice(0,4).map((props, index) => (
                  <Grid
                    style={{
                      marginTop: isSmall && "10px",
                      marginBottom: isSmall && "10px",
                    }}
                    key={`card-${index}`}
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    mt={2}
                  >
                    <HiringCard {...props} fsd_user={fsd_students[index]} bootcamp={bootcamp} />
                  </Grid>
                  ))
                
                :
                cards.map((props, index) => (
									<Grid
										style={{
											marginTop: isSmall && "10px",
											marginBottom: isSmall && "10px",
										}}
										key={`card-${index}`}
										item
										xs={12}
										sm={6}
										md={6}
										lg={4}
										mt={2}
									>
                    <HiringCard {...props} bootcamp={bootcamp} />
									</Grid>
								))
								// :
								// <>
								//     <Grid item xs={12} my={2}>
								//
								//         <Typography variant={"h5"} fontSize={"18px"}>
								//             Can't find what you're looking for? Some students might have in-depth knowledge in specific technologies and didn't use them in the final project.
								//             <span style={{fontWeight:'700'}}> Please reach out!  <a href="mailto: hire@sefactory.io" style={{color:`unset`}}>hire@sefactory.io</a></span>
								//         </Typography>
								//
								//     </Grid>
								//     {
								//         students?.map((props,index) => (
								//             <Grid style={{
								//                 marginTop: isSmall && '10px', marginBottom: isSmall && '10px'
								//
								//             }} key={`card-${index}`} item xs={12} sm={6} md={6} lg={4} mt={2}>
								//                 <HiringCard {...props} />
								//             </Grid>
								//         ))
								//     }
								// </>
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
          {/* <Grid item xs={12} sm={12} md={5} lg={5}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }} src={Fanar} alt={'fanar'} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:isSmall? "45%":"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={EU} alt={'eu'} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={5}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Life} alt={'life'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Drosos} alt={'droso'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>
                    <Grid item xs={12} sm={12} md={3} lg={3} >
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Unicef} alt={'unicef'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={HopesLeb} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={AbdelAziz} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply',
                                
                            }}  src={Generations} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Deloitte} alt={'hopes'} />
                        </div>
                    </Grid>
                    <Grid item md={1} lg={1}/>

                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{
                            display:'flex',
                            height:'100%'
                        }}>
                            <img style={{
                                width:"100%",
                                margin:'auto',
                                mixBlendMode: 'multiply'
                            }}  src={Netherlands} alt={'hopes'} />
                        </div>
                    </Grid> */}
        </Grid>
      </div>
    </div>
  );
};

export default HiringPortal;
