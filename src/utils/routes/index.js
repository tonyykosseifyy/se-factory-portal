import HiringPortal from "../../pages/HiringPortal";
import WelcomeScreen from "../../pages/WelcomeScreen";
import MainLayout from "../../layouts/Main";

export const HIRING_PORTAL_ROUTE = {
    path: '/',
    name: 'Hiring Portal',
    component: HiringPortal,
    protectedRoute: true,
    exact: true
}

export const ROUTES_WITH_LAYOUT = [
    {
        layout: MainLayout,
        routes: [HIRING_PORTAL_ROUTE],
    },
]
