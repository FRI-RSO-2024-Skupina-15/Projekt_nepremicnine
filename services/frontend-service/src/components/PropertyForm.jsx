import React, { useState } from 'react';

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    price: '',
    type: 'apartment',
    location: { city: '', country: 'Slovenia' },
    size: '',
    plotSize: '',
    floors: '',
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    constructionYear: '',
    renovationYear: '',
    energyRating: '',
    parkingSpaces: '',
    amenities: [],
    contact: { name: '', email: '', phone: '' }
  });
  
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Submit property data
      const propertyResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!propertyResponse.ok) throw new Error('Failed to create property');
      
      const property = await propertyResponse.json();

      // Upload images if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(image => {
          formData.append('images', image);
        });

        const imageResponse = await fetch(`/api/images/upload/${property._id}`, {
          method: 'POST',
          body: formData
        });

        if (!imageResponse.ok) throw new Error('Failed to upload images');
      }

      setSuccess(true);
      setFormData({
        price: '',
        type: 'apartment',
        location: { city: '', country: 'Slovenia' },
        size: '',
        plotSize: '',
        floors: '',
        bedrooms: '',
        bathrooms: '',
        toilets: '',
        constructionYear: '',
        renovationYear: '',
        energyRating: '',
        parkingSpaces: '',
        amenities: [],
        contact: { name: '', email: '', phone: '' }
      });
      setImages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Property successfully added!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (€)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Size (m²)</label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Construction Year</label>
            <input
              type="number"
              name="constructionYear"
              value={formData.constructionYear}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="contact.name"
                value={formData.contact.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Property Images (Max 10)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
            </div>
          </div>
          {images.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">{images.length} files selected</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Submitting...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;