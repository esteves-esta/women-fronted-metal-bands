import React from "react";

function useIsOnscreen() {
  const [isOnscreen, setIsOnscreen] = React.useState(false);

  const elementRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      setIsOnscreen(entry.isIntersecting);
    });

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [isOnscreen, elementRef];
}

export default useIsOnscreen;
