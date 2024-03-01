import React from "react";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import { makeStyles } from "@material-ui/core/styles";
import RideShare from "components/CategoriesPage/RideShare";
import LifeStyle from "components/CategoriesPage/LifeStyle";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
    toggleButtons: {
        width: '50%',
    },
    activeToggle: {
        backgroundColor: 'gray',
        width: '50%'
    }
}));
export default function Category() {
    const classes = useStyles();

    const [state, setState] = React.useState({
        isRideShare: true,
    });

    const toggleRideShare = () => {
        setState({ ...state, isRideShare: true });

    }
    const toggleLifeStyle = () => {
        setState({ ...state, isRideShare: false });

    }
    return (
        <GridContainer>
            <GridItem xs={12} style={{ margin: 10 }}>
                <Button
                    onClick={toggleRideShare}
                    className={state.isRideShare ? classes.activeToggle : classes.toggleButtons}
                    variant="contained"
                >
                    Rideshare category
                </Button>
                <Button
                    onClick={toggleLifeStyle}
                    className={!state.isRideShare ? classes.activeToggle : classes.toggleButtons}
                    variant="contained"
                >
                    LifeStyle category
            </Button>
            {state.isRideShare===true ? 
            <RideShare  isRideShare={state.isRideShare}/>
            :
            <LifeStyle  isRideShare={state.isRideShare}/>
            }
            </GridItem>
        </GridContainer>
    );
}
