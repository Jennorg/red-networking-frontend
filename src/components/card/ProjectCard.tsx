"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Star, MessageCircleMore, Heart, Loader2 } from "lucide-react";
import { LanguageIcon } from "../misc/LanguageIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/env";
import DeleteCommentButton from "@/components/admin/DeleteCommentButton";
import Link from "next/link";

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
  authorID?: string; // Add authorID field from backend
  authorAvatar?: string;
  date: string;
  likes: string[]; // en lugar de number
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
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  isFavoriteLoading?: boolean;
  favoritos?: number
}

export function ProjectCard(props: ProjectCardProps) {
  const {
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
    isFavorited = false,
    onToggleFavorite,
    isFavoriteLoading = false,
    favoritos,
  } = props;
  const { user } = useAuth(); // asume user.id está disponible
  const username = authors.length > 0 ? authors[0] : "Desconocido";
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [localStarCount, setLocalStarCount] = useState(stars || 0);
  const [authorNames, setAuthorNames] = useState<string[]>([]);
  const [commentAuthorNames, setCommentAuthorNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Obtener nombres de autores desde el backend
    async function fetchAuthorNames() {
      if (!authors || authors.length === 0) {
        setAuthorNames(["Desconocido"]);
        return;
      }
      try {
        const res = await axios.get("https://red-networking-backend.vercel.app/auth/users");
        const users = res.data.users || [];
        const names = authors.map((id) => {
          const user = users.find((u: any) => u._id === id);
          return user ? user.name : "Usuario desconocido";
        });
        setAuthorNames(names);
      } catch {
        setAuthorNames(["Desconocido"]);
      }
    }
    fetchAuthorNames();
  }, [authors]);

  const fetchComments = useCallback(async () => {
    if (!showComments || hasLoadedComments) return; // No cargar si ya están cargados

    setIsLoadingComments(true);
    setCommentsError(null);

    try {
      const response = await axios.get(API_ENDPOINTS.PROJECT_COMMENTS(_id));
      console.log('Comentarios cargados:', response.data);
      // Forzar que siempre sea un array
      const commentsData = Array.isArray(response.data.comentarios)
        ? response.data.comentarios
        : [];
      setComments(commentsData);
      
      // Obtener nombres de autores de los comentarios
      if (commentsData.length > 0) {
        try {
          // Intentar obtener nombres directamente del backend
          const authorIds = [...new Set(commentsData.map((comment: Comment) => comment.authorID || comment.author))];
          console.log('Unique author IDs:', authorIds);
          
          const authorNamesMap: { [key: string]: string } = {};
          
          // Para cada autor único, intentar obtener su información
          for (const authorId of authorIds) {
            if (!authorId || typeof authorId !== 'string') {
              console.warn(`Invalid authorId: ${authorId}`);
              authorNamesMap[authorId as string] = "Usuario desconocido";
              continue;
            }

            try {
              const userResponse = await axios.get(
                `https://red-networking-backend.vercel.app/api/getUser/${authorId}`,
                { timeout: 5000 }
              );
              console.log(`User response for ${authorId}:`, userResponse.data);
              
              if (userResponse.data && userResponse.data.user) {
                authorNamesMap[authorId as string] = userResponse.data.user.name || "Usuario desconocido";
              } else if (userResponse.data && userResponse.data.name) {
                authorNamesMap[authorId as string] = userResponse.data.name;
              } else {
                authorNamesMap[authorId as string] = "Usuario desconocido";
              }
            } catch (error: any) {
              console.error(`Error getting user ${authorId}:`, error);
              authorNamesMap[authorId as string] = "Usuario desconocido";
            }
          }
          

          
          console.log('Final author names map:', authorNamesMap);
          setCommentAuthorNames(authorNamesMap);
        } catch (error) {
          console.error("Error obteniendo nombres de autores de comentarios:", error);
          // No fallar completamente si hay error obteniendo nombres
          setCommentAuthorNames({});
        }
      }
      
      setHasLoadedComments(true);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
      setCommentsError("Error al cargar los comentarios");
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

  // Sincronizar el contador local cuando cambien las props de stars
  useEffect(() => {
    setLocalStarCount(stars || 0);
  }, [stars]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      const res = await axios.post(
        `https://red-networking-backend.vercel.app/api/projects/${_id}/agregar-comentario`,
        {
          content: newComment,
          authorID: user?.id,
        }
      );

      if (res.data.ok) {
        setComments((prev) => [res.data.comentario, ...prev]);
        setNewComment("");
        setShowCommentInput(false);
      } else {
        console.error("Error al comentar:", res.data.error);
      }
    } catch (err) {
      console.error("Error de red:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user?.id) return;

    try {
      const res = await axios.post(
        `https://red-networking-backend.vercel.app/api/projects/comentarios/${commentId}/like`,
        { userId: user.id }
      );

      if (res.data.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, likes: res.data.resultado.likes } : c
          )
        );
      }
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  // Función para manejar el toggle de favorito con actualización inmediata del contador
  const handleToggleFavorite = () => {
    if (!onToggleFavorite) return;
    
    // Actualizar inmediatamente el contador local
    if (isFavorited) {
      // Si está favorito, al hacer clic lo quitamos, entonces restamos 1
      setLocalStarCount(prev => Math.max(0, prev - 1));
    } else {
      // Si no está favorito, al hacer clic lo agregamos, entonces sumamos 1
      setLocalStarCount(prev => prev + 1);
    }
    
    // Llamar a la función original
    onToggleFavorite();
  };

  const renderComment = (comment: Comment) => {
    // Usar createdAt si existe, si no, usar date
    const dateString = (comment as any).createdAt || comment.date;
    let fechaFormateada = "Fecha no disponible";
    if (dateString) {
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj.getTime())) {
        fechaFormateada = dateObj.toLocaleDateString();
      }
    }
    return (
      <Card key={comment._id} className="bg-gray-800 border border-gray-700 mb-3">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={comment.authorAvatar || "/pngs/avatar.png"}
                  alt={`Avatar de ${comment.author}`}
                />
                <AvatarFallback>
                  {comment.author
                    ? comment.author.substring(0, 2).toUpperCase()
                    : "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-blue-400 text-xs">{commentAuthorNames[comment.authorID || comment.author] || comment.author}</span>
                <span className="text-gray-400 text-xs">{fechaFormateada}</span>
              </div>
            </div>

            {user?.role === "admin" && (
              <DeleteCommentButton
                commentId={comment._id}
                adminId={user.id}
                onDeleted={() =>
                  setComments((prev) =>
                    prev.filter((c) => c._id !== comment._id)
                  )
                }
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 flex flex-col">
            <p className="text-white font-light text-sm">{comment.content}</p>
            <div className="flex gap-3">
              <button
                className={`flex items-center gap-1 text-xs ${
                  comment.likes.includes(user?.id ?? "")
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
                onClick={() => handleLike(comment._id)}
              >
                <Heart className="w-4 h-4" />
                <span>{comment.likes.length}</span>
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
  };

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
                <AvatarImage src={avatarURL} alt={`Avatar de ${authorNames[0] || "Desconocido"}`} />
                <AvatarFallback>
                  {authorNames[0] ? authorNames[0].substring(0, 2).toUpperCase() : "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-col">
                <h1 className="text-blue-400 mb-1">{title}</h1>
                <h2 className="text-gray-400 font-light">
                  {authorNames.map((name, idx) => (
                    <Link 
                      key={idx} 
                      href={`/Perfil?userId=${authors[idx]}`}
                      className="hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      @{name}{idx < authorNames.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </h2>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleToggleFavorite}
                disabled={isFavoriteLoading}
                className="flex items-center gap-1 hover:scale-110 transition-transform disabled:opacity-50"
              >
                {isFavoriteLoading ? (
                  <Loader2 className="size-5 animate-spin text-yellow-400" />
                ) : (
                  <Star 
                    className={`size-5 ${
                      isFavorited 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300 hover:text-yellow-400"
                    }`} 
                  />
                )}
                <p className="font-light"> {localStarCount}</p>
              </button>
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

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex gap-2">
                  {onToggleComments && (
                    <Button
                      className="border-blue-400 text-blue-400 font-light hover:bg-blue-400/10"
                      onClick={onToggleComments}
                    >
                      <MessageCircleMore className="w-4 h-4 mr-2" />
                      {showComments
                        ? "Ocultar comentarios"
                        : "Mostrar comentarios"}
                    </Button>
                  )}
                  <Button
                    className="border-blue-400 text-blue-400 font-light hover:bg-blue-400/10"
                    onClick={() => setShowCommentInput((prev) => !prev)}
                  >
                    {showCommentInput ? "Cancelar" : "Comentar"}
                  </Button>
                </div>

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

          {showCommentInput && (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
              <div className="relative w-full">
                <Textarea
                  value={newComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setNewComment(e.target.value);
                    }
                  }}
                  placeholder="Escribe tu comentario..."
                  className="bg-[#1f2937] text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none rounded-md p-3 h-12"
                />
                <p className="absolute bottom-1 right-4 text-xs text-gray-400">
                  {newComment.length}/1000
                </p>
              </div>

              <Button
                onClick={handleAddComment}
                disabled={isSubmittingComment || newComment.trim() === ""}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                {isSubmittingComment ? "Enviando..." : "Publicar"}
              </Button>
            </div>
          )}

          {isLoadingComments && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">
                Cargando comentarios...
              </span>
            </div>
          )}

          {commentsError && (
            <div className="text-red-400 text-center p-4">{commentsError}</div>
          )}

          {(() => {
            console.log({ isLoadingComments, commentsError, comments });
            return null;
          })()}
          {!isLoadingComments && !commentsError && comments.length === 0 && (
            <div className="text-gray-200 rounded text-center p-4">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4"></div>

          {!isLoadingComments && !commentsError && comments.length > 0 && (
            <div className="space-y-3">{comments.map(renderComment)}</div>
          )}
        </div>
      )}
    </div>
  );
}
