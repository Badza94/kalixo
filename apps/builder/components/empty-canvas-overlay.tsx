"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { LayoutTemplate, Sparkles } from "@workspace/ui/lucide-react";

interface EmptyCanvasOverlayProps {
  onSelectTemplate?: () => void;
  onCreateOwn?: () => void;
}

export function EmptyCanvasOverlay({
  onSelectTemplate,
  onCreateOwn,
}: EmptyCanvasOverlayProps) {
  return (
    <div className="flex absolute inset-0 z-50 justify-center items-center backdrop-blur-sm bg-background/80">
      <div className="flex flex-col gap-6 items-center px-4">
        <div className="mb-4 space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <p className="text-muted-foreground">
            Choose how you&apos;d like to build your page
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl sm:grid-cols-2">
          <Card
            className="flex flex-col h-full border-2 transition-shadow cursor-pointer hover:shadow-lg hover:border-primary/50"
            onClick={onSelectTemplate}
          >
            <CardHeader>
              <div className="flex justify-center items-center mb-2">
                <LayoutTemplate className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-center">Select a Template</CardTitle>
              <CardDescription className="text-center">
                Choose from our collection of pre-designed templates to get
                started quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-end">
              <Button
                className="w-full"
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate?.();
                }}
              >
                Browse Templates
              </Button>
            </CardContent>
          </Card>

          <Card
            className="flex flex-col h-full border-2 transition-shadow cursor-pointer hover:shadow-lg hover:border-primary/50"
            onClick={onCreateOwn}
          >
            <CardHeader>
              <div className="flex justify-center items-center mb-2">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-center">Create Your Own</CardTitle>
              <CardDescription className="text-center">
                Start with a blank canvas and build your page from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-end">
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateOwn?.();
                }}
              >
                Start Building
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
