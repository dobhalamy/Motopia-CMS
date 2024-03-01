import React from 'react';
import { IconButton, Popover, TextField, Box } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import ImageIcon from '@material-ui/icons/Image';
import buttonStyles from './buttonStyles.module.css';

const BasicPopover = props => {
  const [url, setUrl] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState();
  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAddImage = () => {
    if (!url) return;
    const { editorState, onChange, modifier } = props;
    onChange(modifier(editorState, url));
  };
  const handleInput = e => {
    e.stopPropagation();
    setUrl(e.target.value);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className={buttonStyles.buttonWrapper}>
      <button className={buttonStyles.button} style={{ padding: '5px 6px 1px' }} aria-describedby={id} onClick={handleClick}>
        <ImageIcon />
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            name="imageUrl"
            variant="outlined"
            placeholder="Paster the image link"
            size="small"
            onFocus={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onChange={handleInput}
            sx={{ mr: 1 }}
          />
          <IconButton onClick={handleAddImage}>
            <Add />
          </IconButton>
        </Box>
      </Popover>
    </div>
  );
};

export default BasicPopover;
