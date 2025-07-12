"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Star, MessageCircleMore, Heart, Loader2 } from "lucide-react";
import { LanguageIcon } from "../misc/LanguageIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Interfaz que representa la estructura de la respuesta de la API para un proyecto.
export interface ProjectApiResponse {
  _id: string;
  title: string;
  authors: string[];
  // date: string; // Not used in this component
  // tags: string[]; // Not used in this component
  description: string;
  // repositoryLink: string; // Not used in this component
  tools: string[]; // Aseguramos que 'tools' es un array de strings
  // image: string; // Not used in this component
  // document: string; // Not used in this component
  // __v: number; // Not used in this component
}

// Interfaz para los comentarios
export interface Comment {
  _id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  date: string;
  likes?: number;
  replies?: Comment[];
}

// Interfaz para las props del componente ProjectCard,
// extendiendo la interfaz de la API y añadiendo props específicas del componente.
export interface ProjectCardProps extends ProjectApiResponse {
  position?: number;
  stars?: number;
  views?: number;
  showComments?: boolean;
  avatarURL?: string;
  onToggleComments?: () => void;
}

export function ProjectCard({
  _id,
  title,
  authors = ["Desconocido"],
  // date, // Not used
  // tags, // Not used
  description,
  // repositoryLink, // Not used
  tools = [],
  // image, // Not used
  // document, // Not used
  // __v, // Not used
  position,
  stars = 0,
  views = 0,
  showComments = false,
  avatarURL = "/pngs/avatar.png",
  onToggleComments,
}: ProjectCardProps) {
  const username = authors.length > 0 ? authors[0] : "Desconocido";
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!showComments || hasLoadedComments) return; // No cargar si ya están cargados
    
    setIsLoadingComments(true);
    setCommentsError(null);
    
    try {
      const response = await axios.get(`https://red-networking-backend.vercel.app/api/projects/${_id}/comentarios`);
      console.log('Comentarios cargados:', response.data);
      // Forzar que siempre sea un array
      const commentsData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setComments(commentsData);
      setHasLoadedComments(true);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
      setCommentsError('Error al cargar los comentarios');
      setComments([]);
      setHasLoadedComments(true);
    } finally {
      setIsLoadingComments(false);
    }
  }, [showComments, hasLoadedComments, _id]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    } else {
      // Resetear estados cuando se ocultan los comentarios
      setComments([]);
      setCommentsError(null);
      setHasLoadedComments(false);
    }
  }, [showComments, _id, fetchComments]);

  const renderComment = (comment: Comment) => (
    <Card key={comment._id} className="bg-gray-800 border border-gray-700 mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Avatar className="w-6 h-6">
            <AvatarImage src={comment.authorAvatar || "/pngs/avatar.png"} alt={`Avatar de ${comment.author}`} />
            <AvatarFallback>
              {comment.author ? comment.author.substring(0, 2).toUpperCase() : "CN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-col">
            <span className="text-blue-400 text-xs">{comment.author}</span>
            <span className="text-gray-400 text-xs">{new Date(comment.date).toLocaleDateString()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 flex flex-col">
          <p className="text-white font-light text-sm">
            {comment.content}
          </p>
          <div className="flex gap-3">
            <button className="flex items-center gap-1 text-gray-400 hover:text-red-500">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{comment.likes || 0}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500">
              <MessageCircleMore className="w-4 h-4" />
              <span className="text-xs">Responder</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="my-4">
      <Card className="flex flex-col bg-gray-800 text-white border-b-2 border-gray-700 rounded-b-sm">
        <CardHeader>
          <CardTitle className="flex flex-col lg:flex-row items-center gap-2 lg:justify-between">
            <div className="flex items-center gap-2">
              {position && (
                <span className="text-blue-400 font-bold text-2xl">
                  #{position}
                </span>
              )}
              <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarURL} alt={`Avatar de ${username}`} />
                  <AvatarFallback>
                    {username ? username.substring(0, 2).toUpperCase() : "CN"}
                  </AvatarFallback>
                </Avatar>
              <div className="flex-col">
                <h1 className="text-blue-400">{title}</h1>
                <h2 className="text-gray-400 font-light">
                  @{username} · {stars} Estrellas
                </h2>
              </div>
            </div>

            <div className="flex gap-2">
              <Star className="size-5 text-gray-300 hover:text-yellow-400" />
              <p className="font-light"> {stars}</p>
              {views > 0 && (
                <>
                  <Eye className="size-5 text-gray-300 hover:text-blue-400" />
                  <p className="font-light"> {views}</p>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-white font-light text-xs sm:text-sm sm:font-medium">
              {description}
            </p>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
              <div className="flex flex-row gap-4">
                {tools.map((tool) => (
                  <LanguageIcon
                    key={tool}
                    languageName={tool}
                    languageIcon={`${tool.toLowerCase()}.png`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {onToggleComments && (
                  <Button                    
                    className="border-blue-400 text-blue-400 font-light hover:bg-blue-400/10 w-full sm:w-auto"
                    onClick={onToggleComments}
                  >
                    <MessageCircleMore className="w-4 h-4 mr-2" />
                    {showComments ? "Ocultar comentarios" : "Mostrar comentarios"}
                  </Button>
                )}
                <Button
                  className="border-blue-400 text-blue-400 font-light hover:bg-blue-400/10 w-full sm:w-auto"
                  onClick={() => router.push(`/Proyecto/${_id}`)}
                >
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {showComments && (
        <div className="p-5 bg-gray-900 rounded-b-sm border-b-2 border-x-2 border-x-gray-700 border-b-gray-700">
          <h2 className="text-blue-400 m-3 text-2xl">Comentarios</h2>
          
          {isLoadingComments && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Cargando comentarios...</span>
            </div>
          )}
          
          {commentsError && (
            <div className="text-red-400 text-center p-4">
              {commentsError}
            </div>
          )}

          {(() => { console.log({ isLoadingComments, commentsError, comments }); return null; })()}
          {!isLoadingComments && !commentsError && comments.length === 0 && (
            <div className="text-gray-200 rounded text-center p-4">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </div>
          )}
          
          {!isLoadingComments && !commentsError && comments.length > 0 && (
            <div className="space-y-3">
              {comments.map(renderComment)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}