import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useProducts } from '../hooks/useProducts.jsx';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Typography,
  Grid,
  Chip,
  Slider,
  FormControl,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import { IoIosArrowDown } from 'react-icons/io';
import { addToCart } from '../cartSlice.js';

const useCategories = () => {
  const { products } = useProducts();
  const categories = products.map((item, index) => ({
    id: index,
    name: item.category,
  }));

  const materials = products.map((item, index) => ({
    id: index,
    name: item.material,
  }));
  return { categories, materials };
};

// Sidebar for Filters
const SideNav = ({
  selectedCategories,
  toggleCategory,
  selectedMaterials,
  toggleMaterial,
  priceRange,
  setPriceRange,
}) => {
  const { categories, materials } = useCategories();
  return (
    <Card
      elevation={2}
      sx={{
        boxShadow: 'none',
        border: '1px solid #e0e0e0',
        borderRadius: '0px',
        borderBottom: 'none',
        borderLeft: 'none',
        borderTop: 'none',
        width: 1 / 4,
      }}
    >
      <FilterSection title="Product Type">
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              py: 1,
              cursor: 'pointer',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <Checkbox
              checked={selectedCategories.includes(category.name)}
              onChange={() => toggleCategory(category.name)}
              size="small"
            />
            <Typography variant="body2" fontSize={12} fontWeight={400}>
              {category.name}
            </Typography>
          </Box>
        ))}
      </FilterSection>

      <FilterSection title="Price">
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            ${priceRange[0]} - ${priceRange[1]}
          </Typography>
        </Box>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{ mt: 2 }}
        />
      </FilterSection>

      <FilterSection title="Materials">
        {materials.length !== 0 ? (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {materials
              .filter(
                (material) => material.name && material.name.trim() !== '',
              )
              .map((material) => (
                <Chip
                  key={material.id}
                  label={material.name}
                  clickable
                  color={
                    selectedMaterials.includes(material.name)
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => toggleMaterial(material.name)}
                  size="small"
                />
              ))}
          </Box>
        ) : (
          ''
        )}
      </FilterSection>
    </Card>
  );
};

const FilterSection = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" fontSize={16} fontWeight="medium" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const AppliedFilters = ({
  selectedCategories,
  selectedMaterials,
  handleDeleteFilter,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight="medium" fontSize={16}>
        Applied Filters
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
        {selectedCategories.map((label) => (
          <Chip
            key={`category-${label}`}
            label={label}
            onDelete={() => handleDeleteFilter(label, 'category')}
            variant="outlined"
            size="small"
          />
        ))}

        {selectedMaterials.map((label) => (
          <Chip
            key={`material-${label}`}
            label={label}
            onDelete={() => handleDeleteFilter(label, 'material')}
            variant="outlined"
            size="small"
          />
        ))}
      </Box>
    </Box>
  );
};

const SortBy = ({ sortBy, setSortBy }) => {
  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        displayEmpty
        IconComponent={IoIosArrowDown}
      >
        <MenuItem value="price">Price</MenuItem>
        <MenuItem value="popularity">Popularity</MenuItem>
        <MenuItem value="rating">Rating</MenuItem>
      </Select>
    </FormControl>
  );
};

const ProductGrid = ({ products, loading, error }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (products.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary" textAlign="center" mt={4}>
        No products found
      </Typography>
    );
  }
  const handleAddToCart = (id) => {
    const data = {
      productId: id,
      quantity: 1,
    };

    dispatch(addToCart(data));
  };

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <Card sx={{ cursor: 'pointer' }}>
            <CardContent onClick={() => navigate(`/product/${product._id}`)}>
              <img
                src={product.ProductImage[0]}
                alt={product.productName}
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
              <Typography variant="h6" component="div">
                {product.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.label}
              </Typography>
              <Typography variant="h6" color="primary">
                ${product.price}
              </Typography>
            </CardContent>
            <Button
              onClick={() => handleAddToCart(product._id)}
              fullWidth
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                my: 2,
                '&:hover': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              Add to Cart
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const Catalog = () => {
  const { category } = useParams();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [sortBy, setSortBy] = useState('price');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const { products, status, error, setCategory } = useProducts();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    if (!searchQuery && !category) {
      setCategory(null);
    } else if (searchQuery) {
      setCategory([searchQuery]);
    } else {
      setCategory(category);
    }
  }, [searchQuery, setCategory, category]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
    setCategory([...selectedCategories, category]);
  };

  const toggleMaterial = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((item) => item !== material)
        : [...prev, material],
    );

    console.log(material);
  };

  const handleDeleteFilter = (label, filterType) => {
    if (filterType === 'category')
      setSelectedCategories((prev) => prev.filter((item) => item !== label));

    if (filterType === 'material')
      setSelectedMaterials((prev) => prev.filter((item) => item !== label));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <SideNav
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectedMaterials={selectedMaterials}
        toggleMaterial={toggleMaterial}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <AppliedFilters
            selectedCategories={selectedCategories}
            selectedMaterials={selectedMaterials}
            handleDeleteFilter={handleDeleteFilter}
          />
          <SortBy sortBy={sortBy} setSortBy={setSortBy} />
        </Box>
        <ProductGrid
          products={products}
          loading={status === 'loading'}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default Catalog;
