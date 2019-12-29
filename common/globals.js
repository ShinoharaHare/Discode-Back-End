module.exports = {
    publicChannelMembers: new Proxy({}, {
        get(target, name) {
            target[name] = target[name] || new Set();
            return target[name];
        }
    })
}