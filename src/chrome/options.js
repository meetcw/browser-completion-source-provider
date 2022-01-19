let serverPort = document.getElementById('serverPort')
let matchRule = document.getElementById('matchRule')

serverPort.oninput = (ev) => {
    chrome.storage.sync.set({
        serverPort: serverPort.value == '' ? '18998' : serverPort.value
    }, () => {
        console.log('server port updated');
    });

}

matchRule.oninput = () => {
    chrome.storage.sync.set({
        matchRule: matchRule.value == '' ? '[0-9a-zA-Z_-]{3,99}' : matchRule.value
    }, () => {
        console.log('match rule updated');
    });
}

chrome.storage.sync.get('serverPort', (value) => {
    if (value.serverPort) {
        serverPort.value = value.serverPort;
    } else {
        serverPort.value = '18998';
    }

});
chrome.storage.sync.get('matchRule', (value) => {
    if (value.matchRule) {
        matchRule.value = value.matchRule;
    } else {
        matchRule.value = '[0-9a-zA-Z_-]{3,99}';
    }
});


