// This callback WILL NOT be called for "_execute_action"
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var current = tabs[0];
        var incognito = current.incognito;
        var url = current.url;
        var cs = chrome.contentSettings['javascript'];
        cs.get({ primaryUrl: url, incognito: incognito }, function(details) {
            var next
            if(command == "toggle-enable") {
                next = details.setting != 'allow' ? 'allow' : false;
            }
            else {
                next = details.setting != 'block' ? 'block' : false;
            }

            var scope = incognito ? 'incognito_session_only' : 'regular'
            if(next) {
                var origin = new URL(url).origin;
                if(origin == 'file://') origin = url;
                else origin += '/*';
                console.log('action', next)
                cs.set({
                    primaryPattern: origin,
                    setting: next,
                    scope: scope
                })
            }
            else {
                console.log('default')
                cs.clear({ scope: scope })
            }
        })
    })
    console.log(`Command "${command}" called`);
});
