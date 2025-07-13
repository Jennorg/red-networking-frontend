"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

const EvaluatedProjectPage = () => {
  const { profesor_id } = useParams<{ profesor_id: string }>();
  const items = [1, 2, 3];
  const profe = profesor_id || null;
  console.log("Profesor ID:", profe);
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4 pt-10">
        {items.map((item) => (
          <div
            key={item}
            className="w-full max-w-5xl mx-auto bg-[#232733] rounded-xl shadow-lg p-8 border border-gray-700 text-white flex flex-col h-full" // Añadido flex-col y h-full
          >
            <p className="mb-4">Hola {item}</p> {/* Cambiado mt-2 a mb-4 */}
            <Link href={`/Projecto/6858d8a712e9a76a07d6db69`}>
              <div className="mt-auto flex justify-end">
                <Button className="bg-gray-500 hover:bg-black text-white">
                  Ver más
                </Button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default EvaluatedProjectPage;
