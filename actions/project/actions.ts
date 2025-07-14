import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "../../lib/axios";

export interface RatingData {
  projectID: string;
  teacherID: string | null;
  score: number;
  feedback: string;
}

export interface PuntuacionData {
  projectID: string;
  data: { puntuacion: number; feedback: string };
}
export const useCreateProjectRating = () => {
  //const queryClient = useQueryClient();
  const createMutation = useMutation({
    //mutationKey: ["pilots"],
    mutationFn: async (data: RatingData) => {
      await axiosInstance.post(`/projects/evaluacion`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast.success("¡Creado!", {
        description: ` La evaluacion ha sido creada correctamente.`,
      });
    },
    onError: (error) => {
      toast.error("Oops!", {
        description: "No se pudo realizar la evluacion...",
      });
      console.log(error);
    },
  });
  return {
    createRating: createMutation,
  };
};

export const useCreatePuntuacionProject = () => {
  //const queryClient = useQueryClient();
  const createMutation = useMutation({
    //mutationKey: ["pilots"],
    mutationFn: async ({ projectID, data }: PuntuacionData) => {
      await axiosInstance.post(
        `/projects/${projectID}/agregar-puntuacion`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("¡Creado!", {
        description: ` La puntuacion ha sido creada correctamente.`,
      });
    },
    onError: (error) => {
      toast.error("Oops!", {
        description: "No se pudo realizar la evluacion...",
      });
      console.log(error);
    },
  });
  return {
    createPuntuacion: createMutation,
  };
};
