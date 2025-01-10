/* eslint-disable react/prop-types */
// components/BreadCrumbs.js
import { Breadcrumbs as MuiBreadCrumbs, Link } from '@mui/material';
import { withRouting } from '../hooks/withRouting';

import { useSelector } from 'react-redux';

const BreadCrumbs = (props) => {
  const {
    router: { navigate, location }, // access the injected router props
  } = props;

  const pathnames = location.pathname.split('/').filter((x) => x);
  const { user } = useSelector((state) => state.auth);
  const role = user?.data?.user?.role || user?.user.role;
  if (
    pathnames.includes('login') ||
    pathnames.includes('register') ||
    pathnames.includes('vendor-register') ||
    pathnames.includes('forgetpassword') ||
    pathnames.includes('reset-password') ||
    pathnames.includes('vendor-login') ||
    pathnames.includes('dashboard')
  ) {
    pathnames.splice(0, 1);
  }

  return (
    <MuiBreadCrumbs
      aria-label="breadcrumb"
      separator={'>'}
      sx={{
        width: '100%',
        pt: 1,
        px: 1,
        backgroundColor: '#ffffff',
      }}
    >
      {pathnames.length > 0 ? (
        <Link
          component={'span'}
          color={'text.primary'}
          onClick={() => navigate('/dashboard')}
          fontSize={12}
          style={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          {role}
        </Link>
      ) : (
        <Link
          fontSize={12}
          color={'text.primary'}
          onClick={() => navigate('/')}
        ></Link>
      )}

      {pathnames.map((value, index) => (
        <Link
          key={index}
          onClick={() => navigate(`/${value}`)}
          color={'text.primary'}
          fontSize={12}
          sx={{ cursor: 'pointer' }}
        >
          {value}
        </Link>
      ))}
    </MuiBreadCrumbs>
  );
};

export default withRouting(BreadCrumbs); // wrap the component with HOC
