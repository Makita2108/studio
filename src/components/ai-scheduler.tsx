import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot } from "lucide-react";

type AISchedulerProps = {
  isEnabled: boolean;
  onToggle: (isEnabled: boolean) => void;
};

export function AIScheduler({ isEnabled, onToggle }: AISchedulerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          Riego Automático Inteligente
        </CardTitle>
        <CardDescription>
          El sistema activará el riego automáticamente cuando la humedad sea
          demasiado baja.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Activar riego automático
            </p>
            <p className="text-sm text-muted-foreground">
              El sistema decidirá el mejor momento para regar.
            </p>
          </div>
          <Switch checked={isEnabled} onCheckedChange={onToggle} />
        </div>
      </CardContent>
    </Card>
  );
}
