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
body, 
#app {
  /* height: 100vh; Fallback for legacy users */
  /* height: 100dvh; */
  min-height:100%;
  /* height: 100%; */
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

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@900&family=Lexend+Peta:wght@900&display=swap');

:root {
  --primary-font-family: 'Cinzel', serif;
  --secondary-font-family: 'Lexend Peta', sans-serif;

 --gray-hue: 270deg;
    --color-gray-100: hsl(var(--gray-hue) 20% 95%);
    --color-gray-300: hsl(var(--gray-hue) 10% 75%);
    --color-gray-500: hsl(var(--gray-hue) 5% 50%);
    --color-gray-700: hsl(var(--gray-hue) 10% 30%);
    --color-gray-900: hsl(var(--gray-hue) 15% 15%);

    --primary-hue: 245deg 90%;
    --color-primary: hsl(var(--primary-hue) 50%);
    --color-primary-light: hsl(var(--primary-hue) 70%);
    --color-primary-dark: hsl(var(--primary-hue) 30%);
    --color-primary-alpha-300: hsl(var(--primary-hue)  50% / 0.3);
    --color-primary-alpha-500: hsl(var(--primary-hue)  50% / 0.5);
    --color-primary-alpha-700: hsl(var(--primary-hue)  50% / 0.7);


  --text-title: #fff;
  --text-color: rgba(255, 255, 255, 0.829);
  --text-secondary: #CECECE;

  --border-color: #4e4e4e48;
  --bg-primary-opaque: rgb(0, 0, 0);
  --bg-primary: rgba(0, 0, 0, 0.363);
  --bg-secondary: #1a1a1a91;
  --bg-tertiary: #181818;
  --bg-4: #1B191F;
  --bg-5: #4D4D4D;
  --bg-6: rgba(77, 77, 77, 0.493);
  --bg-7: rgba(77, 77, 77, 0.308);


  --gradient-bg1: linear-gradient(
  180deg,
  hsl(291deg 96% 10%) 0%,
  hsl(291deg 95% 8%) 24%,
  hsl(290deg 95% 7%) 35%,
  hsl(291deg 93% 6%) 45%,
  hsl(291deg 91% 5%) 55%,
  hsl(291deg 88% 3%) 65%,
  hsl(291deg 100% 1%) 76%,
  hsl(0deg 0% 0%) 100%
);
  --gradient-bg2: linear-gradient(143deg, #000 7.25%, #2C0732 57.22%, rgba(42, 1, 49, 0.91) 89.5%), #FFF;

  --color-primary: hsl(291, 58%, 24%);
  --color-primary-lighten1: hsl(290, 50%, 40%);
  --color-primary-lighten2: hsl(290, 50%, 50%);
  --color-primary-lighten3: hsl(290, 50%, 60%);

  --box-shadow-focus: 0px 0px 3px 1px var(--color-primary-lighten3);

  --color-success: hsl(94, 64%, 33%);
  --color-warning: hsl(47, 64%, 33%);
  --color-error: hsl(15, 64%, 33%);
  --color-info: hsl(183, 64%, 33%);
  --color-gray-100: hsl(0deg 0% 10%);
  --color-gray-300: hsl(0deg 0% 25%);
  --color-gray-500: hsl(0deg 0% 50%);
  --color-gray-700: hsl(0deg 0% 75%);
  --color-gray-900: hsl(0deg 0% 90%);

  --color-deep-1: hsl(241, 27%, 49%);
  --color-deep-2: hsl(265, 40%, 34%);
  --color-deep-3: hsl(281, 71%, 20%);
  --color-deep-4: hsl(265, 60%, 15%);
  

  /* todo */
}


body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  line-height: 1.6;
  font-family: Roboto, Oxygen, sans-serif;
  font-size: 15px;
  color: var(--text-color);

  background-repeat: no-repeat;
  /* background-attachment: fixed; */
  background-size: 100%;
  background-image: var(--gradient-bg1); 
}
`;

export default GlobalStyles;
