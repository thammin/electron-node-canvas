const path = require('path');
const { execSync } = require('child_process');
const packager = require('electron-packager');

const ROOT = './node_modules/canvas/build/Release';
const BINARY = `${ROOT}/canvas.node`;
const BACKUP = `${ROOT}/canvas_backup.node`;

execSync(`cp -f ${BINARY} ${BACKUP}`);

const deps = execSync(`otool -L ${BINARY}`, {
    encoding: 'utf8'
})
    .split('\n\t')
    .slice(1)
    .map(line => line.match(/(.+\.dylib)/)[1]);

console.log(deps);

deps.forEach(d => {
    const name = path.basename(d);
    execSync(`cp -f ${d} ${ROOT}/${name}`);
    execSync(
        `install_name_tool -change ${d} @executable_path/../Resources/app/${ROOT}/${name} ${BINARY}`
    );
});

packager({
    dir: __dirname,
    overwrite: true
}).then(() => {
    execSync(`mv ${BACKUP} ${BINARY}`);
});
