import fs from "fs/promises";
import path from "path";


const readFile = (localPath) => {
  return fs.readFile(path.join(process.cwd(), localPath), "utf8");
}


const writeFile = (localPath, content) => {
  return fs.writeFile(path.join(process.cwd(), localPath), content, {
    encoding: "utf8",
  });
};


export {
  readFile,
  writeFile
}
