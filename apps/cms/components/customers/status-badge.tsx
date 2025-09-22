import { Badge } from "@workspace/ui/components/badge";

interface CustomerStatusBadge {
  status: string;
  label?: string;
}
export const CustomerStatusBadge: React.FC<CustomerStatusBadge> = ({
  status,
  label,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "blocked":
        return "destructive";
      case "review":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Badge className="capitalize" variant={getStatusColor(status)}>
      {label || "Unknown"}
    </Badge>
  );
};
