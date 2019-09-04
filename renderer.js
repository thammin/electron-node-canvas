electron.ipcRenderer.on('ping', (event, message) => {
    const el = document.createElement('img');
    el.src = message;
    document.body.appendChild(el);
});
