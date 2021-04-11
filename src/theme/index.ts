import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

// Modelo
const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {      
      default: '#E9EBEF',
      paper: colors.common.white,
    },
    primary: {
      light: '#486CA4',
      main: '#486CA4',
      dark: '#415A8B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#F19527',
      main: '#F19527',
      dark: '#CC7F24',
      contrastText: '#202020',
    },
  },
  typography: {
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

export const theme2 = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#1976D2',
    },
    secondary: {
      main: '#FF9800',
    },
  },
  typography: {
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

export default theme;
