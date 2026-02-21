import { useEffect, useMemo, useState } from 'react';
import './CarForm.css';

const emptyForm = {
  name: '',
  brand: '',
  type: 'hatchback',
  fuel: 'petrol',
  seats: 5,
  pricePerDay: '',
  location: '',
  description: '',
  available: true
};

const CarForm = ({ initialCar, onSubmit, submitting }) => {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (initialCar) {
      setForm({
        name: initialCar.name || '',
        brand: initialCar.brand || '',
        type: initialCar.type || 'hatchback',
        fuel: initialCar.fuel || 'petrol',
        seats: initialCar.seats || 5,
        pricePerDay: initialCar.pricePerDay || '',
        location: initialCar.location || '',
        description: initialCar.description || '',
        available: initialCar.available ?? true
      });
      setPreview(initialCar.image || '');
    } else {
      setForm(emptyForm);
      setPreview('');
    }
    setImageFile(null);
  }, [initialCar]);

  const heading = useMemo(() => (initialCar ? 'Edit Car' : 'Add New Car'), [initialCar]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    await onSubmit(formData);
  };

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <h4>{heading}</h4>

      <div className="car-form-grid">
        <label>
          Name
          <input
            className="input"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>

        <label>
          Brand
          <input
            className="input"
            value={form.brand}
            onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
            required
          />
        </label>

        <label>
          Type
          <select
            className="input"
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
          >
            <option value="hatchback">Hatchback</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="luxury">Luxury</option>
            <option value="ev">EV</option>
          </select>
        </label>

        <label>
          Fuel
          <select
            className="input"
            value={form.fuel}
            onChange={(event) => setForm((prev) => ({ ...prev, fuel: event.target.value }))}
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
        </label>

        <label>
          Seats
          <input
            type="number"
            className="input"
            min="1"
            value={form.seats}
            onChange={(event) => setForm((prev) => ({ ...prev, seats: event.target.value }))}
          />
        </label>

        <label>
          Price/Day
          <input
            type="number"
            className="input"
            min="0"
            value={form.pricePerDay}
            onChange={(event) => setForm((prev) => ({ ...prev, pricePerDay: event.target.value }))}
            required
          />
        </label>

        <label>
          Location
          <input
            className="input"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
          />
        </label>

        <label>
          Available
          <select
            className="input"
            value={String(form.available)}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, available: event.target.value === 'true' }))
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>

      <label>
        Description
        <textarea
          className="input"
          rows="3"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
      </label>

      <label>
        Upload Image
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>

      {preview && (
        <div className="image-preview-wrap">
          <img src={preview} alt="Car preview" className="image-preview" />
        </div>
      )}

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? 'Saving...' : initialCar ? 'Update Car' : 'Add Car'}
      </button>
    </form>
  );
};

export default CarForm;
