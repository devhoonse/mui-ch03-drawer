import React, {useState} from "react";
import {Grid, Drawer, Button, List, ListItem, ListItemIcon, ListItemText, DrawerProps} from "@material-ui/core";

/**
 * Application
 */
type DrawerTypesProps = {
    drawerVariant: DrawerProps['variant'];
};
export default function DrawerTypes({ drawerVariant }: DrawerTypesProps) {

    /**
     * Component State
     */
    const [open, setOpen] = useState(false);

    /**
     * Component Structure
     */
    return (
        <Grid container justifyContent="space-between">
            <Grid item>
                <Drawer variant={drawerVariant} open={open} onClose={() => setOpen(false)}>
                    <List>
                        <ListItem button onClick={() => setOpen(drawerVariant !== 'temporary')}>
                            <ListItemText>Home</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => setOpen(drawerVariant !== 'temporary')}>
                            <ListItemText>About</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => setOpen(drawerVariant !== 'temporary')}>
                            <ListItemText>Profile</ListItemText>
                        </ListItem>
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
