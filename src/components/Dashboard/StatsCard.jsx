const StatsCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    amber: 'bg-amber-100',
    purple: 'bg-purple-100',
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'amber' ? 'text-amber-600' : 'text-purple-600'}`} />
        </div>
      </div>
      <div className={`h-1 rounded-full bg-gradient-to-r ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
};

export default StatsCard;
