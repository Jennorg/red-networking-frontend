"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const today = new Date();
const maxAllowedDate = new Date(
  today.getFullYear() - 16,
  today.getMonth(),
  today.getDate()
);

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Nombre obligatorio")
    .refine((value) => value.trim().split(/\s+/).length >= 2, {
      message: "Debe incluir nombre y apellido",
    }),
  birthdate: z.date({
    required_error: "Fecha de nacimiento obligatoria",
  }),

  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthdate: undefined,
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#161B22]">
      <div className="flex-[3] flex flex-col justify-center items-center px-8 py-6 mx-6">
        <Image src="/uneg-logo.png" alt="UNEG" width={80} height={80} />
        <h1 className="text-3xl font-bold mt-5 text-white">Registro</h1>
        <p className="text-sm text-white mt-2">
          Regístrate y disfruta de un mundo de posibilidades
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-sm mt-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#58A6FF]">
                    Nombre y Apellido
                  </FormLabel>
                  <FormControl className="text-white">
                    <Input {...field} placeholder="Jenfer Martinez" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#58A6FF]">
                    Fecha de Nacimiento
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="relative">
                          <Input
                            readOnly
                            value={
                              field.value
                                ? format(field.value, "dd/MM/yyyy")
                                : ""
                            }
                            placeholder="Selecciona una fecha"
                            className="text-white"
                          />
                          <CalendarIcon className="absolute right-2 top-2 h-5 w-5 text-white" />
                        </div>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > maxAllowedDate}
                        captionLayout="dropdown"
                        endMonth={maxAllowedDate}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#58A6FF]">Email</FormLabel>
                  <FormControl className="text-white">
                    <Input {...field} placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#58A6FF]">Password</FormLabel>
                  <FormControl className="text-white">
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Ingresa una contraseña"
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-white" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-white" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#58A6FF] text-black hover:bg-blue-500 transition-colors"
            >
              Regístrate
            </Button>
          </form>
        </Form>

        <p className="text-sm text-white mt-4">
          Ya tienes una cuenta?{" "}
          <Link href="/Login" className="text-[#58A6FF] underline">
            Inicia sesión
          </Link>
        </p>
      </div>
      <div className="hidden md:flex flex-[6] items-center justify-center rounded-lg relative m-3">
        <Image
          src="/pngs/image_signup.png"
          alt="Background"
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
