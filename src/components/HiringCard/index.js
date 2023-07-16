import React, { useState, useRef, useMemo } from "react";
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

const favoriteIconPressed = (e) => {
  return (e.target.localName === "path" && !e.target?.getAttribute('d').startsWith('M6')) || (e.target.localName === "svg" && !e.target.getAttribute("data-testid") === 'MoreHorizIcon') ;
}

const HiringCard = ({
  id,
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

  console.log(PRE_RELEASE);
  const isFavorited = () =>
    favorite.find(({ attributes }) => attributes?.student?.data?.id === id);

  const analyticsBasicParams = () => {
    return {
      user,
      graduateProfile: name,
      languages,
      projectType,
      graduateStatus: hiringStatus,
    };
  };
  const isSM = useMediaQuery(theme.breakpoints.down("md"));

  const { showModal } = useModal();

  
  const handleClick = (e, skipCheck, pressedOn) => {
    if (favoriteIconPressed(e)) {
      const fav = isFavorited();
      const operation = fav ? deleteFavorite : createFavorite;
      operation({
        Api,
        id: fav ? fav.id : id,
      });
    } 
    else if (e.target === optionsIcon.current) {
      setOpen(true);
    }
    else {
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
            onCancel: () => {
              modal.hide();
            },
          });
        }
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
      className={`hiring-card-main-container ${
        (PRE_RELEASE || hiringStatus === HIRED) && "prerelease"
      }`}
      onMouseOver={(e) => {
        setOpen(true);
      }}
      onClick={(e) => handleClick(e, false, "Card")}
      onMouseLeave={() => {
        setOpen(false);
        hoveredOverLog({ ...analyticsBasicParams() });
      }}
    >
      <div className={"hiring-card-favorite"}>
        {isFavorited() ? (
          <FavoriteIcon color={"primary"} />
        ) : (
          <FavoriteBorderIcon color={"primary"} />
        )}
      </div>
      <div className={"hiring-card-container"}>
        <div
          className={"hiring-card-image-container"}
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className={"hiring-card-footer"}>
          <Stack sx={{width:'100%'}} flexDirection='row' alignItems='center' justifyContent='space-between'>
						<Stack flexDirection='row' alignItems='center' gap={2}> 
							<div className='avatar-border'>
								<Avatar 
									src={coverImage}
									alt={name}
									sx={{ width: 25, height: 25 }}
								/>
							</div>
							<Typography variant={"h6"} fontSize={15} fontWeight={"bold"}>
								{name}
							</Typography>
						</Stack>
						<MoreHorizIcon 
            ref={optionsIcon}
            // onMouseLeave={() => {
            //   setOpen(false);
            //   hoveredOverLog({ ...analyticsBasicParams() });
            // }}
              sx={{color: '#A5A6A9'}}  
              
              />
            {/* 3 dots icon */}
						
            {/* <Typography
              variant={"body1"}
              fontWeight={"bold"}
              style={{ color: hiringStatus ? SE_GREEN : SE_MID_GREY }}
            >
              {hiringStatus ? AVAILABLE_FOR_HIRE : HIRED}
            </Typography> */}
          </Stack>
        </div>
      </div>
      <div
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
                  : isSM
                  ? "calc(100% - 143px)"
                  : "calc(100% - 96px)",
            }}
          >
            <Typography
              variant={"h6"}
              fontWeight={"bolder"}
              sx={{ color: SE_MID_GREY, fontSize: "16px" }}
            >
              &gt; {projectTypeHandle()}
            </Typography>
            <Typography
              variant={"h5"}
              fontWeight={"bolder"}
              sx={{ fontSize: "24px" }}
            >
              {title}
            </Typography>
						<div className="small-divider" />
            {/*<div className={"small-divider"}/>*/}
            <div
              className={`hiring-card-project-description ${
                PRE_RELEASE && " prerelease"
              }`}
            >
              <Typography variant={"body2"}>{description[0]?.line}</Typography>
              <Typography variant={"body2"}>{description[1]?.line}</Typography>
            </div>
          </div>
          {hiringStatus && (
            <>
              {PRE_RELEASE ? (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <SEButton
                      variant={"contained"}
                      fullWidth
                      color={"primary"}
                      href={pdf}
                      target="_blank"
                      disableElevation
                      onClick={() => {
                        viewCVLog({ ...analyticsBasicParams() });
                      }}
                    >
                      View CV
                    </SEButton>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <SEButton
                      variant={"contained"}
                      color={"primary"}
                      disableElevation
                      fullWidth
                      sx={{
                        height: "40px",
                      }}
                      onClick={(e) => handleClick(e, true, "About Me Button")}
                    >
                      About Me
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
                </Grid>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiringCard;
