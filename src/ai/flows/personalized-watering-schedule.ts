'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized watering schedule based on sensor readings,
 * soil moisture, time of day, and weather forecasts.
 *
 * The flow takes sensor readings and other relevant data as input and uses an AI tool to determine an optimal watering schedule.
 * It exports:
 * - `generatePersonalizedWateringSchedule`: The main function to trigger the flow.
 * - `PersonalizedWateringScheduleInput`: The TypeScript type for the input schema.
 * - `PersonalizedWateringScheduleOutput`: The TypeScript type for the output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const PersonalizedWateringScheduleInputSchema = z.object({
  soilMoisture: z.number().describe('El nivel actual de humedad del suelo (porcentaje).'),
  timeOfDay: z.string().describe('La hora actual del día (ej., mañana, tarde, noche).'),
  weatherForecast: z.string().describe('Un breve pronóstico del tiempo para los próximos días.'),
  plantType: z.string().describe('El tipo de planta (ej., tomate, rosa, lechuga).'),
  location: z.string().describe('La ubicación de la planta.').optional(),
});
export type PersonalizedWateringScheduleInput = z.infer<typeof PersonalizedWateringScheduleInputSchema>;

// Define the output schema
const PersonalizedWateringScheduleOutputSchema = z.object({
  wateringSchedule: z.string().describe('Un horario de riego personalizado (ej., Regar cada dos días por la mañana).'),
});
export type PersonalizedWateringScheduleOutput = z.infer<typeof PersonalizedWateringScheduleOutputSchema>;

// Define the tool to generate the watering schedule
const generateWateringScheduleTool = ai.defineTool(
  {
    name: 'generateWateringSchedule',
    description: 'Genera un horario de riego personalizado basado en lecturas de sensores, humedad del suelo, hora del día, pronósticos del tiempo y tipo de planta.',
    inputSchema: PersonalizedWateringScheduleInputSchema,
    outputSchema: PersonalizedWateringScheduleOutputSchema,
  },
  async (input) => {
    // This tool uses a prompt to generate the watering schedule.  It does not directly implement the schedule generation.
    const {output} = await wateringSchedulePrompt(input);
    return output!;
  }
);

// Define the prompt
const wateringSchedulePrompt = ai.definePrompt({
  name: 'wateringSchedulePrompt',
  input: {schema: PersonalizedWateringScheduleInputSchema},
  output: {schema: PersonalizedWateringScheduleOutputSchema},
  prompt: `Eres un asistente de jardinería experto. Responde siempre en español. Basado en la siguiente información, crea un horario de riego personalizado para la planta:

Humedad del Suelo: {{soilMoisture}}%
Hora del Día: {{timeOfDay}}
Pronóstico del Tiempo: {{weatherForecast}}
Tipo de Planta: {{plantType}}

Horario de Riego: `,
});

// Define the flow
const personalizedWateringScheduleFlow = ai.defineFlow(
  {
    name: 'personalizedWateringScheduleFlow',
    inputSchema: PersonalizedWateringScheduleInputSchema,
    outputSchema: PersonalizedWateringScheduleOutputSchema,
  },
  async input => {
    const {output} = await generateWateringScheduleTool(input);
    return output!;
  }
);

/**
 * Generates a personalized watering schedule based on sensor readings, soil moisture, time of day, and weather forecasts.
 *
 * @param input - The input parameters for generating the watering schedule.
 * @returns A promise that resolves to the generated watering schedule.
 */
export async function generatePersonalizedWateringSchedule(
  input: PersonalizedWateringScheduleInput
): Promise<PersonalizedWateringScheduleOutput> {
  return personalizedWateringScheduleFlow(input);
}
