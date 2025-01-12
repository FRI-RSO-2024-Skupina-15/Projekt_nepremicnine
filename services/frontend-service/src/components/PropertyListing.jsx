import React, { useState, useEffect } from 'react';

const PropertyListing = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    bedrooms: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchPropertyImages = async (propertyId) => {
    try {
      const response = await fetch(`/api/images/property/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const images = await response.json();
      return images;
    } catch (err) {
      console.error('Error fetching images:', err);
      return [];
    }
  };

  const fetchProperties = async () => {
    try {
      let url = '/api/properties?';
      const queryParams = new URLSearchParams();
      
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);
      
      url += queryParams.toString();
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch properties');
      const propertiesData = await response.json();

      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        propertiesData.map(async (property) => {
          const images = await fetchPropertyImages(property._id);
          return {
            ...property,
            images: images
          };
        })
      );

      setProperties(propertiesWithImages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
      
      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Enter city"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="Min €"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="Max €"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {property.images && property.images.length > 0 ? (
                <img
                  src={`/api/images${property.images[0].url}`}
                  alt={`Property in ${property.location.city}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  +{property.images.length - 1} more
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold">€{property.price.toLocaleString()}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {property.type}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{property.location.city}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-2">{property.size} m²</span>
                {property.bedrooms && (
                  <span className="mr-2">• {property.bedrooms} bedrooms</span>
                )}
                {property.bathrooms && (
                  <span>• {property.bathrooms} bathrooms</span>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Contact: {property.contact.name}
                </div>
                <div className="text-sm text-gray-600">
                  Email: {property.contact.email}
                </div>
                {property.contact.phone && (
                  <div className="text-sm text-gray-600">
                    Phone: {property.contact.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No properties found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default PropertyListing;