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
  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Avatar className="w-5 h-5">
          <AvatarImage src={languageIcon} alt={"icon-img"} />
        </Avatar>
        <p>{languageName}</p>
      </div>
    </>
  );
}
