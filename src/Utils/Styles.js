import { drawerWidth } from "./constants";

export const globalStyles = {
    root: {
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",
    },
    navbar: {
        width: drawerWidth,
        flexShrink: 0,
        zIndex: 2,
    },
    singleLine: { wordBreak: 'keep-all', whiteSpace: 'nowrap'},
}