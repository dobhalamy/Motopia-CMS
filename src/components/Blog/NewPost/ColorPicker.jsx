import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';

import buttonStyles from './buttonStyles.module.css';

const TEXT_COLORS = [
  { name: 'text', value: '#4E4E51' },
  { name: 'main', value: '#001C5E' },
  { name: 'contrast', value: '#FD151B' },
  { name: 'cta', value: '#FFAE00' },
  { name: 'black', value: '#000' },
];

const ITEM_HEIGHT = 48;

const ColorPicker = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChoose = color => {
    props.toggleColor(color);
    handleClose();
  };

  return (
    <div className={buttonStyles.buttonWrapper}>
      <button className={buttonStyles.button} style={{ padding: '5px 6px 1px' }} aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
        <FormatColorTextIcon />
      </button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
      >
        {TEXT_COLORS.map(color => (
          <MenuItem dense key={color.name} onClick={e => handleChoose(color.value)}>
            <span style={{ width: 15, height: 15, backgroundColor: color.value }} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ColorPicker;
