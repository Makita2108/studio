"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plant } from "./dashboard-client";
import { MoistureStatus } from "./moisture-status";
import { ManualIrrigation } from "./manual-irrigation";
import { WateringHistory } from "./watering-history";
import { AIScheduler } from "./ai-scheduler";

type PlantCardProps = {
    plant: Plant;
    isWatering: boolean;
    onWater: () => void;
    onToggleAI: (isEnabled: boolean) => void;
}

export function PlantCard({ plant, isWatering, onWater, onToggleAI }: PlantCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{plant.name}</CardTitle>
                 <CardDescription>ID: {plant.id}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <Tabs defaultValue="status">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="status">Estado</TabsTrigger>
                        <TabsTrigger value="history">Historial</TabsTrigger>
                        <TabsTrigger value="settings">Ajustes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                        <div className="space-y-4">
                            <MoistureStatus moistureLevel={plant.moistureLevel} />
                            <ManualIrrigation isWatering={isWatering} onWater={onWater} />
                        </div>
                    </TabsContent>
                    <TabsContent value="history">
                        <WateringHistory history={plant.history || []} />
                    </TabsContent>
                    <TabsContent value="settings">
                        <AIScheduler isEnabled={plant.aiEnabled} onToggle={onToggleAI} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
