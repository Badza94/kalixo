/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./blocks/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Grid columns (1-12) for all breakpoints
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-12",
    // Responsive grid columns for sm breakpoint
    "sm:grid-cols-1",
    "sm:grid-cols-2",
    "sm:grid-cols-3",
    "sm:grid-cols-4",
    "sm:grid-cols-5",
    "sm:grid-cols-6",
    "sm:grid-cols-12",
    // Responsive grid columns for md breakpoint
    "md:grid-cols-1",
    "md:grid-cols-2",
    "md:grid-cols-3",
    "md:grid-cols-4",
    "md:grid-cols-5",
    "md:grid-cols-6",
    "md:grid-cols-12",
    // Responsive grid columns for lg breakpoint
    "lg:grid-cols-1",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
    "lg:grid-cols-4",
    "lg:grid-cols-5",
    "lg:grid-cols-6",
    "lg:grid-cols-12",
    // Responsive grid columns for xl breakpoint
    "xl:grid-cols-1",
    "xl:grid-cols-2",
    "xl:grid-cols-3",
    "xl:grid-cols-4",
    "xl:grid-cols-5",
    "xl:grid-cols-6",
    "xl:grid-cols-12",
    // Responsive grid columns for 2xl breakpoint
    "2xl:grid-cols-1",
    "2xl:grid-cols-2",
    "2xl:grid-cols-3",
    "2xl:grid-cols-4",
    "2xl:grid-cols-5",
    "2xl:grid-cols-6",
    "2xl:grid-cols-12",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
