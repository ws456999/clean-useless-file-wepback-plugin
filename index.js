const fs = require('fs');
const glob = require('glob');
const path = require('path');
const shelljs = require('shelljs');

class CleanUnusedFilesPlugin {
  constructor(options) {
    this.opts = options;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap('useless', (compilation) => {
      this.findUnusedFiles(compilation, this.opts);
    });
  }

  dealExclude(rule, unusedList) {
    const isReg = rule instanceof RegExp;
    const isString = typeof rule === 'string';

    const result = unusedList.filter((unused) => {
      if (isReg) {
        return !rule.test(unused);
      }
      if (isString) {
        return unused.indexOf(rule) === -1;
      }
    });
    return result;
  }
  /**
   * 获取依赖的文件
   */
  getDependFiles(compilation) {
    return new Promise((resolve, reject) => {
      const dependedFiles = [...compilation.fileDependencies].reduce(
        (acc, usedFilepath) => {
          if (!~usedFilepath.indexOf('node_modules')) {
            acc.push(usedFilepath);
          }
          return acc;
        },
        []
      );
      resolve(dependedFiles);
    });
  }

  /**
   * 获取项目目录所有的文件
   */
  getAllFiles(pattern) {
    return new Promise((resolve, reject) => {
      glob(
        pattern,
        {
          nodir: true,
        },
        (err, files) => {
          if (err) {
            throw err;
          }
          const out = files.map((item) => path.resolve(item));
          resolve(out);
        }
      );
    });
  }

  async findUnusedFiles(compilation, config = {}) {
    const {
      root = './src',
      clean = false,
      output = './unused-files.json',
      exclude = [],
    } = config;
    const pattern = root + '/**/*';
    try {
      const allChunks = await this.getDependFiles(compilation);
      const allFiles = await this.getAllFiles(pattern);
      let unUsed = allFiles.filter((item) => !~allChunks.indexOf(item));
      if (exclude) {
        exclude.forEach((e) => {
          unUsed = this.dealExclude(e, unUsed);
        });
      }
      if (typeof output === 'string') {
        fs.writeFileSync(output, JSON.stringify(unUsed, null, 4));
      } else if (typeof output === 'function') {
        output(unUsed);
      }
      if (clean) {
        unUsed.forEach((file) => {
          shelljs.rm(file);
          console.log(`remove file: ${file}`);
        });
      }
      return unUsed;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CleanUnusedFilesPlugin;
