export function getUserGroup(userSettings) {
    if (!userSettings.groups || !userSettings.username) return 0;
    //props.userSettings.groups.find(g => g.name === props.userSettings.username)?.id
    return userSettings.groups.find(g => g.name === userSettings.username)?.id ?? 0;
}
