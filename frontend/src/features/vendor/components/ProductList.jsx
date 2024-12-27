import { useNavigate } from 'react-router-dom';
import { useSearchFilter } from './SearchAndFilter';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
const ProductList = () => {
  const { filteredProducts } = useSearchFilter();
  const navigate = useNavigate();
  return (
    <div>
      {filteredProducts.length > 0 ? (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card
                onClick={() => navigate(`/products/${product._id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <CardMedia
                  component="img"
                  alt={product.productName}
                  height="200"
                  width="100%"
                  image={product.ProductImage[0]} // Displaying the first image
                  sx={{ objectFit: 'fill', borderRadius: '5px' }}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ marginTop: 2 }}
                  >
                    ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No products found.
        </Typography>
      )}
    </div>
  );
};

export default ProductList;
