import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Grid, Typography, useMediaQuery, useTheme, Avatar, Stack } from "@mui/material";
import "./styles.scss";
import { SE_GREY, SE_MID_GREY } from "../../utils/constants/colors";
import { useModal } from "mui-modal-provider";
import HiringDialog from "../HiringDialog";
import SEButton from "../SEButton";
import videoSource from '../../assets/common/uix_video.mp4' ;
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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
  const { Api } = useAxios();
  const { data: user } = hooks.useCurrentUser();
  const { mutate: deleteFavorite } = useMutation([MUTATION_KEYS.DELETE_FAVORITE, { id }]);
  const { mutate: createFavorite } = useMutation([MUTATION_KEYS.POST_FAVORITE, { id }]);

  const [ isFavorite, setIsFavorite ] = useState(includesFavorite(favoriteBy, user, name));

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
    const operation = isFavorite ? deleteFavorite : createFavorite ; 
    operation({
      Api,
      id
    });
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  }

  useEffect(() => {
    setIsFavorite(includesFavorite(favoriteBy, user, name));
  },[favoriteBy, user]);

  
  const handleClick = (e, skipCheck, pressedOn) => {
    if (
        skipCheck ||
        !(['a', 'button','svg', 'path'].includes(e.target.localName)) 
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
          behance,
          onCancel: () => {
            modal.hide();
          },
        });
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
      className={`hiring-card-main-container hiring-card-main-container-${bootcamp?.toLowerCase()}`}
      onMouseOver={(e) => {
        if (!('ontouchstart' in window)) {
          setOpen(true);
          bootcamp === 'UIX' && handleMouseEnter();
        }
      }}
      onTouchStart={(e) => {
        if (!('ontouchstart' in window)) {
          setOpen(true);
          bootcamp === 'UIX' && handleMouseEnter();
        }
      }}
      onMouseLeave={() => {
        setOpen(false);
        hoveredOverLog({ ...analyticsBasicParams() });
        bootcamp === 'UIX' && handleMouseLeave();  
      }}
      onTouchEnd={() => {
        setOpen(false);
        hoveredOverLog({ ...analyticsBasicParams() });
        bootcamp === 'UIX' && handleMouseLeave();  
      }}
    >
      <div 
        className={"hiring-card-favorite"} 
        onClick={(e) => toggleIsFavorite(e)}
      >
      </div>
      <div className={"hiring-card-container"} >
        <div
          className={`hiring-card-image-container hiring-card-image-container-${bootcamp.toLowerCase()}`}
          style={{ backgroundImage: `url(${coverImage})` }}
        />
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
              maxHeight: isMD ? "calc(100% - 143px)" : "calc(100% - 96px)",
            }}
          >
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIXHiringCard;
