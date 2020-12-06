import React, { useState } from "react";
import { parseTextFile } from "../utils";

const TextFileInput = ({ updateBars, updateEquips, updateTitle }) => {
  const [fileEquips, setFileEquips] = useState(null);
  const handleFileChange = (e) => {
    if (e.target.files !== undefined) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        var lines = reader.result
          .split(/[\r\n]+/g)
          .filter((line) => line !== "");
        let [title, parsedBars, parsedEquips] = parseTextFile(lines);
        setFileEquips({
          file: file,
          title: title,
          bars: parsedBars,
          equips: parsedEquips,
        });
      };
      reader.readAsText(file);
    }
    // console.log(file);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    updateBars([]);
    updateEquips([]);
    let bar_placement = e.target[1].value;
    var reader = new FileReader();
    reader.onloadend = function () {
      var lines = reader.result.split(/[\r\n]+/g).filter((line) => line !== "");
      let [title, parsedBars, parsedEquips] = parseTextFile(
        lines,
        bar_placement
      );

      updateBars(parsedBars);
      updateEquips(parsedEquips);
      updateTitle(title);
      setFileEquips(null);
    };
    reader.readAsText(fileEquips.file);
    e.target.reset();
    // console.log(fileEquips);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
        ENTRADA FORMATO IT743A 2S2020
      </h2>
      <form onSubmit={handleFileSubmit}>
        <div className="md:flex md:items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">File:</label>
          <input
            className="w-full md:flex-1 cursor-pointer shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
            type="file"
            onChange={handleFileChange}
          ></input>
          <a
            className="text-center ml-2 block text-blue-700 text-sm font-bold"
            target="_blank"
            rel="noreferrer noopener"
            href="/ieee30buses.txt"
          >
            default
          </a>
        </div>
        {fileEquips && (
          <div>
            <div className="flex items-center mt-2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                Bar placement:
              </label>
              <select
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                name="bar_placement"
              >
                <option value="circle">Circular</option>
                <option value="random">Aleatório</option>
              </select>
            </div>
            <div className="flex">
              <input
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
                type="submit"
                value={
                  fileEquips &&
                  "Add Title:" +
                    fileEquips.title +
                    ", Bars:" +
                    Object.keys(fileEquips.bars).length +
                    ", Branches:" +
                    Object.keys(fileEquips.equips).length +
                    " (LT:" +
                    Object.values(fileEquips.equips).filter(
                      (equip) => equip.type === "LT"
                    ).length +
                    " TR:" +
                    Object.values(fileEquips.equips).filter(
                      (equip) => equip.type === "TR"
                    ).length +
                    ")"
                }
              ></input>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TextFileInput;
