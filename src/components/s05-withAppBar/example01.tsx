import React, {ReactNode, useCallback, useEffect, useState} from "react";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import clsx from "clsx";

import {
    AppBar,
    Button,
    Collapse,
    DrawerProps,
    Drawer,
    Fade,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemProps,
    ListItemText,
    ListSubheader,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Theme, withStyles, WithStyles} from "@material-ui/core/styles";
import {Styles} from "@material-ui/core/styles/withStyles";
import {Add, Home, Menu as MenuIcon, Remove, ShowChart, SvgIconComponent, Web} from "@material-ui/icons";


/**
 * Style Definition
 */
const styles: Styles<Theme, {}> = (theme) => ({
    root: {
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    toolBarMargin: theme.mixins.toolbar,
    aboveDrawer: {
        zIndex: theme.zIndex.drawer + 1
    },
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
type WithStylesComponentProps = WithStyles<typeof styles>;



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
        {label: 'CPU Add', Icon: Add, active: false, path: '/cpu/add'},
        {label: 'CPU Remove', Icon: Remove, active: false, path: '/cpu/remove'},
        {label: 'CPU Usage', Icon: ShowChart, active: false, path: '/cpu/usage'},
    ],
    MEMORY: [
        {label: 'Memory Add', Icon: Add, active: false, path: '/memory/add'},
        {label: 'Memory Remove', Icon: Remove, active: false, path: '/memory/remove'},
        {label: 'Memory Usage', Icon: ShowChart, active: false, path: '/memory/usage'},
    ],
    STORAGE: [
        {label: 'Storage Add', Icon: Add, active: false, path: '/storage/add'},
        {label: 'Storage Remove', Icon: Remove, active: false, path: '/storage/remove'},
        {label: 'Storage Usage', Icon: ShowChart, active: false, path: '/storage/usage'},
    ],
    NETWORK: [
        {label: 'Network Add', Icon: Add, active: false, path: '/network/add'},
        {label: 'Network Remove', Icon: Remove, active: false, path: '/network/remove'},
        {label: 'Network Usage', Icon: ShowChart, active: false, path: '/network/usage'},
    ]
};


/**
 * AppBar
 */
type CustomizableAppBarProps = WithStylesComponentProps & {
    title?: ReactNode;
    rightButton?: ReactNode;
    onMenuOpen: React.MouseEventHandler<HTMLButtonElement>;
    downScrolling: boolean;
    animation: 'fade' | 'grow';
};
const CustomizableAppBar = withStyles(styles)((
    {
        title = (
            <Typography variant="h6" color="inherit">
                TITLE
            </Typography>
        ),
        rightButton = (
            <Button color="secondary" variant="contained">
                X
            </Button>
        ),
        classes,
        onMenuOpen,
        downScrolling,
        animation
    }: CustomizableAppBarProps
) => {

    /**
     * AppBar
     */
    const appBar = (
        <>
            <AppBar className={classes.aboveDrawer}>
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={onMenuOpen}>
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.flex}>
                        {title}
                    </div>
                    {rightButton}
                </Toolbar>
            </AppBar>
            <div className={classes.toolBarMargin} />
        </>
    );

    return animation === 'fade' ? (
        <Fade in={!downScrolling}>
            {appBar}
        </Fade>
    ) : (
        <Grow in={!downScrolling}>
            {appBar}
        </Grow>
    );
});


/**
 * Application
 */

type DrawerNavigationProps = WithStylesComponentProps & {
    drawerVariant?: DrawerProps['variant'];
};
const AppBarInteraction = withStyles(styles)((
    {
        classes,
        drawerVariant = 'temporary'
    }: DrawerNavigationProps
) => {

    /**
     * get proxy of the location object for browser router
     */
    const location = useLocation();

    /**
     * Component State
     */
    const [open, setOpen] = useState(false);
    const [downScrolling, setDownScrolling] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [titleString, setTitleString] = useState('');
    const [items, setItems] = useState<DrawerGroupsType>(initialItems);
    const [sections, setSections] = useState<DrawerGroupsToggleState>(
        Object.keys(initialItems).reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );

    /**
     * Toggle Drawer
     */
    const toggleDrawer = useCallback(() => {
        setOpen(prevState => !prevState);
    }, [setOpen]);

    /**
     * Close Drawer
     */
    const closeDrawer = useCallback(() => setOpen(false), [setOpen]);

    /**
     * Toggle Navigation Group
     */
    const toggleSection = useCallback((subHeader: string) => () => setSections(
        prevState => ({...prevState, [subHeader]: !prevState[subHeader]})
    ), [setSections]);

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
     * Get Label from Provided Path Name
     */
    const getTitleForCurrentPath = useCallback((path: RouterLinkType['path']) => {
        const item = Object.keys(items)
            .map((subHeader) =>
                items[subHeader]
                    .filter((drawerListItem) => drawerListItem.path === path)
            )
            .flat()
        ;
        setTitleString(item.length > 0 ? item[0].label : path);
    }, [setTitleString]);

    /**
     * On Scroll
     */
    const onScroll: EventListener = useCallback((event: Event) => {
        const eventTarget = event.target as typeof document;
        setDownScrolling(eventTarget.documentElement.scrollTop > scrollTop);
        setScrollTop(eventTarget.documentElement.scrollTop);
    }, [setDownScrolling, setScrollTop, scrollTop]);

    /**
     * Register On Scroll Event
     * */
    useEffect(() => {
        window.addEventListener('scroll', onScroll, true);

        return () => {
            window.removeEventListener('scroll', onScroll, true);
        };
    }, [onScroll]);

    /**
     * When Path Name Changes
     */
    useEffect(() => {
        setNavItemActive(location.pathname);
        getTitleForCurrentPath(location.pathname);
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
                  // onClick={closeDrawer}
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
                            <>
                                {Array(100).fill(null).map(() => (
                                    <Typography>{label}</Typography>
                                ))}
                            </>
                        )}
                    />
                ))
        );

    /**
     * Component Structure
     */
    return (
        <div className={classes.root}>
            {/*@ts-ignore*/}
            <CustomizableAppBar animation="fade"
                                downScrolling={downScrolling}
                                onMenuOpen={toggleDrawer}
                                title={(
                                    <Typography>{titleString}</Typography>
                                )}
                                rightButton={(
                                    <Button color="secondary" variant="contained">
                                        LOGIN
                                    </Button>
                                )}
            />
            <Routes>
                {RoutePageMapping(items)}
            </Routes>
            <Drawer variant={drawerVariant} open={open} onClose={closeDrawer}>
                <div
                    className={clsx({
                        [classes.toolBarMargin]: drawerVariant === 'persistent'
                    })}
                />
                <List>
                    {DrawerGroups(items)}
                </List>
            </Drawer>
        </div>
    );
})
export default AppBarInteraction;
