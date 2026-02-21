import './StatCard.css';

const StatCard = ({ label, value, icon }) => {
  return (
    <article className="stat-card panel">
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span>{icon}</span>
    </article>
  );
};

export default StatCard;
