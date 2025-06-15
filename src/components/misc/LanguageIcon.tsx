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
        <Avatar className=" sm:w-5 sm:h-5 h-2.5 w-2.5">
          <AvatarImage src={languageIcon} alt={"icon-img"} />
        </Avatar>
        <p className="text-xs sm:text-sm">{languageName}</p>
      </div>
    </>
  );
}
