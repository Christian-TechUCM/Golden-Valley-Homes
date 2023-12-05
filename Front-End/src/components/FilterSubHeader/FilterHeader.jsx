import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from "@mui/material";
import "./FilterHeader.css"; // Your CSS file for styling


function FilterHeader({ applyFilters }) {
  const initialFilters = {
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    bathrooms: "",
    city: "",
    size: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const clearFilters = () => {
    setFilters(initialFilters);
    applyFilters(initialFilters); // Fetch all listings with initial (empty) filters
  };

  const handleApplyFilters = () => {
    const queryParams = {
      ...(filters.priceMin && { priceMin: parseFloat(filters.priceMin) }),
      ...(filters.priceMax && { priceMax: parseFloat(filters.priceMax) }),
      ...(filters.bedrooms && { bedrooms: parseInt(filters.bedrooms, 10) }),
      ...(filters.bathrooms && { bathrooms: parseInt(filters.bathrooms, 10) }),
      ...(filters.city && { city: filters.city }),
      ...(filters.size && { size: parseInt(filters.size, 10) }),
    };

    applyFilters(queryParams); // Fetch listings with applied filters
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const priceOptions = {
    minPrices: [50000, 100000, 150000, 200000, 250000],
    maxPrices: [
      100000, 150000, 200000, 250000,300000, 350000, 400000, 450000, 500000,
    ],
  };


  return (
    <header className="main-header">
      <Box className="sub-header" sx={{ display: "flex", gap: 2 }}>
        {/* City Search Bar */}
        <TextField
  name="city"
  value={filters.city}
  onChange={handleInputChange}
  label="City"
  variant="outlined"
  size="small"
/>

        {/* Min Price Dropdown */}
        <FormControl size="small">
          <InputLabel>Min Price</InputLabel>
          <Select
            name="priceMin"
            value={filters.priceMin}
            onChange={handleInputChange}
            label="Min Price"
          >
            <MenuItem value="">No Min</MenuItem>
            {priceOptions.minPrices.map((price) => (
              <MenuItem key={price} value={price}>
                ${price.toLocaleString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Max Price Dropdown */}
        <FormControl size="small">
          <InputLabel>Max Price</InputLabel>
          <Select
            name="priceMax"
            value={filters.priceMax}
            onChange={handleInputChange}
            label="Max Price"
          >
            <MenuItem value="">No Max</MenuItem>
            {priceOptions.maxPrices.map((price) => (
              <MenuItem key={price} value={price}>
                ${price.toLocaleString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Bedrooms Dropdown */}
        <FormControl size="small">
          <InputLabel>Bedrooms</InputLabel>
          <Select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            label="Bedrooms"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value={1}>1+</MenuItem>
            <MenuItem value={2}>2+</MenuItem>
            <MenuItem value={3}>3+</MenuItem>
            <MenuItem value={4}>4+</MenuItem>
            <MenuItem value={5}>5+</MenuItem>
            {/* ... other options */}
          </Select>
        </FormControl>

        {/* Bathrooms Dropdown */}
        <FormControl size="small">
          <InputLabel>Bathrooms</InputLabel>
          <Select
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleInputChange}
            label="Bathrooms"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value={1}>1+</MenuItem>
            <MenuItem value={2}>2+</MenuItem>
            <MenuItem value={3}>3+</MenuItem>
            <MenuItem value={4}>4+</MenuItem>
            <MenuItem value={5}>5+</MenuItem>
            {/* ... other options */}
          </Select>
        </FormControl>

        {/* Apply Filters Button */}
        <Button 
  variant="contained" 
  onClick={handleApplyFilters} 
  style={{
    background: 'linear-gradient(to bottom, #1adbfe, #4db3fe)', // Gradient from top to bottom
    color: 'white'
  }}
>
  Apply Filter(s)
</Button>

        <Button variant="outlined" onClick={clearFilters}>
          Clear All Filters
        </Button>
      </Box>
    </header>
  );
}

export default FilterHeader;