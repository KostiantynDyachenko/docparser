const phraseLookup = {
    date: "#3cb44b",
    dictionary: "#4363d8",
    glossary: "#4363d8",
    name: "#482880",
    place: "#f58231",
    formula: "#9C004E",
    flowchart: "#fabed4",
    organization: "#00695f",
    condition: "#e60000",
    "logical condition":  "#e60000",
}

const getPhraseColor = (word) => {
    let color = phraseLookup[word];
    return color;
}

export { getPhraseColor };
