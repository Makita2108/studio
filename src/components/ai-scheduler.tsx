"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, Bot } from "lucide-react";

import { getWateringSchedule } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  plantType: z.string().min(2, {
    message: "El tipo de planta debe tener al menos 2 caracteres.",
  }),
  timeOfDay: z.string({
    required_error: "Por favor, seleccione una hora del día.",
  }),
  weatherForecast: z.string().min(10, {
    message: "El pronóstico del tiempo debe tener al menos 10 caracteres.",
  }),
});

type AISchedulerProps = {
  currentMoisture: number;
};

export function AIScheduler({ currentMoisture }: AISchedulerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plantType: "",
      weatherForecast: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSchedule(null);

    const input = {
      ...values,
      soilMoisture: Math.round(currentMoisture),
    };

    const result = await getWateringSchedule(input);

    if (result.success) {
      setSchedule(result.schedule!);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }

    setIsLoading(false);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          Horario de Riego con IA
        </CardTitle>
        <CardDescription>
          Deja que la IA cree un horario de riego personalizado para tu planta
          basado en las condiciones actuales.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="plantType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Planta</FormLabel>
                  <FormControl>
                    <Input placeholder="ej., Tomate, Rosa, Lechuga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora del Día</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una hora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Mañana</SelectItem>
                      <SelectItem value="afternoon">Tarde</SelectItem>
                      <SelectItem value="evening">Noche</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherForecast"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Pronóstico del Tiempo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ej., Soleado y caluroso durante los próximos 3 días."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 mt-auto">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generar Horario
            </Button>
            {schedule && (
              <div className="p-4 bg-secondary rounded-lg w-full flex items-start gap-4">
                  <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary-foreground/90">Horario Personalizado:</p>
                    <p className="text-sm text-secondary-foreground">{schedule}</p>
                  </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
