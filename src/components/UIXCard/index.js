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
import videoSource from "../../assets/common/uix_video.mp4";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from '@mui/icons-material/Pause';
import Logo from "../../assets/core/SEF_logo_text.svg";
import backgroundImage from "../../assets/common/boxImage.png";
import {
  githubPressed,
  hoveredOverLog,
  interviewBooked,
  projectPressed,
  liveProjectPressed,
  behancePressed,
} from "../../logger/analyticsTracking";
import { hooks } from "../../api";


const UIXHiringCard = ({
  index,
  bootcamp,
  name,
  aboutMe,
  coverImage,
  pdf,
  calendly,
  behance,
  setOpenOverlay,
  avatarImage,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { data: user } = hooks.useCurrentUser();

  const videoRef = useRef(null);

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
  };

  const handleClick = () => {
    setOpenOverlay(index);
    setOpen(true);
  };
  const handleBlur = () => {
    setOpen(false);
    setOpenOverlay(-1);
  };

  useEffect(() => {
    open ? handleMouseEnter() : handleMouseLeave();
  }, [open]);

  const analyticsBasicParams = () => {
    return {
      user,
      graduateProfile: name,
      bootcamp,
    };
  };

  return (
    <div className="card">
      <div className={`flip-card ${open && "open"}`}>
        <button
          className={`flip-card-inner hiring-card-main-container hiring-card-main-container-${bootcamp?.toLowerCase()}`}
          onClick={() => handleClick()}
          // onBlur={() => handleBlur()}
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
              open && "open"
            }`}
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
                <div className="hiring-card-video-play-button">
                  {isPlaying ? <PauseIcon fontSize="large" sx={{color: 'white'}} onClick={() => togglePlayPause()} /> : <PlayArrowIcon fontSize="large" sx={{color: 'white', fontSize:"50px"}} onClick={() => togglePlayPause()} />}
                </div>
              </div>
              {/* Card footer */}
              <div className="hiring-card-footer-container-uix">
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
              </div>
            </div>
          </div>
        </button>
      </div>
      <div className="card-details">
        <div className="card-details-top">
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
            <Typography variant={"h5"} fontSize={16} fontWeight={"bold"}>
              {name}
            </Typography>
          </Stack>
          <Typography
            mt={2}
            sx={{ color: "white", fontSize: 14, fontWeight: 300 }}
          >
            {aboutMe}
          </Typography>
        </div>
        <div className="card-details-bottom">
          <div className="logout_outer">
            <div className="logout_inner">View CV</div>
          </div>
          <div className="logout_outer">
            <div className="logout_inner">View Behance</div>
          </div>
          <div className="logout_outer logout_outer-green" 
          onClick={() => {
            window.open(calendly, '_blank');
            interviewBooked({ ...analyticsBasicParams() })
          }}>
            <div className="logout_inner">Book Interview</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIXHiringCard;
