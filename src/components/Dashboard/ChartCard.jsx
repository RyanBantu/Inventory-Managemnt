const ChartCard = ({ title, children }) => {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
    >
      <h3 className="text-lg font-bold text-slate-900 mb-6">{title}</h3>
      <div className="h-80">{children}</div>
    </div>
  );
};

export default ChartCard;
