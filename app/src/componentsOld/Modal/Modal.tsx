import classes from './Modal.module.css'
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

function Modal({
  isOpen, handleOpen, children,
  title, description
}) {
  return (<Dialog.Root onOpenChange={handleOpen} open={isOpen} >
    <Dialog.Portal>
      <Dialog.Overlay className={classes.DialogOverlay} />
      <Dialog.Content className={classes.DialogContent}>
        <Dialog.Title className="title1 text-center">{title}</Dialog.Title>
        <Dialog.Description className="title2 mt-1 text-center" >
          {description}
        </Dialog.Description>

        <Dialog.Close asChild>
          <button className={`clearButton ${classes.IconButton}`} aria-label="Close">
            <X size={25} />
          </button>
        </Dialog.Close>

        {children}

      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>);
}

export default Modal;
