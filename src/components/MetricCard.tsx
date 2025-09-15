interface MetricCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: string;
    color: 'blue' | 'green' | 'yellow' | 'red';
}

const MetricCard = ({title, value, icon, color} : MetricCardProps) => {
    const colorClasses = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        yellow: 'from-yellow-500 to-orange-500',
        red: 'from-red-500 to-pink-500',
    };
    return (
        <div className="bg-slate-800/50 background-blur-sm border border-slate-600/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center text-xl`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-sm text-slate-400 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    )
};
export default MetricCard;