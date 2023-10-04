import React from "react";
import {
  Box,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";
import YouTube from "react-youtube";
import { SE_GREY } from "../../utils/constants/colors";
import "./styles.scss";
import SEButton from "../SEButton";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClearIcon from "@mui/icons-material/Clear";
import {
  githubPressed,
  interviewBooked,
  videoPlayed,
  viewCVLog,
  liveProjectPressed
} from "../../logger/analyticsTracking";
import { hooks } from "../../api";
import CustomButton from "../ui-components/CustomButton";


const HiringDialog = ({
  calendly,
  youtubeId,
  name,
  github,
  pdf,
  onCancel,
  images,
  projectURL,
  hiringStatus,
	bootcamp,
  behance,
  ...props
}) => {

  const { data: user } = hooks.useCurrentUser();

  const analyticsBasicParams = () => {
    return {
      user, graduateProfile: 
      name, 
      bootcamp
    };
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleClickPDF = () => {
  //     const modal =  showModal(PDFDialog, {name, pdf, onCancel: () => {
  //             modal.hide();
  //         }, })
  // }

  return (
    <Dialog {...props} className={"card-modal-dialog"}>
      <div className={`card-modal-main card-modal-main-${bootcamp?.toLowerCase()}`}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div style={{ display: "flex", placeContent: "space-between" }}>
              <Typography
                variant={"h4"}
                fontWeight={"bolder"}
                sx={{ fontSize: "30px" }}
              >
                {name}
              </Typography>
              <ClearIcon
                style={{ cursor: "pointer", margin: "auto 0" }}
                onClick={onCancel}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  variant="fullWidth"
                  aria-label="lab API tabs example"
									sx={{color:'black'}}
                >
                  <Tab color="red" label="Student Profile" value="1" />
                </TabList>
              </Box>
              <TabPanel value="1" style={{ padding: "24px 0" }}>
                <Grid item xs={12}>
                  <YouTube
                    videoId={youtubeId && youtubeId?.split("/")[3]}
                    height={320}
                    width={"100%"}
                    onPlay={() => videoPlayed({ ...analyticsBasicParams() })}
                    autoplay={0}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className={"card-modal-footer"}>
										<Grid container spacing={1}>
											<Grid item xs={12} sm={6} md={6} lg={6}>
												<SEButton
													variant={"contained"}
													fullWidth
													color={"secondary"}
													disableElevation
													href={pdf}
													target="_blank"
													onClick={() => {
														viewCVLog({ ...analyticsBasicParams() });
													}}
												>
													View CV
												</SEButton>
											</Grid>
											<Grid item xs={12} sm={6} md={6} lg={6}>
												<CustomButton
													className={`${bootcamp?.toLowerCase()}-button`}
													onClick={() =>
														interviewBooked({ ...analyticsBasicParams() })
													}
                          href={calendly}
                          target="_blank"
													fullWidth
													disableElevation
												>
													Book Interview
												</CustomButton>
											</Grid>
                      <Grid item xs={12} sm={6} md={12} lg={12}>
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
                            githubPressed({ ...analyticsBasicParams() })
                          }
                          disableElevation
                        >
                          View Github
                        </SEButton>
                      </Grid>
                      {/* <Grid item xs={12} sm={6} md={6} lg={6}>
                        <SEButton
                          variant={"contained"}
                          color='secondary'
                          sx={{
                            backgroundColor: SE_GREY,
                            color: "white",
                          }}
                          fullWidth
                          href={projectURL}
                          target="_blank"
                          onClick={() => 
                            liveProjectPressed({ ...analyticsBasicParams() })
                          }
                          disableElevation
                        >
                          Live Project
                        </SEButton>
                      </Grid> */}
										</Grid>
                  </div>
                </Grid>
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};
export default HiringDialog;
