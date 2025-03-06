module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C4F439",
      },
      fontFamily: {
        custom: ["Bomstad", "sans-serif"],
        // You can add more custom fonts as needed
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
      },
    },
  },
  plugins: [],
};
