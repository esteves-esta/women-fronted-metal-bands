import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
  /*
  1. Use a more-intuitive box-sizing model.
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}

/*
  2. Remove default margin
*/
* {
  margin: 0;
}

/*
  3. Allow percentage-based heights in the application
*/
html,
body {
  height: 100vh; /* Fallback for legacy users */
  height: 100dvh;
}

/*
  Typographic tweaks!
  4. Add accessible line-height
  5. Improve text rendering
*/
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/*
  6. Improve media defaults
*/
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

/*
  7. Remove built-in form typography styles
*/
input,
button,
textarea,
select {
  font: inherit;
}

/*
  8. Avoid text overflows
*/
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/*
  9. Create a root stacking context
*/
#root,
#__next {
  isolation: isolate;
}


/* ------------ */
/*
  Theme and global variables
*/

:root {
  --box-shadow-focus: 0px 0px 3px 1px var(--color-primary-lighten3);
  --primary-font-family: 'Cinzel', serif;
  --secondary-font-family: 'Lexend Peta', sans-serif;
  --text-color-alpha-8: hsla(0deg 0% 40% / 0.8);
  --text-color-alpha-9: hsla(0deg 0% 80.78% / 0.8);
  --text-color: hsl(0deg 0% 80.78%);

  --grey: -10deg;
  --color-grey-100: hsl(var(--grey) 20% 95%);
  --color-grey-300: hsl(var(--grey) 10% 75%);
  --color-grey-500: hsl(var(--grey) 5% 50%);
  --color-grey-700: hsl(var(--grey) 10% 30%);
  --color-grey-900: hsl(var(--grey) 15% 15%);
  --border-color: var(--color-grey-700);

  --color-dark-alpha-3: hsl(0 0% 5% / .2);
  --color-dark-alpha-5: hsl(0 0% 5% / .5);

  --primary: 291 85%;
  --color-primary: hsl(var(--primary) 38%);
  --color-primary-light: hsl(var(--primary) 70%);
  --color-primary-dark: hsl(var(--primary) 30%);
  --color-primary-alpha-300: hsl(var(--primary)  50% / 0.1);
  --color-primary-alpha-500: hsl(var(--primary)  50% / 0.5);
  --color-primary-alpha-700: hsl(var(--primary)  50% / 0.7);

  --secondary: 291 46%;
  --color-secondary: hsl(var(--secondary) 24%);
  --color-secondary-light: hsl(var(--secondary) 70%);
  --color-secondary-dark: hsl(var(--secondary) 15%);
  --color-secondary-dark-alpha-700: hsl(var(--secondary) 15% / 0.7);
  --color-secondary-alpha-200: hsl(var(--secondary)  50% / 0.2);
  --color-secondary-alpha-300: hsl(var(--secondary)  50% / 0.3);
  --color-secondary-alpha-500: hsl(var(--secondary)  50% / 0.5);
  --color-secondary-alpha-700: hsl(var(--secondary)  50% / 0.7);

  --tertiary: 251 68%;
  --color-tertiary-light: hsl(var(--tertiary) 55%);
  --color-tertiary: hsl(var(--tertiary) 24%);
  --color-tertiary-dark: hsl(var(--tertiary) 15%);
  --color-tertiary-alpha-300: hsl(var(--tertiary)  50% / 0.3);
  --color-tertiary-alpha-500: hsl(var(--tertiary)  50% / 0.5);
  --color-tertiary-alpha-700: hsl(var(--tertiary)  50% / 0.7);

  /* hues and intensities */
  --purple: 280;
  --green: 94;
  --blue: 241;
  --yellow: 47;
  --red: 15;
  --cyan: 183;
  --black: 0;
  --intensity-0: 27% 49%;
  --intensity-1: 40% 34%;
  --intensity-2: 71% 20%;
  --intensity-3: 60% 11%;

  --gradient-bg1: linear-gradient(180deg,
      hsl(291deg 96% 10%) 0%,
      hsl(291deg 95% 8%) 24%,
      hsl(290deg 95% 7%) 35%,
      hsl(291deg 93% 6%) 45%,
      hsl(291deg 91% 5%) 55%,
      hsl(291deg 88% 3%) 65%,
      hsl(291deg 100% 1%) 76%,
      hsl(0deg 0% 0%) 100%
    );
}


body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  line-height: 1.6;
  font-family: Roboto, Oxygen, sans-serif;
  font-size: 15px;
  color: var(--text-color);
  background-size: 100%;
  background-image: var(--gradient-bg1);
}

#app {
  min-height: 100%;
  background-repeat: no-repeat;
  /* background-attachment: fixed; */
  background-size: 100%;
  background-image: var(--gradient-bg1);
  padding-bottom: 100px;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
`;

export default GlobalStyles;
