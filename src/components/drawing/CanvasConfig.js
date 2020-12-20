import React from "react";
import Slider from "../utils/Slider";
export default function CanvasConfig({ canvasConfig, setCanvasConfig }) {
  const handleCanvasChange = (e) => {
    let newState = {
      ...canvasConfig,
      [e.target.name]: !canvasConfig[e.target.name],
    };
    setCanvasConfig(newState);
  };
  return (
    <div className="bg-blue-100">
      <form className="flex justify-center items-center h-8">
        {/* <Slider></Slider> */}
        <input
          type="checkbox"
          id="show_id"
          name="show_id"
          checked={canvasConfig.show_id}
          onClick={handleCanvasChange}
          readOnly
        ></input>
        <label className="ml-1" htmlFor="show_id">
          Show Id
        </label>
        <input
          className="ml-4"
          type="checkbox"
          id="show_results"
          name="show_results"
          checked={canvasConfig.show_results}
          readOnly
          onClick={handleCanvasChange}
        ></input>
        <label className="ml-1" htmlFor="show_results">
          Show Results
        </label>
      </form>
    </div>
  );
}
