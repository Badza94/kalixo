import { Badge } from "@workspace/ui/components/badge";

interface ProductStatusBadgeProps {
  status: string;
}
export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({
  status,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "deleted":
        return "destructive";
      case "demo":
        return "outline";
      case "test":
        return "dark";
      case "coming Soon":
        return "warning";
      case "not_synced":
        return "warning";
      case "coming_soon":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Badge className="capitalize" variant={getStatusColor(status)}>
      {status || "Unknown"}
    </Badge>
  );
};
