import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { styled } from "styled-components";

function Modal({
  isOpen, handleOpen, children,
  title, description
}) {
  return (<Dialog.Root onOpenChange={handleOpen} open={isOpen} >
    <Dialog.Portal>
      <Overlay />
      <Content>
        <Title>{title}</Title>
        <Description>
          {description}
        </Description>

        <Dialog.Close asChild>
          <IconButton aria-label="Close">
            <X size={25} />
          </IconButton>
        </Dialog.Close>

        {children}

      </Content>
    </Dialog.Portal>
  </Dialog.Root>);
}

export default Modal;

const IconButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  border: none;
  color: var(--text-color-alpha-8);
  position: absolute;
  top: 25px;
  right: 20px;

  @media screen and (min-width: 0px) and (max-width: 640px) {
  & {
    position: absolute;
    top: 10px;
    left: 100px;
    /* background-color: red!important; */
  }
}
`

const Description = styled(Dialog.Description)`
  margin: 10px 0 20px;
  color: var(--text-color-alpha-8);
  font-size: 15px;
  line-height: 1.5;
  font-family: var(--secondary-font-family);
  text-align: center;
`

const Title = styled(Dialog.Title)`
font-family: var(--primary-font-family);
text-align: center;
`

const Overlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.76);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 3;

  
@keyframes overlayShow {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes contentShow {
  from {
    opacity: 0;
    transform: translate(-50%, 100%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0%) scale(1);
  }
}
`;

const Content = styled(Dialog.Content)`
  
  overflow-y: scroll;
  z-index: 4;
  background-color: var(--color-secondary-dark);
  border-radius: 8px 8px 0px 0px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);
  width: 150vw;
  max-width: 700px;
  height: 90vh;
  padding: 50px 100px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-color: var(--color-primary) var(--color-dark-alpha-3);
  scrollbar-width: thin;


&::-webkit-scrollbar {
  background-color: var(--color-dark-alpha-3);
  width: 10px;
}

&::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
}

&:focus {outline: none;}
`;