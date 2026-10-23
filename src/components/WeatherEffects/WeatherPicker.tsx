// Dropdown for choosing the background weather effect. The trigger shows the
// current choice's icon, highlighted while an effect is on.
import React from "react";
import { IconButton } from "../ui/IconButton";
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
        <IconButton
          variant={active ? "solid" : "default"}
          size="sm"
          label={`Weather effect: ${label}`}
          icon={<Icon strokeWidth={1.5} strokeLinecap="square" />}
          className={active ? undefined : "aria-expanded:border-line-strong"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Weather effect</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => isWeatherId(next) && onChange(next)}>
          {WEATHER_OPTIONS.map(({ id, label: optionLabel, icon: OptionIcon }) => (
            <DropdownMenuRadioItem key={id} value={id} className="min-h-11 md:min-h-8">
              <OptionIcon aria-hidden strokeWidth={1.5} strokeLinecap="square" />
              {optionLabel}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WeatherPicker;
