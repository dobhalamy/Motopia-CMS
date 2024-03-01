import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Grid,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    color: '#000',
    padding: '5px 0',
  },
  label: {
    color: '#000',
  },
  rightColumn: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    padding: '0 24px',
  },
  leftColumn: {
    padding: '0 24px',
  },
});

const ModalRow = props => {
  const { feature, handleCheckBox } = props;
  const { featureName, nadaEquipments, possibleFeatureId } = feature;
  const classes = useStyles();

  const [value, setValue] = React.useState();

  React.useEffect(() => {
    if (props.checked.nadaEquipmentId) {
      const findNada = nadaEquipments.find(
        el => el.id === props.checked.nadaEquipmentId
      );
      if (findNada.description) {
        setValue(findNada.description);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target }) => {
    const { value } = target;
    const pickedNada = nadaEquipments.find(el => el.description === value);
    const newFeature = {
      possibleFeatureId,
      nadaEquipmentId: pickedNada.id,
    };
    handleCheckBox(newFeature);
    setValue(value);
  };

  return (
    <>
      <Box className={classes.root}>
        <Grid container item justify="space-between" alignItems="center">
          <Grid xs={6} container item className={classes.leftColumn}>
            <Typography>{featureName}</Typography>
          </Grid>
          <Grid item xs={6} className={classes.rightColumn}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label={'' + possibleFeatureId}
                name={'' + possibleFeatureId}
                onChange={handleChange}
              >
                {nadaEquipments.map(nada => (
                  <FormControlLabel
                    key={nada.id}
                    value={nada.description}
                    checked={nada.description === value}
                    control={<Radio />}
                    label={nada.description}
                    className={classes.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </>
  );
};

ModalRow.propTypes = {
  feature: PropTypes.object.isRequired,
  handleCheckBox: PropTypes.func.isRequired,
  checked: PropTypes.object,
};

ModalRow.defaultProps = {
  checked: {},
};

export default ModalRow;
