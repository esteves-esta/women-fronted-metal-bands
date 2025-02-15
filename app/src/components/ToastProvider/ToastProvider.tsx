import * as React from "react";
import * as ToastRadix from "@radix-ui/react-toast";

interface ToastBody {
  title: string;
  description: string;
}

interface IToastContext {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  openToast: (body: ToastBody) => void;
  toastBody: ToastBody;
}
export const ToastContext = React.createContext<Partial<IToastContext>>({});

function ToastProvider({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [toastBody, setToastBody] = React.useState({
    title: "",
    description: ""
  });
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const openToast = (body) => {
    setToastBody(body);
    setIsOpen(false);
    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 300);
  };

  const state = {
    isOpen,
    setIsOpen,
    openToast,
    toastBody
  };

  return (
    <ToastContext.Provider value={state}>
      <ToastRadix.Provider swipeDirection="right">
        {children}
      </ToastRadix.Provider>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
