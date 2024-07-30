// useAlertDialog.jsx
import { useState, useCallback } from 'react';

const useAlertDialog = () => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    content: '',
    buttonOne: '',
    buttonTwo: '',
    onAccept: () => {},
    onClose: () => {},
  });

  const openDialog = useCallback((title, content, onAccept, onClose, buttonOne, buttonTwo) => {
    setDialogState({
      isOpen: true,
      title,
      content: content,
      onAccept: onAccept,
      buttonOne,
      buttonTwo,
      onClose,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  }, []);

  return {
    dialogState,
    openDialog,
    closeDialog,
  };
};

export default useAlertDialog;
