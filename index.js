const fs = require("fs");
const path = require("path");

function createFolder(path) {
  if (fs.existsSync(path)) {
    return true;
  }
  const paths = path.split(/[\|\\|\/]/g);
  const upperFolder = paths.slice(0, -1).join("/");

  if (createFolder(upperFolder)) {
    fs.mkdirSync(path);
    return true;
  }
}

function BuildAfterFileCopy(options = {}) {
  this.name = "BuildAfterFileCopy";
  this.options = options;
  if (!this.options.to || !this.options.filename) {
    throw new Error("目标文件夹或目标文件不能为空");
  }
  if (!Array.isArray(this.options.filename)) {
    this.options.filename = [this.options.filename];
  }
  if (!path.isAbsolute(this.options.to)) {
    this.options.to = path.join(__dirname, this.options.to);
  }
  if (!fs.existsSync(this.options.to)) {
    createFolder(this.options.to);
  }
}

BuildAfterFileCopy.prototype.apply = function (compiler) {
  const toDir = this.options.to;
  const isMap = this.options.isMap;

  const _handle = (outputPath, cb) => {
    const fromDir = this.options.from || outputPath;
    this.options.filename.forEach((file) => {
      this.copyFile(toDir, fromDir, file);
      if (isMap && fs.existsSync(path.join(fromDir, file + ".map"))) {
        this.copyFile(toDir, fromDir, file + ".map");
      }
    });

    cb && cb();
  };

  if (compiler.hooks && compiler.hooks.afterEmit) {
    compiler.hooks.afterEmit.tapAsync(this.name, (compilation, cb) => {
      const outputPath = compilation.outputOptions.path;
      _handle(outputPath, cb);
    });
  } else {
    compiler.plugin("after-emit", (compilation, cb) => {
      const outputPath = compilation.outputOptions.path;
      _handle(outputPath, cb);
    });
  }
};

BuildAfterFileCopy.prototype.copyFile = function (to, from, filename) {
  fs.copyFile(
    path.join(from, filename),
    path.join(to, filename),
    function callback(err) {
      if (err) throw err;
    }
  );
};

module.exports = BuildAfterFileCopy;
