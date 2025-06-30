import { Link } from 'react-router-dom';

const SimulationCard = ({ simulation }) => {
  const { id, title, company, category, difficulty, duration, image, isNew } = simulation;

  return (
    <Link to={`/simulation/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* <img src={image} alt={title} className="w-full h-40 object-cover" /> */}

                    <div className="h-48 bg-radial-blue rounded-t-lg flex items-center justify-center">
                      {image ? (
                        <img
                          src={image}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="text-blue-950 text-4xl font-bold">
                          {title || '🏢'}
                        </div>
                      )}
                    </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>

          <p className="text-sm text-gray-600 mb-2">{company}</p>

          <div className="flex flex-wrap gap-2 text-xs text-gray-700">
            {category && <span className="bg-gray-100 px-2 py-1 rounded">{category}</span>}
            {difficulty && <span className="bg-gray-100 px-2 py-1 rounded">{difficulty}</span>}
            {duration && <span className="bg-gray-100 px-2 py-1 rounded">{duration}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SimulationCard;
