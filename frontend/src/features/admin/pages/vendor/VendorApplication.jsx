import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { getVendorApplication } from '../../api/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const VendorApplication = () => {
  const [vendor, setVendor] = useState([]);
  // Sample data for vendor applications
  useEffect(() => {
    const vendorApplications = async () => {
      const res = await getVendorApplication();
      setVendor(res.data?.data);
    };
    vendorApplications();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ margin: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Vendor Applications
      </Typography>
      <Table aria-label="vendor applications table">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>ID</strong>
            </TableCell>
            <TableCell>
              <strong>Vendor Name</strong>
            </TableCell>
            <TableCell>
              <strong>Email</strong>
            </TableCell>
            <TableCell>
              <strong>status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendor.map((vendor) => (
            <TableRow key={vendor._id}>
              <TableCell>
                {' '}
                <Link to={`/vendors/${vendor._id}`}>{vendor._id}</Link>
              </TableCell>
              <TableCell>{vendor.username}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VendorApplication;
