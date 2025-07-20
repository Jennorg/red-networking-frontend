export type Project = {
  _id: string;
  title: string;
  description: string;
  authors: string[];
  tags: string[];
  tools: string[];
  repositoryLink: string;
  image: string;
  document: string;
  puntuacion: number[];
  comments: string[];
  date: string;
};

export type Rating = {
  _id: string;
  projectID: string;
  teacherID: string;
  score: number;
  feedback: string;
};

interface Teacher {
  _id: string;
  name: string;
}

interface Evaluation {
  _id: string;
  projectID: string;
  teacherID: Teacher;
  score: number;
  feedback: string;
}

export type RatingList = {
  evaluaciones: Evaluation[];
};
