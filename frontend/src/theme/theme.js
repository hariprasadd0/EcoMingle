import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Eco-friendly green color for primary actions.
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f2f2f2',
      contrastText: '#000000',
    },
    background: {
      default: '#ffff', // Light background to give a clean look.
      paper: '#ffffff', // White for cards, modals, etc.
    },
    text: {
      primary: '#333333', // Dark gray for primary text.
      secondary: '#666666', // Light gray for secondary text.
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#333333', // Dark gray for headings.
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333333',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#333333',
    },
    h6: { fontSize: '18px' },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#666666', // For body text and secondary content.
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      color: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          textTransform: 'none', // No uppercase for button text.
        },
        containedPrimary: {
          backgroundColor: '#2e7d32',
          '&:hover': {
            backgroundColor: '#25672c', // Darker green on hover.
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Soft shadow for depth.
          padding: '16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // White app bar for a clean look.
          color: '#333333',
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#666666', // Default color for icons in buttons.
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#333333',
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
          color: '#333333',
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 500,
          color: '#333333',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
