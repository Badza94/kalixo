"use client";

import { Button } from "@workspace/ui/components/button";
import { Pause, Play, RotateCcw, Square } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

function PauseContinueOrder() {
  const [isPaused, setIsPaused] = useState(false);
  const t = useTranslations("Orders.SingleOrder");

  return (
    <div className="flex items-center gap-2">
      {!isPaused ? (
        <Button onClick={() => setIsPaused(!isPaused)}>
          <Pause className="h-4 w-4 mr-2" />
          {t("pauseOrder")}
        </Button>
      ) : (
        <>
          <Button onClick={() => setIsPaused(!isPaused)}>
            <Play className="h-4 w-4 mr-2" />
            {t("continue")}
          </Button>
          <Button onClick={() => setIsPaused(!isPaused)} variant="destructive">
            <Square className="h-4 w-4 mr-2" />
            {t("stop")}
          </Button>
          <Button onClick={() => setIsPaused(!isPaused)} variant="secondary">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t("reorder")}
          </Button>
        </>
      )}
    </div>
  );
}

export default PauseContinueOrder;
