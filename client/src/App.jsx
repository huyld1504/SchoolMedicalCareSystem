import React from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import router from './routes';
import store from './store';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="colored"
          limit={3}
          toastStyle={{
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.4',
          }}
          progressStyle={{
            background: 'linear-gradient(90deg, #4caf50, #81c784)',
            height: '4px',
            borderRadius: '0 0 12px 12px',
          }}
          style={{
            width: '380px',
            left: '20px',
            bottom: '20px',
          }}
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
          progressClassName="custom-toast-progress"
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
