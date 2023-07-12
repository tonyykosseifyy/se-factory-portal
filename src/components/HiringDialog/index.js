import React from 'react';
import {Box, Dialog, Grid, ImageList, ImageListItem, Typography, useMediaQuery} from "@mui/material";
import YouTube from "react-youtube";
import {SE_GREY, SE_MID_GREY} from "../../utils/constants/colors";
import PDFDialog from "../PDFDialog";
import './styles.scss';
import {useModal} from "mui-modal-provider";
import SEButton from "../SEButton";
import {useTheme} from "@mui/styles";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ClearIcon from '@mui/icons-material/Clear';
import SwiperCore, {EffectCoverflow, Navigation, Pagination, Autoplay} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {githubPressed, interviewBooked, videoPlayed, viewCVLog} from "../../logger/analyticsTracking";
import {useAuth0} from "@auth0/auth0-react";
import {hooks} from "../../api";

;
SwiperCore.use([EffectCoverflow, Pagination, Autoplay, Navigation]);

const HiringDialog = ({ calendly,youtubeId, name, github, pdf, onCancel,images, projectURL, languages, projectType, hiringStatus, ...props }) => {

    const { showModal } = useModal();

    const theme = useTheme()

    const { data: user } = hooks.useCurrentUser();

    const analyticsBasicParams = () => {
        return {user,  graduateProfile: name, languages, projectType, graduateStatus:hiringStatus}
    }

    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const [value, setValue] = React.useState('1');

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
            <div className={"card-modal-main"}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div style={{display:'flex',placeContent:'space-between'}}>
                            <Typography variant={"h4"} fontWeight={"bolder"} sx={{fontSize:'30px'}}>
                                {name}
                            </Typography>
                            <ClearIcon style={{cursor:'pointer', margin:'auto 0'}} onClick={onCancel} />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}  variant="fullWidth" aria-label="lab API tabs example">
                                <Tab  label="Student Profile" value="1" />
                                {/*<Tab label="Project Pictures" value="2" />*/}
                            </TabList>
                        </Box>
                            <TabPanel value="1" style={{padding:'24px 0'}}>
                                <Grid item xs={12}>
                                    <YouTube
                                        videoId={youtubeId && youtubeId?.split("/")[3]}
                                        height={320}
                                        width={'100%'}
                                        onPlay={() => videoPlayed({...analyticsBasicParams()})}
                                        autoplay={0}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <div className={"card-modal-footer"}>
                                        {
                                            isSmall ?
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <SEButton
                                                            variant={"contained"}
                                                            color={"primary"}
                                                            onClick={() => interviewBooked({...analyticsBasicParams()})}
                                                            fullWidth
                                                            disableElevation
                                                        >
                                                            Book Interview
                                                        </SEButton>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <SEButton
                                                            variant={"contained"}
                                                            sx={{
                                                                backgroundColor: SE_GREY,
                                                                color: 'white',
                                                            }}
                                                            fullWidth
                                                            href={github}
                                                            target="_blank"
                                                            onClick={() => githubPressed({...analyticsBasicParams()})}

                                                            disableElevation
                                                        >
                                                            Project Demo
                                                        </SEButton>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <SEButton
                                                            variant={"contained"}
                                                            fullWidth
                                                            color={"secondary"}
                                                            disableElevation
                                                            href={pdf}
                                                            target="_blank"
                                                            onClick={() => {
                                                                viewCVLog({...analyticsBasicParams()})
                                                            }
                                                            }                                                        >
                                                            View CV
                                                        </SEButton>
                                                    </Grid>
                                                </Grid>
                                                :
                                                <div style={{display:'flex',width:'100%'}}>
                                                    <SEButton
                                                        variant={"contained"}
                                                        // color={"primary"}
                                                        sx={{
                                                            backgroundColor: SE_GREY,
                                                            color: 'white',
                                                        }}
                                                        onClick={() => githubPressed({...analyticsBasicParams()})}
                                                        href={github}
                                                        target="_blank"
                                                        fullWidth
                                                        disableElevation
                                                    >
                                                        Project Demo
                                                    </SEButton>
                                                    <SEButton
                                                        variant={"contained"}
                                                        color={"secondary"}
                                                        href={pdf}
                                                        target="_blank"
                                                        sx={{

                                                            marginLeft:'10px',
                                                        }}
                                                        fullWidth
                                                        disableElevation
                                                        onClick={() => {
                                                            viewCVLog({...analyticsBasicParams()})
                                                        }
                                                        }
                                                    >
                                                        View CV
                                                    </SEButton>
                                                    <SEButton
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        sx={{
                                                            marginLeft:'10px',
                                                        }}
                                                        fullWidth
                                                        href={calendly}
                                                        onClick={() => interviewBooked({...analyticsBasicParams()})}
                                                        target="_blank"
                                                        disableElevation
                                                    >
                                                        Book Interview
                                                    </SEButton>
                                                </div>
                                        }

                                    </div>
                                </Grid>
                            </TabPanel>
                            {/*<TabPanel value="2">*/}
                            {/*    /!*<ImageList sx={{ width: '100%', height: "600px" }} variant="masonary" cols={isSmall? images.imagePerRow.mobile: images.imagePerRow.desktop}  gap={20}>*!/*/}
                            {/*    /!*    {images.images.map((item) => (*!/*/}
                            {/*    /!*        <ImageListItem key={item.title}>*!/*/}
                            {/*    /!*            <img*!/*/}
                            {/*    /!*                src={`${item.img}`}*!/*/}
                            {/*    /!*                srcSet={`${item.img}`}*!/*/}
                            {/*    /!*                alt={item.title}*!/*/}
                            {/*    /!*                loading="lazy"*!/*/}
                            {/*    /!*            />*!/*/}
                            {/*    /!*        </ImageListItem>*!/*/}
                            {/*    /!*    ))}*!/*/}
                            {/*    /!*</ImageList>*!/*/}
                            {/*    <Swiper*/}
                            {/*        effect={"coverflow"}*/}
                            {/*        grabCursor={true}*/}
                            {/*        autoplay={{*/}
                            {/*            delay: 1000,*/}
                            {/*        }}*/}
                            {/*        loop={true}*/}
                            {/*        centeredSlides={true}*/}
                            {/*        slidesPerView={isSmall? "1":"3"}*/}
                            {/*        coverflowEffect={{*/}
                            {/*            rotate: 50,*/}
                            {/*            stretch: 0,*/}
                            {/*            depth: 100,*/}
                            {/*            modifier: 1,*/}
                            {/*            slideShadows: false,*/}
                            {/*        }}*/}
                            {/*        pagination={true}*/}
                            {/*        navigation={true}*/}
                            {/*        className="mySwiper"*/}
                            {/*    >*/}
                            {/*        {images?.data?.map(({attributes: {url: img, caption: title}}, i) => {*/}
                            {/*            return (*/}
                            {/*                <SwiperSlide key={i}>*/}
                            {/*                    <img src={img} alt={title} />*/}
                            {/*                </SwiperSlide>*/}
                            {/*            );*/}
                            {/*        })}*/}
                            {/*    </Swiper>*/}
                            {/*</TabPanel>*/}
                        </TabContext>
                    </Grid>

                </Grid>
            </div>
        </Dialog>
    )
};
export default HiringDialog;