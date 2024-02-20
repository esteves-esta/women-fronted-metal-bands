import React from "react";
/* https://betterprogramming.pub/using-window-matchmedia-in-react-8116eada2588 */
const useMatchMedia = (size = 850) => {
  const [isNarrowScreen, setIsNarrowScreen] = React.useState(false);

  React.useEffect(() => {
    const mediaWatcher = window.matchMedia(`( max-width: ${size}px )`);
    setIsNarrowScreen(mediaWatcher.matches);

    function updateIsNarrowScreen(event) {
      // console.log({ event });
      // console.log({ mediaWatcher: mediaWatcher.matches });
      event.matches && setIsNarrowScreen(event.matches);
    }

    mediaWatcher.addEventListener("change", updateIsNarrowScreen);
    return () => {
      mediaWatcher.removeEventListener("change", updateIsNarrowScreen);
    };
  }, []);

  return isNarrowScreen;
};

export default useMatchMedia;
