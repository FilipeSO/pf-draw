import React, { useState } from "react";

const InputForms = ({ config, updateConfig, updateSolve }) => {
  const [formConfig, setFormConfig] = useState(config);
  const handleConfigChange = e => {
    e.preventDefault();
    let newState = { ...config, [e.target.name]: e.target.value };
    setFormConfig(newState);
  };
  const handleConfigSubmit = e => {
    e.preventDefault();
    updateConfig(formConfig);
  };

  return (
    <div>
      <div>
        <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
          CONFIGURAÇÕES
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
            >
              <option value="newton-raphson">Newton-Raphson</option>
              <option value="desacoplado_rapido">Desacoplado Rápido</option>
            </select>
          </div>
          <div className="flex">
            <input
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
              onClick={() => updateSolve(true)}
              type="submit"
              value="Calcular"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InputForms;
