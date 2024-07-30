/*
    How styles work in MUI v5+

    Every MUI v5 component has a property called "sx". Thats the best way to
    color and change the components appearance. This prop can take either
    a dictionary of style values, like usual react component, or also
    a function that receives a theme variable, and can be used to color with
    default palettes, use spacing, and such.

    On this file are the styles that ive been seen used multiple times across\
    the code base. Lets keep copypasting to a minimum.

    If we want to override styles on top of that, like a custom button that also has
    some modifications, we can use 'styled' components and use their sx property
    on top.

*/

import { drawerWidth } from "./constants";

export const StyleContent = (theme) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: theme.spacing(3),
    //backgroundColor: "#ffffff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(1),
    overflowY: "auto",
});


export const StyleContentWithNavBar = (theme) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: theme.spacing(3),
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(1),
    overflowY: "auto",
    marginInline: 'auto',
});

export const StyleButtonContainter = (theme) => ({
    padding: theme.spacing(2), // Ensure buttons have their own padding
    display: "flex",
    gap: theme.spacing(2), // Use gap property to space out buttons
});

export const StyleStickyButtonContainter = (theme) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    position: "sticky",
    top: 0,
    //backgroundColor: "#ffffff",
    zIndex: 1,
    borderBottom: "1px solid #e0e0e0",
});

export const StylePaper = (theme) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
})

export const StyleHeader = (theme) => ({
    padding: theme.spacing(2),
    fontWeight: "bold",
    fontSize: "1.5rem",
    color: "#333",
})

export const StyleButton = (theme) => ({
    padding: theme.spacing(1),
    backgroundColor: "#e0e0e0",
    color: "#333",
    '&:hover': {
      backgroundColor: "#d0d0d0",
    },
})