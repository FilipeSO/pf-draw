import React from "react";
export default function CanvasConfig({ canvasConfig, setCanvasConfig }) {
  const handleCanvasChange = (e) => {
    let newState = {};
    if (e.target.name === "show_id" || e.target.name === "show_results") {
      newState = {
        ...canvasConfig,
        [e.target.name]: !canvasConfig[e.target.name],
      };
    } else if (e.target.name === "line_opacity") {
      let input_value = parseInt(e.target.value) > 100 ? "100" : e.target.value;
      newState = {
        ...canvasConfig,
        [e.target.name]: input_value,
      };
    } else {
      newState = {
        ...canvasConfig,
        [e.target.name]: e.target.value,
      };
    }

    setCanvasConfig(newState);
  };
  return (
    <div className="bg-blue-500 absolute w-full z-50">
      <form
        className="flex justify-center items-center h-8 text-white"
        onSubmit={(e) => e.preventDefault()}
      >
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
        <input
          className="ml-4 bg-blue-400"
          type="number"
          id="line_opacity"
          name="line_opacity"
          value={canvasConfig.line_opacity}
          onChange={handleCanvasChange}
          min="0"
          max="100"
        ></input>
        <label className="ml-1" htmlFor="line_opacity">
          % Opacity
        </label>
      </form>
    </div>
  );
}
