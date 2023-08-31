import * as cmd from 'commander';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import cheerio from 'cheerio';
import Listr from 'listr';

const downloadResource = async (resourceUrl, outputDir) => {
    try {
        const response = await axios.get(resourceUrl, { responseType: 'arraybuffer' });
        const resourceContent = response.data;
        const resourceFilename = path.basename(new URL(resourceUrl).pathname);
        const resourcePath = path.join(outputDir, resourceFilename);

        await fs.writeFile(resourcePath, resourceContent);

        return resourcePath;
    } catch (error) {
        throw new Error(`Error while downloading resource: ${resourceUrl}`);
    }
};

const downloadPage = async (url, outputDir) => {
    try {
        const response = await axios.get(url);
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        // Находим все ресурсы (картинки, стили, js) на странице
        const resourceUrls = [];

        $('img, link[rel="stylesheet"], script').each((index, element) => {
            const resourceUrl = $(element).attr('src') || $(element).attr('href');
            if (resourceUrl) {
                resourceUrls.push(resourceUrl);
            }
        });

        // Создаем задачи для скачивания ресурсов
        const tasks = resourceUrls.map((resourceUrl) => ({
            title: `Downloading ${resourceUrl}`,
            task: () => downloadResource(resourceUrl, outputDir),
        }));

        const list = new Listr(tasks, { concurrent: true });
        await list.run();

        const filename = 'index.html';
        const filePath = path.join(outputDir, filename);

        await fs.writeFile(filePath, htmlContent);

        console.log(`HTML loaded and saved as ${filename}`);
    } catch (error) {
        console.error('Error while loading HTML:', error.message);
        process.exit(1);
    }
};

const createProg = () => {
    cmd.program
        .command('page-loader')
        .version('1.0.0')
        .description('CLI app to download pages')
        .argument('<url>')
        .option('-o, --output [dir]', 'output dir (default: "../downloads")')
        .action(async (url, options) => {
            const outputDir = options.output || '../downloads';
            await downloadPage(url, outputDir);
        });

    cmd.program.parse();
};

createProg();
