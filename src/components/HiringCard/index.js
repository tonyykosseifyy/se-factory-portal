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
import { SE_GREY, SE_MID_GREY } from "../../utils/constants/colors";
import { useModal } from "mui-modal-provider";
import HiringDialog from "../HiringDialog";
import SEButton from "../SEButton";
import {
  githubPressed,
  hoveredOverLog,
  interviewBooked,
  projectPressed,
  liveProjectPressed,
} from "../../logger/analyticsTracking";
import { hooks, useMutation } from "../../api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAxios } from "../../context/axios";
import { MUTATION_KEYS } from "../../api/config/keys";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CustomButton from "../ui-components/CustomButton";

const includesFavorite = (favoriteBy, user, name) => {
  for (let i = 0; i < favoriteBy?.length; i++) {
    if (favoriteBy[i]?.id === user?.id) {
      return true;
    }
  }
  return false;
};

const HiringCard = ({
  bootcamp,
  id,
  name,
  title,
  projectDescription: description,
  github,
  youtubeId,
  coverImage,
  pdf,
  calendly,
  projectURL,
  favoriteBy,
  avatarImage,
  projectTypes,
}) => {
  const [open, setOpen] = useState(false);
  const optionsIcon = useRef(null);
  const theme = useTheme();
  const { Api } = useAxios();
  const { data: user } = hooks.useCurrentUser();
  const { mutate: deleteFavorite } = useMutation([
    MUTATION_KEYS.DELETE_FAVORITE,
    { id },
  ]);
  const { mutate: createFavorite } = useMutation([
    MUTATION_KEYS.POST_FAVORITE,
    { id },
  ]);

  const [isFavorite, setIsFavorite] = useState(
    includesFavorite(favoriteBy, user, name)
  );

  const analyticsBasicParams = () => {
    return {
      user,
      graduateProfile: name,
      bootcamp,
    };
  };
  const bootcampColor = useMemo(() => {
    switch (bootcamp) {
      case "FSW":
        return "primary";
      case "FSD":
        return "fsd";
      default:
        return "primary";
    }
  }, [bootcamp]);

  const isSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isMD = useMediaQuery(theme.breakpoints.down("md"));
  const { showModal } = useModal();

  const flipCard = useCallback((e) => {
    hoveredOverLog({ ...analyticsBasicParams() });
    setOpen(true);
    e.stopPropagation();
  }, []);

  const toggleIsFavorite = (e) => {
    const operation = isFavorite ? deleteFavorite : createFavorite;
    operation({
      Api,
      id,
    });
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  useEffect(() => {
    setIsFavorite(includesFavorite(favoriteBy, user, name));
  }, [favoriteBy, user]);

  const handleClick = (e, skipCheck, pressedOn) => {
    if (
      skipCheck ||
      !["a", "button", "svg", "path"].includes(e.target.localName)
    ) {
      projectPressed({ ...analyticsBasicParams(), pressedOn });
      const modal = showModal(HiringDialog, {
        calendly,
        youtubeId,
        name,
        github,
        pdf,
        projectURL,
        bootcamp,
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
        if (!("ontouchstart" in window)) {
          setOpen(true);
        }
      }}
      onTouchStart={(e) => {
        if (!("ontouchstart" in window)) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        setOpen(false);
        hoveredOverLog({ ...analyticsBasicParams() });
      }}
      onTouchEnd={(e) => {
        // if the event wasn't a button click
        if (!["a", "button", "svg", "path"].includes(e.target.localName)) {
          setOpen(false);
          hoveredOverLog({ ...analyticsBasicParams() });
        }
      }}
    >
      <div
        className={"hiring-card-favorite"}
        onClick={(e) => toggleIsFavorite(e)}
      >
        {isFavorite ? (
          <FavoriteIcon
            sx={{
              width: "27px",
              height: "27px",
              color: theme.palette[bootcampColor].main,
            }}
          />
        ) : (
          <FavoriteBorderIcon
            sx={{
              width: "27px",
              height: "27px",
              color: theme.palette[bootcampColor].main,
            }}
          />
        )}
      </div>
      <div
        className={`hiring-card-container hiring-card-container-${bootcamp.toLowerCase()}`}
      >
        <div
          className={`hiring-card-image-container hiring-card-image-container-${bootcamp.toLowerCase()}`}
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className={"hiring-card-footer"}>
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <div
                className="avatar-border"
                style={{ borderColor: theme.palette[bootcampColor].main }}
              >
                <Avatar
                  src={avatarImage}
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
              maxHeight: isMD ? "calc(100% - 143px)" : "calc(100% - 96px)",
            }}
          >
            <Typography
              variant={"h6"}
              fontWeight={"bolder"}
              sx={{ color: SE_MID_GREY }}
              fontSize={isSM ? 14 : 16}
            >
              &gt; {projectTypeHandle()}
            </Typography>
            <Typography
              variant={"h5"}
              fontWeight={"bolder"}
              fontSize={isSM ? 18 : 24}
            >
              {title}
            </Typography>
            <div className="small-divider" />
            <div className="hiring-card-project-description">
              <Typography
                mt={1}
                textAlign={"center"}
                variant={"body2"}
                fontSize={isSM ? 12 : 13}
              >
                {description}
              </Typography>
            </div>
          </div>
          <>
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
                  onClick={() => interviewBooked({ ...analyticsBasicParams() })}
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

              <Grid item xs={12} sm={12} md={bootcamp === "FSD" ? 6:12} lg={bootcamp === "FSD" ? 6:12}>
                <SEButton
                  variant={"contained"}
                  color={"secondary"}
                  disableElevation
                  sx={{
                    height: "40px",
                    backgroundColor: SE_GREY,
                    color: "white",
                  }}
                  onClick={() => githubPressed({ ...analyticsBasicParams() })}
                  fullWidth
                  href={github}
                  target="_blank"
                >
                  View Github
                </SEButton>
              </Grid>
              {bootcamp === "FSD" && <Grid item xs={12} sm={12} md={6} lg={6}>
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
                  href={projectURL}
                  target="_blank"
                >
                  Live Project
                </SEButton>
              </Grid>}
            </Grid>
          </>
        </div>
      </div>
      <div className={`hiring-card-flip ${open && "flip-none"}`}>
        <MoreHorizIcon
          ref={optionsIcon}
          onClick={(e) => flipCard(e)}
          sx={{ color: "#A5A6A9" }}
        />
      </div>
    </div>
  );
};

export default HiringCard;

