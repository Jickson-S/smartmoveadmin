import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCar, deleteCar, fetchAllCars, updateCar } from '../store/slices/carSlice';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CarForm from '../components/CarForm';
import Spinner from '../components/Spinner';
import './ManageCars.css';

const ITEMS_PER_PAGE = 10;

const ManageCars = () => {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCars());
  }, [dispatch]);

  const pageCount = Math.max(1, Math.ceil(cars.length / ITEMS_PER_PAGE));

  const pagedCars = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return cars.slice(start, start + ITEMS_PER_PAGE);
  }, [cars, page]);

  const columns = [
    {
      key: 'image',
      title: 'Image',
      render: (car) => (
        <img
          src={car.image || 'https://via.placeholder.com/60x40'}
          alt={car.name}
          className="car-thumb"
        />
      )
    },
    { key: 'name', title: 'Name' },
    { key: 'brand', title: 'Brand' },
    {
      key: 'type',
      title: 'Type',
      render: (car) => <span style={{ textTransform: 'capitalize' }}>{car.type}</span>
    },
    {
      key: 'fuel',
      title: 'Fuel',
      render: (car) => <span style={{ textTransform: 'capitalize' }}>{car.fuel}</span>
    },
    {
      key: 'pricePerDay',
      title: 'Price/Day',
      render: (car) => `₹${car.pricePerDay}`
    },
    {
      key: 'available',
      title: 'Available',
      render: (car) => (car.available ? 'Yes' : 'No')
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (car) => (
        <div className="table-actions">
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => {
              setSelectedCar(car);
              setModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-outline"
            type="button"
            onClick={async () => {
              const ok = window.confirm('Delete this car?');
              if (!ok) return;
              await dispatch(deleteCar(car._id));
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const submitCarForm = async (formData) => {
    if (selectedCar) {
      const result = await dispatch(updateCar({ id: selectedCar._id, formData }));
      if (updateCar.fulfilled.match(result)) {
        setModalOpen(false);
        setSelectedCar(null);
      }
      return;
    }

    const result = await dispatch(addCar(formData));
    if (addCar.fulfilled.match(result)) {
      setModalOpen(false);
    }
  };

  return (
    <section className="manage-cars-page">
      <div className="manage-cars-head">
        <h2>Cars</h2>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setSelectedCar(null);
            setModalOpen(true);
          }}
        >
          Add New Car
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading && cars.length === 0 ? (
        <Spinner />
      ) : (
        <>
          <DataTable columns={columns} rows={pagedCars} emptyText="No cars found" />

          <div className="pagination-row">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              disabled={page === pageCount}
            >
              Next
            </button>
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        title={selectedCar ? 'Edit Car' : 'Add New Car'}
        onClose={() => {
          if (!loading) {
            setModalOpen(false);
            setSelectedCar(null);
          }
        }}
      >
        <CarForm initialCar={selectedCar} onSubmit={submitCarForm} submitting={loading} />
      </Modal>
    </section>
  );
};

export default ManageCars;
