const Spinner = () => {
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: '26px 0' }}>
      <span
        style={{
          width: 34,
          height: 34,
          border: '3px solid #2f2f2f',
          borderTopColor: '#e8451e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
    </div>
  );
};

export default Spinner;
