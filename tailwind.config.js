module.exports = {
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "scale": "scaleUp 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        scaleUp: {
          "0%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
}
