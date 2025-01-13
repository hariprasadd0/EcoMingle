import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useProducts } from '../hooks/useProducts.jsx';
import {
  Box,
  Card,
  Checkbox,
  Typography,
  Grid,
  Chip,
  Slider,
  FormControl,
  Select,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  IconButton,
  AlertTitle,
  Skeleton,
} from '@mui/material';
import { IoIosArrowDown } from 'react-icons/io';
import { addToCart } from '../cartSlice.js';
import ShopCard from '../components/ShopCard';
import { LuLayoutGrid, LuLayoutList, LuRefreshCw } from 'react-icons/lu';
import { addToWishlist } from '../api/wishlistApi.js';

const useCategories = () => {
  const { products } = useProducts();

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((item) => item.category)),
    ];

    return uniqueCategories.map((name, index) => ({ id: index, name }));
  }, [products]);

  const materials = useMemo(() => {
    const uniqueMaterials = [...new Set(products.map((item) => item.material))];
    return uniqueMaterials.map((name, index) => ({ id: index, name }));
  }, [products]);

  return { categories, materials };
};

const FilterSection = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" fontSize={16} fontWeight="medium" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

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
  const [viewMode, setViewMode] = useState('grid');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAddToCart = (id) => {
    const data = {
      productId: id,
      quantity: 1,
    };
    dispatch(addToCart(data));
    setSnackbarOpen(true);
  };

  const handleAddToWishlist = (id) => {
    addToWishlist(id);
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton height={32} sx={{ mt: 2 }} />
              <Skeleton height={24} width="60%" />
              <Skeleton height={32} width="40%" sx={{ mt: 1 }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        action={
          <Button color="error" size="small" startIcon={<LuRefreshCw />}>
            Retry
          </Button>
        }
      >
        <AlertTitle>Error Loading Products</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
          bgcolor: '#f5f5f5',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Products Found
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Try adjusting your search or filters to find what you're looking for.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            // Handle reset filters
          }}
        >
          Reset Filters
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Grid Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6" fontSize={14} component="div">
          Showing {products.length} Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            <LuLayoutGrid />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            color={viewMode === 'list' ? 'primary' : 'default'}
          >
            <LuLayoutList />
          </IconButton>
        </Box>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {products.map((product) => {
          const productItem = product.productItems?.[0];
          return (
            <Grid
              item
              xs={12}
              sm={viewMode === 'list' ? 12 : 6}
              md={viewMode === 'list' ? 12 : 4}
              key={product._id}
            >
              <ShopCard
                image={product.ProductImage[0]}
                title={product.productName}
                label={product.label}
                price={`$${productItem?.newPrice || product.price}`}
                rating={product.rating}
                reviews={product.reviews}
                description={product.description}
                onClick={() => navigate(`/product/${product._id}`)}
                onAddToCart={() => handleAddToCart(product._id)}
                onAddToWishlist={() => handleAddToWishlist(product._id)}
                discount={productItem?.discount || null}
              />
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Product added to cart
        </Alert>
      </Snackbar>
    </Box>
  );
};

const Catalog = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState('price');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const { products, status, error, setCategory } = useProducts();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchLower),
      );
    }
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category),
      );
    }

    // Apply material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product) =>
        selectedMaterials.includes(product.material),
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [
    products,
    selectedCategories,
    selectedMaterials,
    priceRange,
    sortBy,
    searchQuery,
  ]);

  useEffect(() => {
    if (!searchQuery && !category) {
      setCategory(null);
    } else if (searchQuery) {
      setCategory([searchQuery]);
    } else if (category) {
      setSelectedCategories([category]);
      setCategory(category);
    }
  }, [searchQuery, category, setCategory]);

  const toggleCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((item) => item !== categoryName)
        : [...prev, categoryName],
    );
  };

  const toggleMaterial = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((item) => item !== material)
        : [...prev, material],
    );
  };

  const handleDeleteFilter = (label, filterType) => {
    if (filterType === 'category') {
      setSelectedCategories((prev) => prev.filter((item) => item !== label));
      if (category || searchQuery) {
        setCategory(null);
      }
    }
    if (filterType === 'material') {
      setSelectedMaterials((prev) => prev.filter((item) => item !== label));
    }
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
          products={filteredAndSortedProducts}
          loading={status === 'loading'}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default Catalog;
