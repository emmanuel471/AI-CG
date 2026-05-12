export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },

        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },

        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },

        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },

        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        glass: "var(--glass)",
        "glass-border": "var(--glass-border)",
      },

      boxShadow: {
        glow: "var(--shadow-glow)",
        elegant: "var(--shadow-elegant)",
        card: "var(--shadow-card)",
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-card": "var(--gradient-card)",
        "gradient-text": "var(--gradient-text)",
        "gradient-hero": "var(--gradient-hero)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionProperty: {
        smooth: "var(--transition-smooth)",
      },
    },
  },

  plugins: [],
};