import * as React from 'react';
import * as ToastRadix from '@radix-ui/react-toast';
import { ToastContext } from '../ToastProvider';
import classes from './Toast.module.css'
import { X } from "lucide-react";

function Toast() {

  const { toastBody, setIsOpen, isOpen } = React.useContext(ToastContext)

  return (
    <>
      <ToastRadix.Root
        className={classes.ToastRoot}
        duration={1000 * 10}
        open={isOpen}
        onOpenChange={setIsOpen}>
        <ToastRadix.Title className={classes.ToastTitle}>
          {toastBody.title}
        </ToastRadix.Title>

        <ToastRadix.Description className={classes.ToastDescription}>
          {toastBody.description}
        </ToastRadix.Description>

        <ToastRadix.Close className={classes.Close}>
          <X />
        </ToastRadix.Close>
      </ToastRadix.Root>

      <ToastRadix.Viewport className={classes.ToastViewport} />
    </>
  );
}

export default Toast;
