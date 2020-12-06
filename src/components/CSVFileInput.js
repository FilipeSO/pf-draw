import React, { useState } from "react";
import { parseCSVFile } from "../utils";

const CSVFileInput = ({ updateBars, updateEquips, updateTitle }) => {
  const [fileCSVEquips, setFileCSVEquips] = useState(null);
  const handleCSVChange = (e) => {
    if (e.target.files !== undefined) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        var lines = reader.result
          .split(/[\r\n]+/g)
          .filter((line) => line.split(";")[0] !== "");
        let [title, parsedBars, parsedEquips] = parseCSVFile(lines);
        setFileCSVEquips({
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

  const handleCSVSubmit = (e) => {
    e.preventDefault();
    updateBars([]);
    updateEquips([]);
    let bar_placement = e.target[1].value;
    var reader = new FileReader();
    reader.onloadend = function () {
      var lines = reader.result
        .split(/[\r\n]+/g)
        .filter((line) => line.split(";")[0] !== "");
      let [title, parsedBars, parsedEquips] = parseCSVFile(
        lines,
        bar_placement
      );
      updateBars(parsedBars);
      updateEquips(parsedEquips);
      updateTitle(title);

      setFileCSVEquips(null);
    };
    reader.readAsText(fileCSVEquips.file);
    e.target.reset();
    //

    // console.log(fileEquips);
  };
  return (
    <div>
      <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
        CSV INPUT
      </h2>
      <form onSubmit={handleCSVSubmit}>
        <div className="md:flex md:items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">File:</label>
          <input
            className="w-full md:flex-1 cursor-pointer shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
            type="file"
            onChange={handleCSVChange}
          ></input>
          <a
            className="text-center ml-2 block text-blue-700 text-sm font-bold"
            target="_blank"
            rel="noreferrer noopener"
            href="/input.csv"
          >
            default
          </a>
        </div>
        {fileCSVEquips && (
          <div>
            <div className="flex items-center mt-2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                Bar placement:
              </label>
              <select
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                name="bar_placement"
              >
                <option value="circle">Circle</option>
                <option value="random">Random</option>
              </select>
            </div>
            <div className="flex">
              <input
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
                type="submit"
                value={
                  fileCSVEquips &&
                  "Add Title:" +
                    fileCSVEquips.title +
                    ", Bars:" +
                    Object.keys(fileCSVEquips.bars).length +
                    ", Branches:" +
                    Object.keys(fileCSVEquips.equips).length +
                    " (LT:" +
                    Object.values(fileCSVEquips.equips).filter(
                      (equip) => equip.type === "LT"
                    ).length +
                    " TR:" +
                    Object.values(fileCSVEquips.equips).filter(
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

export default CSVFileInput;
