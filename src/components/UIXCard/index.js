import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Stack,
} from "@mui/material";
import "./styles.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from '@mui/icons-material/Pause';
import Logo from "../../assets/core/SEF_logo_text.svg";
import backgroundImage from "../../assets/common/boxImage.png";
import {
  interviewBooked,
  behancePressed,
  viewCVLog
} from "../../logger/analyticsTracking";
import { hooks } from "../../api";


const UIXHiringCard = ({
  index,
  bootcamp,
  name,
  coverImage,
  pdf,
  calendly,
  behance,
  setOpenOverlay,
  openOverlay,
  avatarImage,
  setTransform,
  youtubeId,
  backImage
}) => {
  const theme = useTheme();
  const { data: user } = hooks.useCurrentUser();

  const videoRef = useRef(null);
  const cardDetailsRef = useRef(null);
  const cardRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(true);
  };

  const handleClick = () => {
    setOpenOverlay(index);
  };
  const handleBlur = (e) => {
    setOpenOverlay(-1);
  };

  useEffect(() => {
    openOverlay === index ? handleMouseEnter() : handleMouseLeave();
  }, [openOverlay]);

  const analyticsBasicParams = () => {
    return {
      user,
      graduateProfile: name,
      bootcamp,
    };
  };

  // translate to center of screen
  useEffect(() => {
    if (openOverlay === index) {
      translateToCenter();
    }
  }, [openOverlay]);
  
  const translateToCenter = useCallback(() => {
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    // const translateX = window.innerWidth / 2 - cardCenterX;
    // const translateY = window.innerHeight / 2 - cardCenterY;
    // with a scale of 0.9 
    // it is a bit more to the left, i want it to be centered

    const translateX = window.innerWidth / 2 - cardCenterX - (cardRect.width * 0.05);
    const translateY = window.innerHeight / 2 - cardCenterY - (cardRect.height * 0.05);

    // if mobile phone add 10px to the translateX
    let addon = 10 ;
    if (window.innerWidth < 764) { addon = 20 ;};
    console.log(addon);
    setTransform({
      x: translateX + addon,
      y: translateY,
    })
  }, [cardRef]);

  return (
    <div ref={cardRef} className={`card ${openOverlay === index && "open"}`} >
      <div className={`flip-card ${openOverlay === index && "open"}`}>
        <button
          className={`flip-card-inner hiring-card-main-container hiring-card-main-container-${bootcamp?.toLowerCase()}`}
          onClick={() => handleClick()}
        >
          <div
            className={`flip-card-front hiring-card-container hiring-card-container-${bootcamp.toLowerCase()}`}
          >
            <img
              src={coverImage}
              className={`hiring-card-image-container hiring-card-image-container-${bootcamp.toLowerCase()}`}
            />
          </div>

          <div
            className={`flip-card-back hiring-card-information-main-container ${
              openOverlay === index && "open"
            }`}
          >
            <div className="hiring-card-information-container-uix">
              {/* logo */}
              {/* <div className="hiring-card-logo">
                <a href="https://sefactory.io/">
                  <img className={"logo"} src={Logo} alt="logo" />
                </a>
              </div> */}
              {/* backround image */}
              {/* <div className="hiring-card-background">
                <img src={backgroundImage} alt="cover" />
              </div>  */}
              <img className='card-special-back' src={`https://drive.google.com/uc?id=${backImage}`} alt="Image Description" />


              {/* video */}
              <div className="hiring-card-video-container">
                <video
                  ref={videoRef}
                  className="hiring-card-video"
                  src={`https://drive.google.com/uc?export=download&id=${youtubeId}`}
                  loop
                  playsInline
                  webkit-playsinline
                />
                <div className="hiring-card-video-play-button">
                  {isPlaying ? <PauseIcon fontSize="large" sx={{color: 'white'}} onClick={() => togglePlayPause()} /> : <PlayArrowIcon fontSize="large" sx={{color: 'white', fontSize:"50px"}} onClick={() => togglePlayPause()} />}
                </div>
              </div>
              {/* Card footer */}
              {/* <div className="hiring-card-footer-container-uix">
                <div className="hiring-card-footer-uix">
                  <Stack direction="row">
                    <Typography
                      variant="h5"
                      fontWeight={900}
                      color={theme.palette.uix.main}
                    >
                      UIX
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color={"white"}>
                      01
                    </Typography>
                  </Stack>
                </div>
              </div> */}
            </div>
          </div>
        </button>
      </div>
        <div ref={cardDetailsRef} onClick={(e) => e.stopPropagation()} className={`card-details card-details-top ${openOverlay === index && 'open'}`}>
          <Stack direction="row" alignItems="center" gap={2}>
            <div
              className="avatar-border"
              style={{ borderColor: theme.palette.uix.main }}
            >
              <Avatar
                src={avatarImage}
                alt={name}
                sx={{ width: 30, height: 30 }}
              />
            </div>
            <Typography variant={"h5"} fontSize={16} fontWeight={"900"}>
              {name}
            </Typography>
          </Stack>
          {/* <Typography
            mt={2}
            sx={{ color: "white", fontSize: 13, fontWeight: 400, lineHeight: '22px' }}
          >
            {aboutMe}
          </Typography> */}
        </div>
        <div ref={cardDetailsRef} onClick={(e) => e.stopPropagation()} className={`card-details card-details-bottom ${openOverlay === index && 'open'}`} >
          <Stack direction='row' fullWith sx={{width: '100%'}} columnGap={2}> 
            <div className="logout_outer logout_outer_special" 
            onClick={() => {
              window.open(pdf, '_blank');
              viewCVLog({ ...analyticsBasicParams() })
            }}>
              <div className="logout_inner">View CV</div>
            </div>
            <div className="logout_outer logout_outer_special" 
            onClick={() => {
              window.open(behance, '_blank');
              behancePressed({ ...analyticsBasicParams() })
            }}
              >
              <div className="logout_inner">View Behance</div>
            </div>
          </Stack>
          <div className="logout_outer logout_outer-green" 
          onClick={() => {
            window.open(calendly, '_blank');
            interviewBooked({ ...analyticsBasicParams() })
          }}>
            <div className="logout_inner">Book Interview</div>
          </div>
      </div>
    </div>
  );
};

export default UIXHiringCard;
