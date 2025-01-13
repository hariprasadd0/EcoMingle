import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Tabs,
} from '@mui/material';
import CustomTab from '../components/CustomTab';
import EmblaCarousel from '../components/carousel';
import eco from '../../../assets/images/eco.mp4';
import ShopCard from '../components/ShopCard';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader';

function TabPanel({ children, value, index }) {
  return (
    <Box sx={{ width: '100%' }} hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            gap: 2,
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const natureMeetsCraftItems = [
    {
      name: 'Desk Organiser',
      image:
        'https://plus.unsplash.com/premium_photo-1706544427197-30f45dd5ba1f?q=80&w=1917&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      price: '$29.99',
      description: 'Sleek wooden desk organizer for a tidy workspace',
    },
    {
      name: 'Woven Baskets',
      image:
        'https://images.unsplash.com/photo-1587304883320-eb9a1a7a4c98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$34.99',
      description: 'Set of 3 handwoven natural fiber baskets',
    },
    {
      name: 'Wooden Chair',
      image:
        'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$149.99',
      description: 'Modern wooden chair with ergonomic design',
    },
    {
      name: 'Wooden Table',
      image:
        'https://images.unsplash.com/photo-1604074131665-7a4b13870ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$299.99',
      description: 'Rustic wooden dining table for 6',
    },
    {
      name: 'Tray & Pots',
      image:
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$45.99',
      description: 'Ceramic tray with matching plant pots',
    },
    {
      name: 'MagSafe Stand',
      image:
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: '$39.99',
      description: 'Wooden MagSafe compatible phone stand',
    },
  ];

  const { products, status } = useProducts();

  const images = products[0]?.ProductImage;
  const carouselProduct = [products[0]];

  const [value, setValue] = useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!products || status === 'pending') {
    return <Loader />;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          mt: 1,
          width: '100%',
        }}
      >
        <Grid
          container
          spacing={2}
          px={{ xs: 2, md: 0 }}
          sx={{ overflow: 'hidden' }}
        >
          {/* Carousel Section */}
          <Grid item xs={12} md={8}>
            <EmblaCarousel slides={images} product={carouselProduct} />
          </Grid>

          {/* Promotions and About Us Section */}
          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Card
                  elevation={0}
                  sx={{
                    boxShadow: 'none',
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                  variant="outlined"
                >
                  <Chip
                    label="Promotions"
                    variant="outlined"
                    sx={{
                      width: '100px',
                      mt: 1,
                    }}
                  />

                  <img
                    src="https://images.unsplash.com/photo-1577058109956-67adf6edc586?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZWNvJTIwZnJpZW5kbHklMjBjb3NtZXRpY3N8ZW58MHx8MHx8fDA%3D"
                    alt="Electronics promotion"
                    style={{
                      width: '100%',
                      height: '18vh',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />

                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      p: 0,
                      '&:last-child': {
                        pb: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontSize={12}
                      color="primary"
                    >
                      Electronics
                    </Typography>
                    <Typography
                      variant="body1"
                      fontSize={20}
                      color={'text.primary'}
                    >
                      15% Discount for all Electronics
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card
                  elevation={0}
                  sx={{ boxShadow: 'none', p: 1.5 }}
                  variant="outlined"
                >
                  <Chip label={'Who are we ?'} variant="outlined" />
                  <Box sx={{ p: 0, mt: 3, flexGrow: 1, gap: 1 }}>
                    <video
                      src={eco}
                      autoPlay
                      controls
                      style={{
                        width: '100%',
                        height: '160px',
                        backgroundColor: '#000',
                        borderRadius: '10px',
                        objectFit: 'cover',
                      }}
                    >
                      <source src="path-to-your-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Products Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent={'space-between'}
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontSize={20} color="text.primary">
              Shop
            </Typography>

            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="custom tabs"
              TabIndicatorProps={{ style: { backgroundColor: '#2E7D32' } }}
              sx={{
                '& .MuiTabs-indicator': { display: 'none' },
              }}
            >
              <CustomTab disableRipple label="Best Seller" value={1} />
              <CustomTab disableRipple label="New Arrivals" value={2} />
              <CustomTab disableRipple label="Zero Waste" value={3} />
            </Tabs>
            <Button sx={{ display: { xs: 'none', md: 'block' } }}>
              view all
            </Button>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TabPanel value={value} index={1}>
              <Grid container spacing={2}>
                {products.map((product) => {
                  const productItem = product.productItems?.[0];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <ShopCard
                        label={productItem?.promotionCategory}
                        image={product.ProductImage[0]}
                        title={product.productName}
                        price={`$${productItem?.newPrice || product.price}`}
                        oldPrice={
                          productItem?.oldPrice
                            ? `$${productItem.oldPrice}`
                            : null
                        }
                        discount={productItem?.discount || null}
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Typography>Content for Tab Two</Typography>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Typography>Content for Tab Three</Typography>
            </TabPanel>
          </Box>
        </Box>
        {/* Nature Meets Art */}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            px: { xs: 2, md: 4 },
            mt: 4,
            mb: 6,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontSize={24}
                color="text.primary"
                mb={1}
              >
                Nature Meets Craft
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Handcrafted pieces that bring nature's beauty to your space
              </Typography>
            </Box>
            <Button variant="outlined" color="primary">
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {natureMeetsCraftItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ShopCard
                  image={item.image}
                  title={item.name}
                  price={`${item.price}`}
                  description={item.description}
                  // onClick={() => navigate(`/product/${product._id}`)}
                  // onAddToCart={() => handleAddToCart(product._id)}
                  // onAddToWishlist={() => handleAddToWishlist(product._id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
