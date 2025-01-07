import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Button,
} from '@mui/material';
import {
  MdEmail,
  MdAccountCircle,
  MdDelete,
  MdBlock,
  MdLocationOn,
} from 'react-icons/md';
import { approveVendor, getVendorById, rejectVendor } from '../../api/api.js';
import PdfViewer from '../../components/pdfViewer.jsx';

const Vendor = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getVendorById(id);
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!user)
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
        No user data available
      </Typography>
    );

  const handleApprove = async () => {
    try {
      const res = await approveVendor(user._id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    try {
      const res = await rejectVendor(user._id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  let fileUrl;
  if (user) {
    fileUrl = user.files.map((item) => item.fileUrl);
  }
  return (
    <>
      <Paper
        elevation={3}
        sx={{ padding: 4, maxWidth: 800, margin: '2rem auto' }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Avatar and Basic Info */}
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Avatar
                src={user?.avatar || ''}
                alt={`${user.username}'s avatar`}
                sx={{ width: 80, height: 80 }}
              />
              <Typography variant="h5">{user.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
          </Grid>

          {/* User Details */}
          <Grid item xs={12} sm={8}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <MdAccountCircle size={20} />
                <Typography>ID: {user._id}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <MdEmail size={20} />
                <Typography>Email: {user.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <MdLocationOn size={20} />
                <Typography>
                  Location: {user.location?.address}, {user.location?.city},{' '}
                  {user.location?.state}, {user.location?.country}
                </Typography>
              </Box>
              <Typography>
                Created At: {new Date(user.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                Updated At: {new Date(user.updatedAt).toLocaleString()}
              </Typography>
              <Typography>Status: {user.status}</Typography>
              {user.files.map((item, index) => (
                <Typography
                  key={index}
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  License:
                  <a href={item.fileUrl}>{item.fileName}</a>
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Admin Actions */}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            display="flex"
            justifyContent="center"
            gap={2}
          >
            <Tooltip title="Approve vendor">
              <Button
                variant="outlined"
                onClick={handleApprove}
                color="success"
              >
                app
              </Button>
            </Tooltip>
            <Tooltip title="Reject Vendor">
              <Button variant="outlined" onClick={handleReject} color="warning">
                Reject
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <PdfViewer file={fileUrl} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Vendor;
