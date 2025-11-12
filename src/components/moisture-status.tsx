import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantAnimation } from "@/components/plant-animation";

interface MoistureStatusProps {
  moistureLevel: number;
  sensorName: string; // Add sensorName prop
}

export function MoistureStatus({ moistureLevel, sensorName }: MoistureStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sensorName}</CardTitle> {/* Display sensor name */}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="w-48 h-48">
          <PlantAnimation moistureLevel={moistureLevel} />
        </div>
        <p className="text-4xl font-bold mt-4">
          {moistureLevel.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nivel de Humedad
        </p>
      </CardContent>
    </Card>
  );
}
