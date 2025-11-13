'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlantCard } from './plant-card';
import { Button } from './ui/button';
import { Plus, Droplets } from 'lucide-react';

// Expone la función de riego global en la ventana para simulación
declare global {
  interface Window {
    triggerGlobalWatering: () => void;
  }
}

export type Plant = {
  id: number;
  name: string;
  moistureLevel: number;
  history: Date[];
  aiEnabled: boolean;
  lastWatering: Date | null;
};

const initialPlants: Plant[] = [
  { id: 1, name: 'Tomate Cherry #1', moistureLevel: 55, history: [], aiEnabled: true, lastWatering: null },
  { id: 2, name: 'Lechuga Romana #2', moistureLevel: 62, history: [], aiEnabled: true, lastWatering: null },
  { id: 3, name: 'Pimiento Verde #3', moistureLevel: 48, history: [], aiEnabled: true, lastWatering: null },
];

const MOISTURE_THRESHOLD = 40;
const WATERING_COOLDOWN = 1000 * 60 * 5; // 5 minutos

export function DashboardClient() {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [isWatering, setIsWatering] = useState<number[]>([]);
  const { toast } = useToast();

  const handleGlobalWatering = useCallback(() => {
    if (isWatering.length > 0) return;

    const allPlantIds = plants.map(p => p.id);
    setIsWatering(allPlantIds);

    setPlants(prev =>
      prev.map(p => ({
        ...p,
        history: [...p.history, new Date()],
      })),
    );

    toast({
      title: 'Simulador Externo',
      description: '¡Riego general activado para todas las plantas!',
    });

    const wateringEffect = setInterval(() => {
      setPlants(prev =>
        prev.map(p => ({
          ...p,
          moistureLevel: Math.min(p.moistureLevel + 2, 100),
        })),
      );
    }, 100);

    setTimeout(() => {
      setIsWatering([]);
      clearInterval(wateringEffect);
      toast({
        title: 'Simulador Externo',
        description: 'Riego general finalizado.',
      });
    }, 5000);
  }, [isWatering, plants, toast]);

  // Exponer la función de riego global al objeto window para simulación
  useEffect(() => {
    window.triggerGlobalWatering = handleGlobalWatering;
    // Limpia la función cuando el componente se desmonta
    return () => {
      // @ts-ignore
      window.triggerGlobalWatering = undefined;
    };
  }, [handleGlobalWatering]);

  // Simulación de cambio de humedad y riego automático
  useEffect(() => {
    const interval = setInterval(() => {
      setPlants(prevPlants =>
        prevPlants.map(plant => {
          const moistureChange = Math.random() * 0.5;
          let newMoistureLevel = plant.moistureLevel - moistureChange;

          const now = new Date();
          const canWater = !plant.lastWatering || now.getTime() - plant.lastWatering.getTime() > WATERING_COOLDOWN;

          if (plant.aiEnabled && newMoistureLevel < MOISTURE_THRESHOLD && canWater) {
            newMoistureLevel = 100;
            const newHistory = [...plant.history, new Date()];

            setTimeout(() => {
              toast({
                title: 'Riego Automático',
                description: `La planta '${plant.name}' ha sido regada.`,
              });
            }, 0);

            return { ...plant, moistureLevel: newMoistureLevel, history: newHistory, lastWatering: new Date() };
          }

          return { ...plant, moistureLevel: Math.max(0, newMoistureLevel) };
        }),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleManualWatering = (plantId: number) => {
    if (isWatering.length > 0) return;

    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    setIsWatering([plantId]);
    setPlants(prev => prev.map(p => (p.id === plantId ? { ...p, history: [...p.history, new Date()] } : p)));
    toast({
      title: 'Sistema de Riego',
      description: `Riego manual activado para ${plant.name}.`,
    });

    const wateringEffect = setInterval(() => {
      setPlants(prev =>
        prev.map(p =>
          p.id === plantId ? { ...p, moistureLevel: Math.min(p.moistureLevel + 2, 100) } : p,
        ),
      );
    }, 100);

    setTimeout(() => {
      setIsWatering([]);
      clearInterval(wateringEffect);
      toast({
        title: 'Sistema de Riego',
        description: `Riego manual finalizado para ${plant.name}.`,
      });
    }, 5000);
  };

  const handleToggleAI = (plantId: number, isEnabled: boolean) => {
    setPlants(prev => prev.map(p => (p.id === plantId ? { ...p, aiEnabled: isEnabled } : p)));
    const plant = plants.find(p => p.id === plantId);
    toast({
      title: 'Riego Automático',
      description: `El riego automático ha sido ${isEnabled ? 'activado' : 'desactivado'} para la planta '${plant?.name}'.`,
    });
  };

  const handleAddPlant = () => {
    if (plants.length >= 30) {
      toast({
        title: 'Límite Alcanzado',
        description: 'No puedes agregar más de 30 plantas.',
        variant: 'destructive',
      });
      return;
    }
    const newId = plants.length > 0 ? Math.max(...plants.map(p => p.id)) + 1 : 1;
    const newPlant: Plant = {
      id: newId,
      name: `Planta #${newId}`,
      moistureLevel: 50,
      history: [],
      aiEnabled: true,
      lastWatering: null,
    };
    setPlants([...plants, newPlant]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end gap-2">
        <Button onClick={handleGlobalWatering} variant="secondary">
          <Droplets className="mr-2 h-4 w-4" />
          Activar Riego General
        </Button>
        <Button onClick={handleAddPlant}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Planta
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            isWatering={isWatering.includes(plant.id)}
            onWater={() => handleManualWatering(plant.id)}
            onToggleAI={isEnabled => handleToggleAI(plant.id, isEnabled)}
          />
        ))}
      </div>
    </div>
  );
}
