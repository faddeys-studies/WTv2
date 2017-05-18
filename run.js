
if (process.argv.length != 4) {
    console.log('Syntax: node run.js <lab-number> <task-number>');
}

require(`./practice/${process.argv[2]}/task${process.argv[3]}`);
