import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Grid, Typography, useMediaQuery, useTheme, Avatar, Stack } from "@mui/material";
import "./styles.scss";
import { SE_GREY, SE_MID_GREY } from "../../utils/constants/colors";
import { useModal } from "mui-modal-provider";
import HiringDialog from "../HiringDialog";
import SEButton from "../SEButton";
import {
  githubPressed,
  hoveredOverLog,
  interviewBooked,
  projectPressed,
  viewCVLog,
  liveProjectPressed,
  behancePressed
} from "../../logger/analyticsTracking";
import { hooks, useMutation } from "../../api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAxios } from "../../context/axios";
import { MUTATION_KEYS } from "../../api/config/keys";
import { useGodMode } from "../../context/godMode";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomButton from "../ui-components/CustomButton";
import image1 from '../../assets/common/uix1.png';

const avatar_images = [
  "https://xsgames.co/randomusers/assets/avatars/male/65.jpg",
  'https://xsgames.co/randomusers/assets/avatars/male/42.jpg',
  'https://xsgames.co/randomusers/assets/avatars/male/55.jpg',
  'https://xsgames.co/randomusers/assets/avatars/female/46.jpg'
];

function getRandomNumber(id) {
  // Convert the ID to a number
  const parsedId = parseInt(id, 10);
  
  // Perform calculations based on the ID
  const randomNumber = ((parsedId * 37) % 4) + 1;
  
  return randomNumber;
}

const includesFavorite = ( favoriteBy, user ) => {
  for (let i = 0; i < favoriteBy?.length; i++) {
    if (favoriteBy[i]?.id === user?.id) {
      return true
    }
  }
  return false
};

const HiringCard = ({
  bootcamp,
  id,
  name,
  aboutMe,
  title,
  projectDescription: description,
  github,
  youtubeId,
  coverImage,
  pdf,
  languages,
  calendly,
  projectURL,
  favoriteBy,
  projectTypes,
  dataVisualizationTools, 
  cloudPlatforms, 
  databaseTechnologies
}) => {
  const [open, setOpen] = useState(false);
  const optionsIcon = useRef(null);
  const theme = useTheme();
  const { preRelease: PRE_RELEASE } = useGodMode();
  const { Api } = useAxios();
  const { data: user } = hooks.useCurrentUser();
  const { mutate: deleteFavorite } = useMutation([MUTATION_KEYS.DELETE_FAVORITE, { id }]);
  const { mutate: createFavorite } = useMutation([MUTATION_KEYS.POST_FAVORITE, { id }]);

  const [ isFavorite, setIsFavorite ] = useState(false);

  const analyticsBasicParams = () => {
    return {
      user, graduateProfile: name, 
      languages, projectTypes, dataVisualizationTools, cloudPlatforms, databaseTechnologies, bootcamp
    };
  };
  const bootcampColor = useMemo(() => {
    switch (bootcamp) {
      case 'FSW':
        return "primary";
      case 'FSD':
        return 'fsd';
      case 'UIX':
        return 'uix';
      default:
        return 'primary';
  }}, [ bootcamp ]);

  const isSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isMD = useMediaQuery(theme.breakpoints.down("md"));
  const { showModal } = useModal();

  const flipCard = useCallback((e) => {
    hoveredOverLog({ ...analyticsBasicParams() })
    setOpen(true);
    e.stopPropagation();
  },[]) ;

  const toggleIsFavorite = (e) => {
    const operation = isFavorite ? deleteFavorite : createFavorite;
    operation({
      Api,
      id
    });
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  }

  useEffect(() => {
    setIsFavorite(includesFavorite(favoriteBy, user));
  },[favoriteBy, user])

  
  const handleClick = (e, skipCheck, pressedOn) => {
      if (!PRE_RELEASE) {
        if (
          skipCheck ||
          (e.target.localName !== "button" && e.target.localName !== "a")
        ) {
          projectPressed({ ...analyticsBasicParams(), pressedOn });
          const modal = showModal(HiringDialog, {
            calendly,
            youtubeId,
            name ,
            github,
            pdf,
            projectURL,
            languages,
            projectTypes,
            dataVisualizationTools, 
            cloudPlatforms, 
            databaseTechnologies,             
            bootcamp,
            onCancel: () => {
              modal.hide();
            },
          });
        }
      }
  };

  const projectTypeHandle = () => {
    let str = "";
    projectTypes?.forEach((e, index) => {
      if (index > 0) {
        str += " & " + e.projectType;
      } else {
        str += e.projectType;
      }
    });
    return str;
  };

  return (
    <div
      className={`hiring-card-main-container hiring-card-main-container-${bootcamp.toLowerCase()} ${
        (PRE_RELEASE ) && "prerelease"
      }`}
      onMouseOver={(e) => {
        setOpen(true);
      }}
      
      onMouseLeave={() => {
        setOpen(false);
        hoveredOverLog({ ...analyticsBasicParams() });
      }}
    >
      <div className={"hiring-card-favorite"} onClick={(e) => toggleIsFavorite(e)}>
        {isFavorite ? (
          <FavoriteIcon sx={{width: '27px', height: '27px', color: theme.palette[bootcampColor].main}} />
        ) : (
          <FavoriteBorderIcon sx={{width: '27px', height: '27px', color: theme.palette[bootcampColor].main}} />
        )}
      </div>
      <div className={"hiring-card-container"} >
        <div
          className={`hiring-card-image-container hiring-card-image-container-${bootcamp.toLowerCase()}`}
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className={"hiring-card-footer"}>
          <Stack sx={{width:'100%'}} direction='row' alignItems='center' justifyContent='space-between'>
						<Stack direction='row' alignItems='center' gap={2}> 
							<div className='avatar-border' style={{ borderColor: theme.palette[bootcampColor].main }}>
								<Avatar 
									src={avatar_images[getRandomNumber(id) -1]}
									alt={name}
									sx={{ width: 25, height: 25 }}
								/>
							</div>
							<Typography variant={"h6"} fontSize={15} fontWeight={"bold"}>
								{name}
							</Typography>
						</Stack>
						
          </Stack>
        </div>
      </div>
     
      <div
        onClick={(e) => handleClick(e, false, "Card")}
        className={`hiring-card-information-main-container ${open && "open"}`}
      >
        <div className={"hiring-card-information-container"}>
          <div
            style={{
              padding: "0",
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              maxHeight:
                PRE_RELEASE
                  ? "calc(100% - 40px)"
                  : isMD
                  ? "calc(100% - 143px)"
                  : "calc(100% - 96px)",
            }}
          >
            {bootcamp !== 'UIX' ?  
            <Typography
              variant={"h6"}
              fontWeight={"bolder"}
              sx={{ color: SE_MID_GREY}}
              fontSize={isSM ? 14: 16}
            >
              &gt; {projectTypeHandle()}
            </Typography>: null }
            <Typography
              variant={"h5"}
              fontWeight={"bolder"}
              fontSize={isSM ? 18: 24}
            >
              { bootcamp === 'UIX' ? name : title }
            </Typography>
						<div className="small-divider" />
            {/*<div className={"small-divider"}/>*/}
            <div
              className={`hiring-card-project-description ${
                PRE_RELEASE && " prerelease"
              }`}
            >
              <Typography mt={1} textAlign={'center'} variant={"body2"} fontSize={isSM ? 12: 13}>{bootcamp ==='UIX' ? aboutMe: description}</Typography>
            </div>
          </div>
            <>
              {PRE_RELEASE ? (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <CustomButton
                      className={`${bootcamp?.toLowerCase()}-button`}
                      fullWidth
                      href={pdf}
                      target="_blank"
                      disableElevation
                      onClick={() => {
                        viewCVLog({ ...analyticsBasicParams() });
                      }}
                    >
                      View CV
                    </CustomButton>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <CustomButton
                      disableElevation
                      fullWidth
                      className={`${bootcamp?.toLowerCase()}-button`}
                      sx={{
                        height: "40px",
                        color: "black",
                      }}
                      onClick={(e) => handleClick(e, true, "About Me Button")}
                    >
                      About Me
                    </CustomButton>
                  </Grid>
                    
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <SEButton
                      variant={"contained"}
                      color={"secondary"}
                      disableElevation
                      fullWidth
                      href={calendly}
                      onClick={() =>
                        interviewBooked({ ...analyticsBasicParams() })
                      }
                      target="_blank"
                      sx={{
                        height: "40px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Book Interview
                    </SEButton>
                  </Grid>
                  { bootcamp != 'UIX' ?
                  
                  (<>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <SEButton
                        variant={"contained"}
                        color={"secondary"}
                        disableElevation
                        sx={{
                          height: "40px",
                          backgroundColor: SE_GREY,
                          color: "white",
                        }}
                        onClick={() =>
                          githubPressed({ ...analyticsBasicParams() })
                        }
                        fullWidth
                        href={github}
                        target="_blank"
                      >
                        View Github
                      </SEButton>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <SEButton
                        variant={"contained"}
                        color={"secondary"}
                        disableElevation
                        sx={{
                          height: "40px",
                          backgroundColor: SE_GREY,
                          color: "white",
                        }}
                        onClick={() =>
                          liveProjectPressed({ ...analyticsBasicParams() })
                        }
                        fullWidth
                        href={github}
                        target="_blank"
                      >
                        Live Project
                      </SEButton>
                    </Grid>
                  </>)
                  :
                  (<Grid item xs={12} sm={12} md={12} lg={12}>
                    <SEButton
                        variant={"contained"}
                        color='secondary'
                        sx={{
                          backgroundColor: SE_GREY,
                          color: "white",
                        }}
                        fullWidth
                        href={github}
                        target="_blank"
                        onClick={() =>
                        	behancePressed({ ...analyticsBasicParams() })
                        }
                        disableElevation
                      >
                        View Behance
                      </SEButton>
                  </Grid>)
                  }
                </Grid>
              )}
            </>
        </div>
      </div>
      <div className={`hiring-card-flip ${open && 'flip-none'}` }>
        <MoreHorizIcon 
          ref={optionsIcon}
          onClick={(e) => flipCard(e)}            
          sx={{color: '#A5A6A9'}}  
        />
      </div>
    </div>
  );
};

export default HiringCard;
