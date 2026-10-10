// Dropdown for choosing the background weather effect. The trigger shows the
// current choice's icon, highlighted while an effect is on.
import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getWeatherOption, isWeatherId, WEATHER_OPTIONS, type WeatherId } from "./weatherOptions";

interface WeatherPickerProps {
  value: WeatherId;
  onChange: (weather: WeatherId) => void;
}

const WeatherPicker: React.FC<WeatherPickerProps> = ({ value, onChange }) => {
  const { icon: Icon, label } = getWeatherOption(value);
  const active = value !== "off";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={active ? "default" : "outline"}
          size="icon"
          aria-label={`Weather effect: ${label}`}
          title="Weather effect"
          className={cn(!active && "aria-expanded:text-primary")}
        >
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Weather effect</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => isWeatherId(next) && onChange(next)}>
          {WEATHER_OPTIONS.map(({ id, label: optionLabel, icon: OptionIcon }) => (
            <DropdownMenuRadioItem key={id} value={id} className="min-h-11 md:min-h-8">
              <OptionIcon aria-hidden />
              {optionLabel}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WeatherPicker;
