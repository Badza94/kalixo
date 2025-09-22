import React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { List, Grid } from "@workspace/ui/lucide-react";

interface ViewToggleProps {
  currentView: "list" | "cards";
  onViewChange: (view: "list" | "cards") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={currentView}
      onValueChange={(value) => {
        if (value) onViewChange(value as "list" | "cards");
      }}
    >
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="cards" aria-label="Card view">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
