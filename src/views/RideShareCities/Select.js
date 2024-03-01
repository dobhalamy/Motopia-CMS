import * as React from 'react';
import { Grid, makeStyles, MenuItem, OutlinedInput, Select as MuiSelect, Typography, useTheme } from '@material-ui/core';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 400,
        },
    },
};

const names = [];

const useStyles = makeStyles({
    label: { paddingLeft: 16, textTransform: 'none' }
});

function getStyles(name, displayName, theme) {
    return {
        fontWeight:
            displayName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function Select({ options = names, max = 99, onChange, isMulti = false, value, required, title }) {
    const theme = useTheme();
    const classes = useStyles();
    const [displayName, setDisplayName] = React.useState([]);

    React.useEffect(() => {
        if (value) setDisplayName(value);
    }, [value])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setDisplayName(value);
        onChange(event);
    };

    return (
        <Grid
            item
            container
            style={{ marginTop: 20 }}
            wrap="nowrap"
            xs={12}
            md={8}
        >
            <Grid item xs={6} md={6}>
                <Typography className={classes.label} variant="h6">
                    {title}{required && <span style={{ color: 'red' }}>*</span>}
                </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
                <MuiSelect
                    id="multiple-select"
                    multiple={isMulti}
                    value={displayName}
                    placeholder="test"
                    onChange={handleChange}
                    input={<OutlinedInput fullWidth />}
                    MenuProps={MenuProps}
                >
                    {options.map((opt) => (
                        <MenuItem
                            key={opt.value}
                            value={opt.value}
                            style={getStyles(opt.value, displayName || [], theme)}
                        >
                            {opt.text}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </Grid>
        </Grid>


    );
}
