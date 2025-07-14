import { useQuery } from "@tanstack/react-query";
import {  RatingList } from "../types";
import axiosInstance from "../lib/axios";

const fetchRatingListByProject = async (projectId: string) => {
  const { data } = await axiosInstance.get(
    `projects/evaluaciones/${projectId}`
  );
  console.log("RATING LIST FORM HOOK", data);
  return data;
};

export const useGetRatingListByProject = (projectId: string) => {
  return useQuery<RatingList>({
    queryKey: ["rating-list"],
    queryFn: () => fetchRatingListByProject(projectId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!projectId,
  });
};
