import React from 'react';

const ActionCard = ({ icon: Icon, title, description, badge, onClick }) => {
  return (
    <div 
      className="bg-blue-100 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      {badge && (
        <span className="absolute top-4 right-4 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
          {badge}
        </span>
      )}
      <div className="flex flex-col items-center text-center space-y-4">
         <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-50 transition-colors">
          <Icon className="w-8 h-8 text-blue-950 group-hover:text-blue-600 transition-colors" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
