import React, {useCallback, useState} from "react";

import {Grid, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {ListItemProps} from "@material-ui/core";
import {SvgIconComponent, Home, Web} from "@material-ui/icons";


/**
 * Type Definition
 */
type DrawerListItemType = ListItemProps & { label: string, Icon: SvgIconComponent };
type DrawerListItemsType = Array<DrawerListItemType>;


/**
 * Constants
 */
const initialItems: DrawerListItemsType = [
    { label: 'Home', Icon: Home },
    { label: 'Page2', Icon: Web },
    { label: 'Page3', Icon: Web, disabled: true },
    { label: 'Page4', Icon: Web, hidden: true },
    { label: 'Page5', Icon: Web },
];


/**
 * Application
 */
export default function DrawerItemState() {

    /**
     * Component State
     */
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [items] = useState<DrawerListItemsType>(initialItems);

    /**
     * On Drawer Menu Item Click
     */
    const onClick = useCallback((content: DrawerListItemType['label']) => () => {
        setOpen(false);
        setContent(content);
    }, [setOpen, setContent]);

    /**
     * Render Menu Items
     */
    type ListItemsProps = {
        items: DrawerListItemsType
    };
    const ListItems = ({ items }: ListItemsProps) => (
        <>
            {items
                .filter(({ hidden }) => !hidden)
                .map(({ label, hidden, disabled, Icon }, index) => (
                    <ListItem
                        button
                        key={index}
                        hidden={hidden}
                        disabled={disabled}
                        onClick={onClick(label)}
                    >
                        <ListItemIcon>
                            <Icon />
                        </ListItemIcon>
                        <ListItemText>
                            {label}
                        </ListItemText>
                    </ListItem>
                ))}
        </>
    );

    /**
     * Component Structure
     */
    return (
        <Grid container justifyContent="space-between">
            <Grid item>
                <Typography>
                    {content}
                </Typography>
            </Grid>
            <Grid item>
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <List>
                        <ListItems items={items} />
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

