import React, {useCallback, useEffect, useState} from "react";
import {Link, Routes, Route, useLocation} from "react-router-dom";
import clsx from "clsx";

import {Grid, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {ListItemProps} from "@material-ui/core";
import {withStyles, Theme, WithStyles} from "@material-ui/core/styles";
import {Styles} from "@material-ui/core/styles/withStyles";
import {SvgIconComponent, Home, Web} from "@material-ui/icons";


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


/**
 * Constants
 */
const initialItems: DrawerListItemsType = [
    { label: 'Home', Icon: Home, active: true, path: '/' },
    { label: 'Page2', Icon: Web, active: false, path: '/page2' },
    { label: 'Page3', Icon: Web, active: false, path: '/page3', disabled: true },
    { label: 'Page4', Icon: Web, active: false, path: '/page4', hidden: true },
    { label: 'Page5', Icon: Web, active: false, path: '/page5' },
];


/**
 * Application
 */
type WithStylesComponentProps = WithStyles<typeof styles>;
type DrawerNavigationProps = WithStylesComponentProps
function DrawerNavigation ({ classes }: DrawerNavigationProps) {

    /**
     * get proxy of the location object for browser router
     */
    const location = useLocation();

    /**
     * Component State
     */
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<DrawerListItemsType>(initialItems);

    /**
     * Set Navigation Item Active
     */
    const setNavItemActive = useCallback((path: RouterLinkType['path']) => {
        setItems(prevState => prevState.map((value) => ({
            ...value,
            active: value['path'] === path
        })));
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
                  style={{ textDecoration: 'none', ...(disabled ? { pointerEvents: 'none' } : {}) }}
                  onClick={() => {
                      setOpen(false);
                  }}
            >
                <ListItem
                    button
                    key={index}
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

    /**
     * Router Mapping
     */
    const RoutePageMapping = (items: DrawerListItemsType) => items
        .filter(({ hidden, disabled }) => !(hidden || disabled))
        .map(({ path, label, Icon }, index) => (
            <Route
                key={index}
                path={path}
                element={(
                    <Typography>{label}</Typography>
                )}
            />
        ));

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
                        {DrawerListItems(items)}
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
export default withStyles(styles)(DrawerNavigation);
