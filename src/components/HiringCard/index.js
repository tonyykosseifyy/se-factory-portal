import React, { useState, useRef, useMemo, useCallback } from "react";
import { Grid, Typography, useMediaQuery, useTheme, Avatar, Stack } from "@mui/material";
import "./styles.scss";
import { SE_GREEN, SE_GREY, SE_MID_GREY } from "../../utils/constants/colors";
import { useModal } from "mui-modal-provider";
import HiringDialog from "../HiringDialog";
import PDFDialog from "../PDFDialog";
import SEButton from "../SEButton";
import { AVAILABLE_FOR_HIRE, HIRED } from "../../utils/constants/hiring-status";
import {
  githubPressed,
  hoveredOverLog,
  interviewBooked,
  projectPressed,
  viewCVLog,
} from "../../logger/analyticsTracking";
import { useAuth0 } from "@auth0/auth0-react";
import { hooks, useMutation } from "../../api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAxios } from "../../context/axios";
import { MUTATION_KEYS } from "../../api/config/keys";
import { useGodMode } from "../../context/godMode";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomButton from "../ui-components/CustomButton";
import image1 from '../../assets/common/uix1.png';
import image2 from '../../assets/common/uix2.png';
import image3 from '../../assets/common/uix3.png';
import image4 from '../../assets/common/uix4.png';

const images = [image1, image2, image3, image4];
const fsd_images = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaifwqs1mBNpQLGrVO5-DqFxc7vQlrhCZDcA&usqp=CAU',

]
function getRandomNumber(id) {
  // Convert the ID to a number
  const parsedId = parseInt(id, 10);
  
  // Perform calculations based on the ID
  const randomNumber = ((parsedId * 37) % 4) + 1;
  
  return randomNumber;
}

const HiringCard = ({
  bootcamp,
  id,
  uix_user, 
  fsd_user,
  attributes: {
    name,
    title,
    projectDescription: description,
    github,
    youtubeId,
    coverImage,
    projectType,
    pdf,
    screenshots,
    programmingLanguages: languages,
    calendly,
    projectURL,
    hiringStatus,
  },
}) => {
  const [open, setOpen] = useState(false);
  const optionsIcon = useRef(null);
  const theme = useTheme();
  const { preRelease: PRE_RELEASE } = useGodMode();
  const { Api } = useAxios();
  const { data: user } = hooks.useCurrentUser();
  const { data: favorite } = hooks.useFavorites();
  const { mutate: deleteFavorite } = useMutation(MUTATION_KEYS.DELETE_FAVORITE);
  const { mutate: createFavorite } = useMutation(MUTATION_KEYS.POST_FAVORITE);

  const isFavorited = () => favorite.find(({ attributes }) => attributes?.student?.data?.id === id);

  const analyticsBasicParams = () => {
    return {
      user,
      graduateProfile: name,
      languages,
      projectType,
      graduateStatus: hiringStatus,
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
  },[]) 
  const toggleFavorite = (e) => {
    const fav = isFavorited();
    const operation = fav ? deleteFavorite : createFavorite;
    operation({
      Api,
      id: fav ? fav.id : id,
    });
    e.stopPropagation();
  }
  const handleClick = (e, skipCheck, pressedOn) => {
      if (!PRE_RELEASE && hiringStatus !== HIRED) {
        if (
          skipCheck ||
          (e.target.localName !== "button" && e.target.localName !== "a")
        ) {
          projectPressed({ ...analyticsBasicParams(), pressedOn });
          const modal = showModal(HiringDialog, {
            images: screenshots,
            calendly,
            youtubeId,
            name,
            github,
            pdf,
            projectURL,
            languages,
            projectType,
            hiringStatus,
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
    projectType?.forEach((e, index) => {
      if (index > 0) {
        str += " & " + e.type;
      } else {
        str += e.type;
      }
    });
    return str;
  };

  return (
    <div
      className={`hiring-card-main-container hiring-card-main-container-${bootcamp.toLowerCase()} ${
        (PRE_RELEASE || hiringStatus === HIRED) && "prerelease"
      }`}
      onMouseOver={(e) => {
        setOpen(true);
      }}
      
      onMouseLeave={() => {
        setOpen(false);
        hoveredOverLog({ ...analyticsBasicParams() });
      }}
    >
      <div className={"hiring-card-favorite"} onClick={(e) => toggleFavorite(e)}>
        {isFavorited() ? (
          <FavoriteIcon sx={{width: '27px', height: '27px', color: theme.palette[bootcampColor].main}} />
        ) : (
          <FavoriteBorderIcon sx={{width: '27px', height: '27px', color: theme.palette[bootcampColor].main}} />
        )}
      </div>
      <div className={"hiring-card-container"} >
        <div
          className={`hiring-card-image-container hiring-card-image-container-${bootcamp.toLowerCase()}`}
          style={{ backgroundImage: bootcamp === 'UIX' ? `url(${images[uix_user.id - 1]})`: bootcamp === 'FSD' ? `url(${fsd_user.pictureUrl})` :`url(${coverImage})` }}
        />
        <div className={"hiring-card-footer"}>
          <Stack sx={{width:'100%'}} flexDirection='row' alignItems='center' justifyContent='space-between'>
						<Stack flexDirection='row' alignItems='center' gap={2}> 
							<div className='avatar-border' style={{borderColor: theme.palette[bootcampColor].main}}>
								<Avatar 
									src={bootcamp === 'UIX' || bootcamp === 'FSD' ? '' : coverImage}
									alt={name}
									sx={{ width: 25, height: 25 }}
								/>
							</div>
							<Typography variant={"h6"} fontSize={15} fontWeight={"bold"}>
								{bootcamp === 'UIX' ? uix_user.name : bootcamp === 'FSD' ? fsd_user.name: name}
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
                PRE_RELEASE || !hiringStatus
                  ? "calc(100% - 40px)"
                  : isMD
                  ? "calc(100% - 143px)"
                  : "calc(100% - 96px)",
            }}
          >
            {bootcamp !== 'UIX' ? bootcamp === 'FSD' ? 
              <Typography
              variant={"h6"}
              fontWeight={"bolder"}
              sx={{ color: SE_MID_GREY}}
              fontSize={isSM ? 14: 16}
            >
              &gt; Data Science
            </Typography>
            : 
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
              { bootcamp === 'UIX' ? uix_user['name']: bootcamp ==='FSD' ? fsd_user['project_name'] :title }
            </Typography>
						<div className="small-divider" />
            {/*<div className={"small-divider"}/>*/}
            <div
              className={`hiring-card-project-description ${
                PRE_RELEASE && " prerelease"
              }`}
            >
              <Typography variant={"body2"} fontSize={isSM ? 12: 13}>{bootcamp ==='UIX' ? uix_user['aboutMe']:bootcamp ==='FSD' ? fsd_user['description']: description[0]?.line}</Typography>
              {/* <Typography variant={"body2"} fontSize={isSM ? 12: 13}>{description[1]?.line}</Typography> */}
            </div>
          </div>
          {hiringStatus && (
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
                        Project Demo
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
                        // should be change to live project
                        // onClick={() =>
                        //   githubPressed({ ...analyticsBasicParams() })
                        // }
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
                        // should be changed to view behance
                        // onClick={() =>
                        // 	githubPressed({ ...analyticsBasicParams() })
                        // }
                        disableElevation
                      >
                        View Behance
                      </SEButton>
                  </Grid>)
                  }
                </Grid>
              )}
            </>
          )}
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
