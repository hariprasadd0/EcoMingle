import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import BreadCrumbs from '../components/BreadCrumb';
import EcoFriendlyNavbar from '../components/Dropdown';
import { useSelector } from 'react-redux';
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  const role = user?.user?.role || user?.data?.user?.role;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#ffff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <Navbar />
        {role === 'user' || null ? <EcoFriendlyNavbar /> : <></>}
      </Box>

      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          my: 1,
          px: 1,
        }}
      >
        <BreadCrumbs />
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
