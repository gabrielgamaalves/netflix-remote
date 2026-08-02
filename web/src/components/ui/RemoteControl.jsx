import {
  RiArrowDownSLine,
  RiHome2Line,
  RiSearchLine,
  RiArrowLeftLine,
} from "react-icons/ri";

import { FunctionButtonControl } from "./FunctionButtonControl";

function DirectionalButton({ direction, rotation, onClick, label }) {
  return (
    <button
      className="flex-1 z-10 flex items-center justify-center text-btn-bg hover:bg-[#3d3d3d] transition-all"
      onClick={() => onClick(direction)}
      aria-label={label}
    >
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        <RiArrowDownSLine size={28} />
      </div>
    </button>
  );
}

export function RemoteControl({ onDirection }) {
  const handlePress = (direction) => {
    onDirection?.(direction);
  };

  return (
    <div className="flex-center flex-col">
      <div className="flex-center w-64 flex-col gap-10">
        <div className="relative grid grid-cols-2 size-64 rounded-full overflow-hidden rotate-45 bg-btn-bg">
          <DirectionalButton
            direction="up"
            rotation={135}
            onClick={handlePress}
            label="Up"
          />
          <DirectionalButton
            direction="left"
            rotation={-135}
            onClick={handlePress}
            label="Left"
          />

          <button
            onClick={() => handlePress("ok")}
            aria-label="OK"
            className="z-50 absolute -rotate-45 rounded-full bg-[#5c5c5c] hover:bg-[#575757] transition-all size-[40%] top-[30.4%] left-[30.4%]"
          />

          <DirectionalButton
            direction="down"
            rotation={45}
            onClick={handlePress}
            label="Down"
          />
          <DirectionalButton
            direction="right"
            rotation={-45}
            onClick={handlePress}
            label="Right"
          />
        </div>
        <div className="flex-between w-full">
          <FunctionButtonControl icon={RiArrowLeftLine} />
          <FunctionButtonControl icon={RiHome2Line} className="size-16" />
          <FunctionButtonControl icon={RiSearchLine} />
        </div>
      </div>
    </div>
  );
}
