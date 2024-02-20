import * as React from 'react';
import * as ToastRadix from '@radix-ui/react-toast';
import { ToastContext } from '../ToastProvider';
import classes from './Toast.module.css'

function Toast() {

  const { toastBody, setIsOpen, isOpen } = React.useContext(ToastContext)

  return (
    <>
      <ToastRadix.Root
        className={classes.ToastRoot}
        open={isOpen}
        onOpenChange={setIsOpen}>
        <ToastRadix.Title className={classes.ToastTitle}>
          {toastBody.title}
        </ToastRadix.Title>

        <ToastRadix.Description className={classes.ToastDescription}>
          {toastBody.description}
        </ToastRadix.Description>

        <ToastRadix.Close />
      </ToastRadix.Root>

      <ToastRadix.Viewport className={classes.ToastViewport} />
    </>
  );
}

export default Toast;
