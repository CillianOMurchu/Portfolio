import React from "react";
import { useOrbOrigin } from "../../context/OrbOriginContext";
import { Switch } from "../ui/Switch";

const ToggleSphere: React.FC = () => {
  const { showSphere, setShowSphere } = useOrbOrigin();

  return <Switch checked={showSphere} onChange={setShowSphere} label="Core stack" labelClassName="label" />;
};

export default ToggleSphere;
