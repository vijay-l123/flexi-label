// PdfIconButton.tsx
import React, { useState } from 'react';
import { IPdfParams } from '../../utils/types';
import { PictureAsPdf } from '@mui/icons-material';
import Controls from '../../Controls/Controls';
import { useDispatch } from 'react-redux';
import { setPdfPopupOpen } from '../../Redux/PopupSlice/PopupSlice';
import { Typography } from '@mui/material';

interface IPdfIconButtonProps {
  dFileId: number;
  isDisabled: Boolean;
}

const PdfIconButton: React.FC<IPdfIconButtonProps> = ({ dFileId, isDisabled }) => {
    const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setPdfPopupOpen(true));
  };

  return (
    isDisabled ? 
    <Typography color={'red'}>File not available</Typography>
    : 
    <Controls.IconButton
      value={dFileId}
      aria-label="close"
      onClick={handleClick}
      color="error"
    >
      <PictureAsPdf fontSize='large' />
    </Controls.IconButton>
  );
};

export default PdfIconButton;
