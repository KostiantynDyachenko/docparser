export function getDateTime(_date) {
    const date = new Date(_date);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US')}`;
}