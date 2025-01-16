export const DEEZER_API = `${window.location.origin}/` ;

// export const DEEZER_API = import.meta.env.DEV
//   ? "http://localhost:8888/"
//   : "https://women-fronted-metal-bands.netlify.app/";
// // teste-

export const BREAKPOINTS = {
  mobile: 550 / 16,
  laptop: 1100 / 16,
  desktop: 1500 / 16,
};

export const MEDIA_QUERIES = {
  tabletAndUp: `(min-width: ${BREAKPOINTS.mobile}rem)`,
  laptopAndUp: `(min-width: ${BREAKPOINTS.laptop}rem)`,
  desktopAndUp: `(min-width: ${BREAKPOINTS.desktop}rem)`,
};


export const growTagList = [
  { value: 3, text: "High", type: "deep-4" },
  { value: 2, text: "Medium", type: "deep-3" },
  { value: 1, text: "Few", type: "deep-2" },
  { value: 0, text: "None", type: "deep-1" },
];

export const filterStatusOptions = [
  { value: "active", text: "Active" },
  { value: "disbanded", text: "Ended" },
];
export const filterGenderOptions = [
  { value: "allWomen", text: "All women" },
  { value: "mixedGender", text: "Mixed" },
];

export const filterDetailsOptions = [
  { value: "blackWomen", text: "Black women" },
  { value: "sister", text: "Sisters" },
];

export const filterByDetailsOptions = [
  { value: "viewAll", text: "View All" },
  { value: "active", text: "Active" },
  { value: "disbanded", text: "Disbanded" },
  { value: "allWomen", text: "All women" },
  { value: "mixedGender", text: "Mixed gender" },
  { value: "blackWomen", text: "Black women" },
  { value: "sister", text: "Sisters" },
];
export const growFilterOptions = [
  // { value: "viewAll", text: "View All" },
  ...growTagList,
];
