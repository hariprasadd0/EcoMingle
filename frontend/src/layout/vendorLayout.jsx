import { Box } from '@mui/material';
import Footer from '../components/footer';
import Appbar from '../features/vendor/components/Appbar';

const VendorLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#ffff',
      }}
    >
      <Appbar />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default VendorLayout;
