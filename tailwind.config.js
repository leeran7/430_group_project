module.exports = {
  content: ["./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        color1: "#13293D",
        color2: "#269bb8",
        color3: "#006494",
        color4: "#1B98E0",
        color5: "#E8F1F2",
      },
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("@tailwindcss/line-clamp"),
  ],
};
