import { useQuery } from "@tanstack/react-query";
import { Rating } from "../types";
import axiosInstance from "../lib/axios";

interface data {
  teacherId: string;
  projectId: string;
}

interface GetRating {
  rating: Rating;
}

const fetchRatingByProjectTeacher = async ({ projectId, teacherId }: data) => {
  const { data } = await axiosInstance.get(
    `project/${projectId}/teacher/${teacherId}`
  );
  return data;
};

export const useGetRatingByProjectTeacher = (data: data) => {
  return useQuery<GetRating>({
    queryKey: ["Rating"],
    queryFn: () => fetchRatingByProjectTeacher(data),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
