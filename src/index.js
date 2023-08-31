import * as cmd from 'commander';

const createProg = () => {
    cmd.program.command('page-loader')
        .version('1.0.0')
        .description('CLI app to download pages')
        .argument('<url>')
        .option('-o, --output [dir]', 'output dir (default: "/src")')

    cmd.program.parse();
};
createProg();