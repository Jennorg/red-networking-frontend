"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface LanguageIconProps {
  languageName: string;
  languageIcon: string;
}

export function LanguageIcon({
  languageIcon,
  languageName,
}: LanguageIconProps) {
  // Si el icono es 'node.png', usar 'nodejs.png' en su lugar
  let iconFile = languageIcon;
  if (iconFile === 'node.png') iconFile = 'nodejs.png';
  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Avatar className=" sm:w-5 sm:h-5 h-4 w-4">
          <AvatarImage src={`/pngs/${iconFile}`} alt={"icon-img"} />
        </Avatar>
        <p className="text-xs sm:text-sm">{languageName}</p>
      </div>
    </>
  );
}
