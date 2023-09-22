import mixpanel from 'mixpanel-browser'

const EVENTS = {
    PORTAL_ACCESSED: "Portal Accessed",
    PROJECT_PRESSED: "Project Pressed",
    LIVE_PROJECT_PRESSED: "Live Project Pressed",
    INTERVIEW_BOOKED: "Book Interview Pressed",
    GITHUB_PRESSED: "Github Project Pressed",
    VIDEO_PLAYED: "Video Played",
    SEARCH: 'Search',
    VIEW_CV: 'View CV',
    HOVERED_OVER_CARD: "Hover Card",
    BEHANCE_PRESSED: "Behance Pressed",
}

export const behancePressed = ({user, graduateProfile, bootcamp}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.BEHANCE_PRESSED, {
        graduateProfile, bootcamp
    })
}

export const liveProjectPressed = ({user, graduateProfile, bootcamp, pressedOn}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.LIVE_PROJECT_PRESSED, {
        graduateProfile, bootcamp, pressedOn
    })
}

export const hoveredOverLog = ({user, graduateProfile, bootcamp}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.HOVERED_OVER_CARD, {
        graduateProfile, bootcamp
})}


export const viewCVLog = ({ user, graduateProfile, bootcamp }) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.VIEW_CV, {
        graduateProfile, bootcamp
})}

export const searchLog = ({ user, languages, projectTypes, dataVisualizationTools, cloudPlatforms, databaseTechnologies, bootcamp }) => {
    if(user){
        mixpanel.identify(user.email)
        mixpanel.track(EVENTS.SEARCH, {
            languages, projectTypes, dataVisualizationTools, cloudPlatforms, databaseTechnologies, bootcamp
        })
    }
}

// done 
export const portalAccessed = ({ user }) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.PORTAL_ACCESSED)
    mixpanel.people.set({
        "$name": user.username,
        "$email": user.email,
        "$first_name": user.username
    })
}

export const projectPressed = ({ user,graduateProfile, bootcamp, pressedOn }) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.PROJECT_PRESSED, {
        graduateProfile, bootcamp, pressedOn
    })
}

export const interviewBooked = ({user,graduateProfile,  bootcamp}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.INTERVIEW_BOOKED, {
        graduateProfile, bootcamp
    })
}

export const githubPressed =  ({user, graduateProfile,  bootcamp}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.GITHUB_PRESSED, {
        graduateProfile, bootcamp
    })
}

export const videoPlayed =  ({user, graduateProfile, bootcamp }) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.VIDEO_PLAYED, {
        graduateProfile, bootcamp
    })
}