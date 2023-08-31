import * as cmd from 'commander';
import axios from 'axios';
import fs from 'fs/promises';

const downloadPage = async (url, outputDir) => {
    try {
      const response = await axios.get(url);
      const htmlContent = response.data;
      const filename = 'index.html';
      const filePath = `${outputDir}/${filename}`;
  
      await fs.writeFile(filePath, htmlContent);

      console.log(`HTML loaded and saved as ${filename}`);
    } catch (error) {
      console.error('Error while load HTML:', error.message);
      process.exit(1);
    }
  };
  

const createProg = () => {
    cmd.program.command('page-loader')
        .version('1.0.0')
        .description('CLI app to download pages')
        .argument('<url>')
        .option('-o, --output [dir]', 'output dir (default: "src")')
        .action(async (url, options) => {
            const outputDir = options.output || './';
            await downloadPage(url, outputDir);
        })

    cmd.program.parse();
};
createProg();