import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";

function FilterCountryRender(props: { countryCode: string; label: string }) {
  return (
    <div className="flex items-end gap-2">
      <CircleFlag
        className="h-4 w-4"
        countryCode={props.countryCode.toLowerCase()}
      />
      <span className="text-sm font-medium">{props.label}</span>
    </div>
  );
}

export default FilterCountryRender;
