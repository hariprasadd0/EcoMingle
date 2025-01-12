import { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  Chip,
  CardContent,
  IconButton,
  Rating,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { LuShoppingBasket, LuHeart, LuShare2, LuEye } from 'react-icons/lu';

const ShopCard = ({
  label,
  image,
  title,
  price,
  onClick,
  rating,
  reviews,
  discount,
  oldPrice,
  isNew,
  description,
  onAddToCart,
  onAddToWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      onClick={onClick}
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        borderRadius: '12px',
        border: '1px solid #00000015',
        height: '100%',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid #00000025',
        },
      }}
    >
      {/* Top Section with Labels */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {label && (
            <Chip
              sx={{
                fontSize: '12px',
                bgcolor: 'primary.main',
                color: 'white',
                height: '24px',
              }}
              label={label}
            />
          )}
          {isNew && (
            <Chip
              sx={{
                fontSize: '12px',
                bgcolor: '#ff385c',
                color: 'white',
                height: '24px',
              }}
              label="New"
            />
          )}
          {discount && (
            <Chip
              sx={{
                fontSize: '12px',
                bgcolor: '#00c853',
                color: 'white',
                height: '24px',
              }}
              label={`-${discount}%`}
            />
          )}
        </Box>

        {/* Quick Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.3s ease',
          }}
        >
          <Tooltip title="Quick view">
            <IconButton
              size="small"
              sx={{
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                ':hover': { bgcolor: 'white' },
              }}
            >
              <LuEye size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton
              size="small"
              sx={{
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                ':hover': { bgcolor: 'white' },
              }}
            >
              <LuShare2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Image Section */}
      <CardContent sx={{ flex: 1, p: 2, pt: 0 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%',
            borderRadius: '8px',
            overflow: 'hidden',
            bgcolor: '#f5f5f5',
          }}
        >
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          )}
          <img
            src={image}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        </Box>

        {/* Content Section */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            fontSize={16}
            fontWeight={500}
            color="text.primary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                height: '40px',
              }}
            >
              {description}
            </Typography>
          )}

          {rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
              <Rating value={rating} precision={0.5} size="small" readOnly />
              {reviews && (
                <Typography variant="body2" color="text.secondary">
                  ({reviews})
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Bottom Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          pt: 0,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography
              variant="h6"
              fontSize={18}
              fontWeight={600}
              color="primary.main"
            >
              {price}
            </Typography>
            {oldPrice && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                {oldPrice}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Add to wishlist">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist();
              }}
              size="small"
              sx={{
                borderRadius: '50%',
                border: '1px solid #00000015',
                p: 1,
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#fce4ec',
                  borderColor: '#e91e63',
                  color: '#e91e63',
                },
              }}
            >
              <LuHeart size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add to cart">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              size="small"
              sx={{
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                p: 1,
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <LuShoppingBasket color="white" size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default ShopCard;
