"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase"; // Import database
import { ref, onValue, set } from "firebase/database"; // Import firebase functions
import { AIScheduler } from "@/components/ai-scheduler";
import { ManualIrrigation } from "@/components/manual-irrigation";
import { MoistureStatus } from "@/components/moisture-status";
import { useToast } from "@/hooks/use-toast";
import { WateringHistory } from "@/components/watering-history";

// Sensor interface remains the same
interface Sensor {
  id: string; // id will be the key from firebase
  name: string;
  moistureLevel: number;
}

export function DashboardClient() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isWatering, setIsWatering] = useState(false);
  const [history, setHistory] = useState<Date[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const sensorsRef = ref(database, 'sensors');
    
    // Listen for changes in the 'sensors' path
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Transform the firebase object to an array of sensors
        const sensorsArray: Sensor[] = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name || `Sensor ${key}`, // Use name from DB or generate one
          moistureLevel: data[key].moistureLevel,
        }));
        setSensors(sensorsArray);
      } else {
        setSensors([]);
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleManualWatering = () => {
    if (isWatering) return;

    const valveRef = ref(database, 'commands/valve');
    setIsWatering(true);
    set(valveRef, true); // Turn valve on

    const wateringTime = new Date();
    setHistory([wateringTime, ...history]);
    toast({
      title: "Sistema de Riego",
      description: "Riego manual activado durante 5 segundos.",
    });

    setTimeout(() => {
      setIsWatering(false);
      set(valveRef, false); // Turn valve off
      toast({
        title: "Sistema de Riego",
        description: "Riego manual finalizado.",
      });
    }, 5000);
  };

  // The average moisture is now calculated from the real sensors
  const averageMoisture = sensors.length > 0 ? sensors.reduce((acc, sensor) => acc + sensor.moistureLevel, 0) / sensors.length : 50;


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
        {sensors.length > 0 ? (
          sensors.map((sensor) => (
            <MoistureStatus
              key={sensor.id}
              moistureLevel={sensor.moistureLevel}
              sensorName={sensor.name}
            />
          ))
        ) : (
          <p className="text-muted-foreground">Esperando datos de los sensores...</p>
        )}
      </div>
      <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIScheduler currentMoisture={averageMoisture} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ManualIrrigation
            isWatering={isWatering}
            onWater={handleManualWatering}
          />
          {/* Removing simulation buttons */}
          <WateringHistory history={history} />
        </div>
      </div>
    </div>
  );
}