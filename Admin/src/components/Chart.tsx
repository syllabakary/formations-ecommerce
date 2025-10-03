import React from 'react';
import { BarChart3 } from 'lucide-react';

const Chart: React.FC = () => {
  const data = [
    { month: 'Jan', value: 45 },
    { month: 'Fév', value: 52 },
    { month: 'Mar', value: 38 },
    { month: 'Avr', value: 65 },
    { month: 'Mai', value: 42 },
    { month: 'Jun', value: 78 },
    { month: 'Jul', value: 89 },
    { month: 'Aoû', value: 72 },
    { month: 'Sep', value: 95 },
    { month: 'Oct', value: 68 },
    { month: 'Nov', value: 83 },
    { month: 'Déc', value: 91 }
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Ventes Annuelles</h3>
          <p className="text-sm text-gray-600">Évolution des revenus par mois</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BarChart3 className="w-4 h-4" />
          <span>4% de plus qu'en 2023</span>
        </div>
      </div>

      <div className="h-80 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
              <div
                className="bg-gradient-to-t from-[#A553C4] to-[#6636DD] rounded-t-lg transition-all duration-1000 ease-out"
                style={{
                  height: `${(item.value / maxValue) * 250}px`,
                  animationDelay: `${index * 100}ms`
                }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#A553C4] to-[#6636DD]"></div>
            <span className="text-gray-600">Revenus</span>
          </div>
        </div>
        <div className="text-gray-500">
          Moyenne: {Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length)}k€
        </div>
      </div>
    </div>
  );
};

export default Chart;