const { ipcRenderer } = require('electron');

// Example function to send a message to the main process
function sendMessageToMain(message) {
  ipcRenderer.send('message-from-renderer', message);
}

// Example function to receive a message from the main process
ipcRenderer.on('message-from-main', (event, message) => {
  console.log('Message from main process:', message);
});

// Export functions to be used in other parts of the renderer process
module.exports = {
  sendMessageToMain,
};
