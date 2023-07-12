import mixpanel from 'mixpanel-browser'

const EVENTS = {
    PORTAL_ACCESSED: "Portal Accessed",
    PROJECT_PRESSED: "Project Pressed",
    INTERVIEW_BOOKED: "Book Interview Pressed",
    GITHUB_PRESSED: "Project Pressed",
    CV_VIEWED: "CV Viewed",
    VIDEO_PLAYED: "Video Played",
    PROJECT_PICTURES_VIEWED: "Project Pictures Viewed",
    SEARCH: 'Search',
    VIEW_CV: 'View CV',
    HOVERED_OVER_CARD: "Hover Card"
}


export const hoveredOverLog = ({user, graduateProfile, languages, projectType, graduateStatus}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.HOVERED_OVER_CARD, {
        graduateProfile, programmingLanguages: languages.map(e=> e.language), projectType: projectType.map(e=> e.type), graduateStatus
    })}


export const viewCVLog = ({user, graduateProfile, languages, projectType, graduateStatus}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.VIEW_CV, {
        graduateProfile, programmingLanguages: languages.map(e=> e.language), projectType: projectType.map(e=> e.type), graduateStatus
    })}

export const searchLog = ({user, prevLanguages, prevProjectTypes}) => {
    if(user){
        mixpanel.identify(user.email)
        mixpanel.track(EVENTS.SEARCH, {
            programmingLanguages: prevLanguages , projectType: prevProjectTypes
        })
    }

}
export const portalAccessed = ({user}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.PORTAL_ACCESSED)
    mixpanel.people.set({
        "$name": user.username,
        "$email": user.email,
        "$first_name": user.username
    })

}

export const projectPressed = ({user, graduateProfile, languages, projectType, graduateStatus, pressedOn}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.PROJECT_PRESSED, {
        graduateProfile, programmingLanguages: languages.map(e=> e.language), projectType: projectType.map(e=> e.type), graduateStatus, pressedOn
    })
}

export const interviewBooked = ({user, graduateProfile, languages, projectType, graduateStatus}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.INTERVIEW_BOOKED, {
        graduateProfile, programmingLanguages: languages.map(e=> e.language), projectType: projectType.map(e=> e.type), graduateStatus
    })
}

export const githubPressed =  ({user, graduateProfile, languages, projectType, graduateStatus}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.GITHUB_PRESSED, {
        graduateProfile, programmingLanguages: languages.map(e=> e.language), projectType: projectType.map(e=> e.type), graduateStatus
    })
}

export const videoPlayed =  ({user, graduateProfile, languages, projectType, graduateStatus}) => {
    mixpanel.identify(user.email)
    mixpanel.track(EVENTS.VIDEO_PLAYED, {
        graduateProfile, programmingLanguages: languages.map(e=> e.language), projectType: projectType.map(e=> e.type), graduateStatus
    })
}