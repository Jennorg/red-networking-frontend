"use client";

interface RatingProps {
  score: number;
  feedback: string;
  onClose: () => void;
}

export default function ShowRatingPage({
  score,
  feedback,
  onClose,
}: RatingProps) {
  // Función para convertir puntaje a estrellas
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-4xl">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-4xl">
            ☆
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-500 text-4xl">
            ★
          </span>
        );
      }
    }

    return stars;
  };

  // Función para determinar el color del puntaje basado en su valor
  const getScoreColor = () => {
    if (score >= 4) return "text-green-400";
    if (score >= 2.5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700 transform transition-all duration-300 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-white">
            Evaluación del Proyecto
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Sección de puntuación */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              Puntuación
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">{renderStars()}</div>
              <span className={`text-3xl font-bold ${getScoreColor()}`}>
                {score.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Sección de feedback */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              Comentarios
            </h2>
            <div className="bg-gray-800 p-4 rounded border border-gray-600 min-h-32">
              <p className="text-gray-200 whitespace-pre-line">{feedback}</p>
            </div>
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 border border-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 