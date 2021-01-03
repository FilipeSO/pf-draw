import React, { useState } from "react";

const ConfigForms = ({ config, updateConfig }) => {
  const [formConfig, setFormConfig] = useState(config);
  const handleConfigChange = (e) => {
    e.preventDefault();
    let newState = { ...formConfig, [e.target.name]: e.target.value };
    setFormConfig(newState);
    console.log(newState);
  };
  const handleConfigSubmit = (e) => {
    e.preventDefault();
    updateConfig(formConfig);
  };
  return (
    <div>
      <div>
        <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
          SETTINGS
        </h2>
        <form onSubmit={handleConfigSubmit}>
          <div className="flex items-center mt-2">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Solver:
            </label>
            <select
              onChange={handleConfigChange}
              value={formConfig.solver}
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              name="solver"
              required
            >
              <option disabled value="">
                -- select an option --
              </option>
              <option value="newton-raphson">Newton-Raphson</option>
              <option value="fast-decoupled">Fast Decoupled</option>
            </select>
          </div>

          <div className="flex items-center mt-2">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Convergence Tolerance:
            </label>
            <select
              onChange={handleConfigChange}
              value={formConfig.err_tolerance}
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              name="err_tolerance"
              required
            >
              <option disabled value="">
                -- select an option --
              </option>
              <option value="0.1">0.1</option>
              <option value="0.01">0.01</option>
              <option value="0.001">0.001</option>
              <option value="0.0001">0.0001</option>
              <option value="0.00001">0.00001</option>
              <option value="0.000001">0.000001</option>
            </select>
          </div>

          <div className="flex items-center mt-2">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Show Iterations:
            </label>
            <select
              onChange={handleConfigChange}
              value={formConfig.show_iterations}
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              name="show_iterations"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="flex">
            <input
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
              type="submit"
              value="Solve"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ConfigForms;
