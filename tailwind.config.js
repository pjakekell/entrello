const colors = require("./src/utils/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,,ts,tsx}"],
  theme: {
    fontSize: {
      "3xs": ".5rem",
      "2xs": ".6rem",
      xs: ".7rem",
      sm: ".8rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    extend: {
      fontFamily: {
        // sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
      colors,
      width: {
        "57": "12.2rem"
      },
      maxWidth: {
        "2xl": "72rem",
        "1/2-vw": "50vw",
        "event-title": "calc(50vw - 175px)"
      },
      spacing: {
        "x-3": "0 3px"
      },
      height: {
        600: "600px",
      },
      boxShadow: {
        "hidden": "none"
      }
    },
  },
  variants: {
    extend: {
      display: ["hover", "group-hover", "focus"],
      borderRadius: ["hover", "focus"],
    },
    backgroundColor: ({ after }) => after(["disabled"]),
    cursor: ({ after }) => after(["disabled"]),
  },
  plugins: [require("@tailwindcss/forms")],
};
