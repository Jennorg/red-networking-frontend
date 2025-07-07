// components/ui/multiselect.tsx
"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecciona opciones",
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null); // Referencia al div contenedor

   React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    // Añadir el event listener cuando el componente se monta
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]); // Se ejecuta solo una vez al montar y desmontar

  const handleSelect = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const handleRemove = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className={`relative ${className}` } ref={wrapperRef}>
      <div
        className="flex flex-wrap items-center gap-1 min-h-[40px] bg-white border border-gray-300 rounded px-2 py-1 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        
      >
        {value.length === 0 && (
          <span className="text-gray-500 text-sm ">{placeholder}</span>
        )}
        {value.map((val) => {
          const opt = options.find((o) => o.value === val);
          return (
            <span
              key={val}
              className="flex items-center bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-sm mr-1"
            >
              {opt?.label}
              <button
                type="button"
                className="ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(val);
                }}
              >
                <X size={14} />
              </button>
            </span>
          );
        })}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-36 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`flex items-center px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                value.includes(opt.value) ? "bg-blue-50" : ""
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              <span className="flex-1">{opt.label}</span>
              {value.includes(opt.value) && <Check size={16} className="text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};