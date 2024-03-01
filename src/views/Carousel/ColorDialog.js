import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { SketchPicker } from 'react-color';

const useStyles = makeStyles({
  variantContainer: {
    margin: '10px 0px',
    padding: '8px 0px',
    borderTop: '1px solid #001C5E',
  },
  viewAllContainer: {
    padding: '8px 0px',
  },
  colorText: {
    width: 100,
    padding: 5,
  },
  colorTextGrid: {
    marginBottom: 20,
  },
  colorBox: {
    height: 10,
    width: 10,
    paddingLeft: 10,
    border: '1px solid',
    display: 'inline-block',
    cursor: 'pointer',
  },
  SlideTitle: {
    marginTop: 16,
    width: 100,
    padding: 5,
  },
  SlideTextBox: {
    width: '100%',
  },
});

function ColorDialog(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    type: 'text',
    textColor: '#000000',
    activeBg: false,
    bgColor: '#ffffff',
    slideSpeed: 300,
  });

  const { isOpen, headerTitle, handleClose, categorySetting } = props;

  React.useEffect(() => {
    if (categorySetting) {
      setState({ ...state, textColor: categorySetting.color, bgColor: categorySetting.bgColor, slideSpeed: categorySetting.slideSpeed });
    }
    // eslint-disable-next-line
  }, [categorySetting]);

  const selectTextColor = color => {
    setState({
      ...state,
      textColor: color.hex,
    });
  };

  const selectBgColor = color => {
    setState({
      ...state,
      bgColor: color.hex,
    });
  };

  const handleUpdate = () => {
    const { textColor, bgColor, slideSpeed } = state;
    props.updateSetting({
      text: textColor,
      bgColor: bgColor,
      slideSpeed: slideSpeed,
    });
  };

  const handleUpdateSlideSpeed = event => {
    setState({
      ...state,
      slideSpeed: event.target.value,
    });
  };

  const selectColorPicker = color => {
    const { type } = state;
    if (type === 'text') {
      selectTextColor(color);
    }
    if (type === 'bgColor') {
      selectBgColor(color);
    }
  };

  const selectColorType = colorType => {
    setState({
      ...state,
      type: colorType,
    });
  };

  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title" onClose={handleClose}>
      <DialogTitle id="form-dialog-title">{headerTitle}</DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <Grid className={classes.viewAllContainer} container justify="space-between" wrap="nowrap">
            <Grid item xs={4}>
              <Grid item xs={12} className={classes.colorTextGrid}>
                <Typography className={classes.colorText} variant="body1">
                  Text
                </Typography>
                <Typography className={classes.colorText} variant="body1">
                  {state.textColor}{' '}
                  <div className={classes.colorBox} style={{ backgroundColor: state.textColor, border: `${state.type === 'text' ? '2px Solid' : ''}` }} onClick={() => selectColorType('text')}></div>
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.colorTextGrid}>
                <Typography className={classes.colorText} variant="body1">
                  BgColor
                </Typography>
                <Typography className={classes.colorText} variant="body1">
                  {state.bgColor}{' '}
                  <div
                    className={classes.colorBox}
                    style={{ backgroundColor: state.bgColor, border: `${state.type === 'bgColor' ? '2px Solid' : ''}` }}
                    onClick={() => selectColorType('bgColor')}
                  ></div>
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <SketchPicker color={state.textColor} onChangeComplete={selectColorPicker} />
            </Grid>
          </Grid>
          <Grid className={classes.viewAllContainer} container justify="space-between" wrap="nowrap">
            <Grid item xs={4}>
              <Typography className={classes.SlideTitle} variant="body1">
                Slide speed
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="standard-number"
                label="Slide speed in second"
                type="number"
                value={state.slideSpeed}
                onChange={handleUpdateSlideSpeed}
                className={classes.SlideTextBox}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {'Close'}
        </Button>
        <Button onClick={handleUpdate} color="primary">
          {'Update Setting'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ColorDialog;
