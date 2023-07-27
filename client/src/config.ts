import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from "react-icons/fi";

const config = {
    parentFeature: "Events",
    localStorageId: "eventId",
    dashboardNavLinks: [
        {
            name: "Events",
            icon: FiHome,
            href: `/#/`,
        },
        {
            name: "Participants",
            icon: FiTrendingUp,
            href: "/#/participants/",
        },
    ],
}

export default config;