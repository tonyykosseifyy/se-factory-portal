import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Grid, Typography, useMediaQuery, useTheme, Avatar, Stack } from "@mui/material";
import "./styles.scss";
import { SE_GREY, SE_MID_GREY } from "../../utils/constants/colors";
import { useModal } from "mui-modal-provider";
import HiringDialog from "../HiringDialog";
import SEButton from "../SEButton";
import videoSource from '../../assets/common/uix_video.mp4' ;
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Logo from "../../assets/core/SEF_logo_text.svg";
import backgroundImage from "../../assets/common/boxImage.png";
import {
  githubPressed,
  hoveredOverLog,
  interviewBooked,
  projectPressed,
  liveProjectPressed,
  behancePressed
} from "../../logger/analyticsTracking";
import { hooks, useMutation } from "../../api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAxios } from "../../context/axios";
import { MUTATION_KEYS } from "../../api/config/keys";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomButton from "../ui-components/CustomButton";


const includesFavorite = ( favoriteBy, user, name ) => {
  for (let i = 0; i < favoriteBy?.length; i++) {
    if (favoriteBy[i]?.id === user?.id) {
      return true
    }
  }
  return false
};

const UIXHiringCard = ({
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
  behance,
  favoriteBy,
  projectTypes,
  dataVisualizationTools, 
  cloudPlatforms, 
  databaseTechnologies,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { data: user } = hooks.useCurrentUser();

  const videoRef = useRef(null);
  const [ showPlayButton, setShowPlayButton ] = useState(false);


  const handleMouseEnter = () => {
    // pauses all other videos
    // pauseAllVideos()

    // plays the video
    const promise = videoRef.current?.play();
    
    if (promise !== undefined) {
      promise.then(_ => {
        !showPlayButton && setShowPlayButton(true);
      }).catch(error => {
        setShowPlayButton(false);
      })
    }
  }

  const handleMouseLeave = () => {
    // pauses the video
    const promise = videoRef.current?.pause();
    
    if (promise !== undefined) {
      promise.then(_ => {
        // Autoplay started!
      }).catch(error => {
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
      })
    }
  }

  useEffect(() => {
    open ? handleMouseEnter() : handleMouseLeave() ;
  },[open])

  const analyticsBasicParams = () => {
    return {
      user, graduateProfile: name, 
      languages, projectTypes, dataVisualizationTools, cloudPlatforms, databaseTechnologies, bootcamp
    };
  };


  const isMD = useMediaQuery(theme.breakpoints.down("md"));


  const flipCard = useCallback((e) => {
    hoveredOverLog({ ...analyticsBasicParams() })
    setOpen(true);
    e.stopPropagation();
  },[]) ;


  return (
    <div className={`flip-card ${open && "open"}`}>
        <button
          className={`flip-card-inner hiring-card-main-container hiring-card-main-container-${bootcamp?.toLowerCase()}`}
          onClick={() => setOpen(true)}
          onBlur={() => setOpen(false)}
      >
        <div className={`flip-card-front hiring-card-container hiring-card-container-${bootcamp.toLowerCase()}`} >
          <div
            className={`hiring-card-image-container hiring-card-image-container-${bootcamp.toLowerCase()}`}
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        </div>
      
        <div
          className={`flip-card-back hiring-card-information-main-container ${open && "open"}`}
        >
          <div className="hiring-card-information-container-uix">
            {/* logo */}
            <div className="hiring-card-logo">
              <a href="https://sefactory.io/">
                <img className={"logo"} src={Logo} alt="logo" />
              </a>
            </div>
            {/* backround image */}
            <div className="hiring-card-background">
              <img src={backgroundImage} alt="cover" />
            </div>

            {/* video */}
            <div className="hiring-card-video-container">
              <video
                ref={videoRef}
                className="hiring-card-video"
                src={videoSource}
                loop
              />
              {showPlayButton && (
                <div className="hiring-card-video-play-button">
                  <PlayArrowIcon />
                </div>
              )}
            </div>
            {/* Card footer */}
            <div className="hiring-card-footer-container-uix">
              <div className="hiring-card-footer-uix">
                <Stack direction="row">
                  <Typography variant='h5' fontWeight={900} color={theme.palette.uix.main}>UIX</Typography>
                  <Typography variant='h5' fontWeight={900} color={'white'}>01</Typography>
                </Stack>
              </div>
            </div>
          </div>
        </div>

        </button>
    </div>

  );
};

export default UIXHiringCard;
