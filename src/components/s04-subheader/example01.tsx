import React, {useCallback, useEffect, useState} from "react";
import {Link, Routes, Route, useLocation} from "react-router-dom";
import clsx from "clsx";

import {Grid, Collapse, Button, Drawer, List, ListSubheader, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {ListItemProps} from "@material-ui/core";
import {withStyles, Theme, WithStyles} from "@material-ui/core/styles";
import {Styles} from "@material-ui/core/styles/withStyles";
import {SvgIconComponent, Home, Web, Add, Remove, ShowChart} from "@material-ui/icons";


/**
 * Style Definition
 */
const styles: Styles<Theme, {}> = (theme) => ({
    alignContent: {
        alignSelf: 'center'
    },
    activeListItem: {
        color: theme.palette.primary.main,
        backgroundColor: 'rgba(150,150,150,0.5)'
    },
    listSubHeader: {
        padding: 0,
        minWidth: 0,
        color: 'inherit',
        '&:hover': {
            background: 'inherit'
        }
    }
});


/**
 * Type Definition
 */
type RouterLinkType = {
    path: string;
    active: boolean;
};
type DrawerListItemType = ListItemProps & RouterLinkType & {
    label: string;
    Icon: SvgIconComponent;
};
type DrawerListItemsType = Array<DrawerListItemType>;
type DrawerGroupsType = {
    [SubHeader: string]: DrawerListItemsType
}
type DrawerGroupsToggleState = {
    [SubHeader: string]: boolean;
}


/**
 * Constants
 */
const initialItems: DrawerGroupsType = {
    EXAMPLE: [
        {label: 'Home', Icon: Home, active: false, path: '/'},
        {label: 'Page2', Icon: Web, active: false, path: '/page2'},
        {label: 'Page3', Icon: Web, active: false, path: '/page3', disabled: true},
        {label: 'Page4', Icon: Web, active: false, path: '/page4', hidden: true},
        {label: 'Page5', Icon: Web, active: false, path: '/page5'},
    ],
    CPU: [
        {label: 'Add', Icon: Add, active: false, path: '/cpu/add'},
        {label: 'Remove', Icon: Remove, active: false, path: '/cpu/remove'},
        {label: 'Usage', Icon: ShowChart, active: false, path: '/cpu/usage'},
    ],
    MEMORY: [
        {label: 'Add', Icon: Add, active: false, path: '/memory/add'},
        {label: 'Remove', Icon: Remove, active: false, path: '/memory/remove'},
        {label: 'Usage', Icon: ShowChart, active: false, path: '/memory/usage'},
    ],
    STORAGE: [
        {label: 'Add', Icon: Add, active: false, path: '/storage/add'},
        {label: 'Remove', Icon: Remove, active: false, path: '/storage/remove'},
        {label: 'Usage', Icon: ShowChart, active: false, path: '/storage/usage'},
    ],
    NETWORK: [
        {label: 'Add', Icon: Add, active: false, path: '/network/add'},
        {label: 'Remove', Icon: Remove, active: false, path: '/network/remove'},
        {label: 'Usage', Icon: ShowChart, active: false, path: '/network/usage'},
    ]
};


/**
 * Application
 */
type WithStylesComponentProps = WithStyles<typeof styles>;
type DrawerNavigationProps = WithStylesComponentProps
function DrawerSection ({ classes }: DrawerNavigationProps) {

    /**
     * get proxy of the location object for browser router
     */
    const location = useLocation();

    /**
     * Component State
     */
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<DrawerGroupsType>(initialItems);
    const [sections, setSections] = useState<DrawerGroupsToggleState>(
        Object.keys(initialItems).reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );

    /**
     * Toggle Navigation Group
     */
    const toggleSection = (subHeader: string) => () => setSections(
        prevState => {
            const nextState = { ...prevState, [subHeader]: !prevState[subHeader] };
            console.log({ nextState });
            return nextState;
        }
    );

    /**
     * Set Navigation Item Active
     */
    const setNavItemActive = useCallback((path: RouterLinkType['path']) => {
        setItems(prevState => {
            const nextState = { ...prevState };
            for (const subHeader in nextState) {
                nextState[subHeader] = nextState[subHeader].map((value) => ({
                    ...value,
                    active: value['path'] === path
                }))
            }
            return nextState;
        });
    }, [setItems]);

    /**
     * When Path Name Changes
     */
    useEffect(() => {
        setNavItemActive(location.pathname);
    }, [location.pathname]);

    /**
     * Render Menu Items
     */
    const DrawerListItems = (items: DrawerListItemsType) => items
        .filter(({ hidden }) => !hidden)
        .map(({ active, path, label, hidden, disabled, Icon }, index) => (
            <Link to={path}
                  key={index}
                  style={{ textDecoration: 'none', ...(disabled ? { pointerEvents: 'none' } : {}) }}
                  onClick={() => {
                      setOpen(false);
                  }}
            >
                <ListItem
                    button
                    hidden={hidden}
                    disabled={disabled}
                >
                    <ListItemIcon classes={{ root: clsx({ [classes.activeListItem]: active }) }}>
                        <Icon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: clsx({ [classes.activeListItem]: active }) }}>
                        {label}
                    </ListItemText>
                </ListItem>
            </Link>
        ));
    const DrawerGroups = (items: DrawerGroupsType) => (
        <>
            {Object.keys(items).map((subHeader, index) => [
                <ListSubheader key={2*index}>
                    <Button disableRipple
                            classes={{ root: classes.listSubHeader }}
                            onClick={toggleSection(subHeader)}
                    >
                        {subHeader}
                    </Button>
                </ListSubheader>,
                <Collapse in={sections[subHeader]} key={2*index + 1}>
                    {DrawerListItems(items[subHeader])}
                </Collapse>
            ]).flat()}
        </>
    );

    /**
     * Router Mapping
     */
    const RoutePageMapping = (items: DrawerGroupsType) => Object.keys(items)
        .map((subHeader) =>
            items[subHeader]
                .filter(({ hidden, disabled }) => !(hidden || disabled))
                .map(({ path, label, Icon }, index) => (
                    <Route
                        key={index}
                        path={path}
                        element={(
                            <Typography>{label}</Typography>
                        )}
                    />
                ))
        );

    /**
     * Component Structure
     */
    return (
        <Grid container justifyContent="space-between">
            <Grid item className={classes.alignContent}>
                <Routes>
                    {RoutePageMapping(items)}
                </Routes>
            </Grid>
            <Grid item>
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <List>
                        {DrawerGroups(items)}
                    </List>
                </Drawer>
            </Grid>
            <Grid item>
                <Button variant="outlined" onClick={() => setOpen(!open)}>
                    {open ? 'Hide' : 'Show'} Drawer
                </Button>
            </Grid>
        </Grid>
    );
}
export default withStyles(styles)(DrawerSection);
