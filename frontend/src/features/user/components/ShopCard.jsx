import {
  Card,
  Box,
  Typography,
  Chip,
  CardContent,
  IconButton,
} from '@mui/material';
import { LuShoppingBasket, LuHeart } from 'react-icons/lu';

const ShopCard = ({ label, image, title, price, onClick }) => {
  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        borderRadius: '10px',
        border: '1px solid #00000033',
        px: 2,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {label && (
          <Chip
            sx={{
              padding: 0,
              alignSelf: 'flex-start',
              fontSize: '12px',
            }}
            label={label}
            variant="outlined"
          />
        )}
        <Typography
          align="right"
          sx={{ fontSize: '12px' }}
          variant="h6"
          color="text.primary"
        >
          {price}
        </Typography>
      </Box>

      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            xs: { width: '100px', height: '100px' },
            md: { width: '250px', height: '300px' },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src={image}
            alt="product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        </Box>
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontSize={14} color="text.primary">
          {title}
        </Typography>

        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            sx={{
              borderRadius: '50%',
              border: '1px solid #2e7d32',
              p: 1,
              ':hover': {
                backgroundColor: '#e8f5e9',
              },
            }}
          >
            <LuHeart fontSize={20} strokeWidth={1.5} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              p: 1,
              ':hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <LuShoppingBasket color="white" fontSize={20} strokeWidth={1.5} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default ShopCard;
