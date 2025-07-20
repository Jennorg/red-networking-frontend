"use client";

import { useGetRatingListByProject } from "../../../hooks/useGetRatingListByProject";
import { ClipboardX, Star, StarHalf, StarOff } from "lucide-react";

interface RatingProps {
  projectId: string;
  onClose: () => void;
}

const StarRating = ({ score }: { score: number }) => {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf key="half" className="text-yellow-400 fill-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarOff key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

type Evaluation = {
  _id: string;
  teacherID?: { name?: string };
  score: number;
  feedback?: string;
  createdAt: string;
};

export default function RatingListPage({ projectId, onClose }: RatingProps) {
  const { data, isLoading, error } = useGetRatingListByProject(projectId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-500 flex items-center justify-center z-50">
        <div className="text-white text-xl font-medium">
          Cargando evaluaciones...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-500 via-gray-700 to-gray-800 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 text-center border border-gray-700">
          <p className="text-red-400 mb-4 font-medium">
            Error al cargar las evaluaciones.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const evaluaciones = (data?.evaluaciones || []) as unknown as Evaluation[];

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Evaluaciones del Proyecto
      </h2>

      {evaluaciones.length === 0 ? (
        <p className="text-white flex items-center justify-center gap-2">
          <ClipboardX className="w-6 h-6 text-white" /> No hay evaluaciones para
          este proyecto aún.
        </p>
      ) : (
        <ul className="space-y-4">
          {evaluaciones.map((evaluacion) => (
            <li
              key={evaluacion._id}
              className="border-b border-gray-700 pb-4 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-lg font-semibold text-white">
                  Profesor: {evaluacion.teacherID?.name || "Desconocido"}
                </p>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-yellow-400 mr-2">
                    {evaluacion.score.toFixed(1)}
                  </span>
                  <StarRating score={evaluacion.score} />
                </div>
              </div>
              {evaluacion.feedback && (
                <p className="text-gray-300 text-sm italic mt-2">
                  &quot;{evaluacion.feedback}&quot;
                </p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                Fecha: {new Date(evaluacion.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
