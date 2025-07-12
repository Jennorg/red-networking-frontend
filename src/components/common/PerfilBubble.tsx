import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const PerfilBubble = () => {
  const { user, isAuthenticated } = useAuth();

  // Generar iniciales del nombre del usuario
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Obtener iniciales o fallback
  const initials = user?.name ? getInitials(user.name) : 'U';

  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback className="bg-blue-600 text-white">
        {isAuthenticated ? initials : '?'}
      </AvatarFallback>
    </Avatar>
  );
};

export default PerfilBubble;