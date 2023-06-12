export function createCase(data) {
    let _case = {
        ...data,
        created: randomDate(),
        modified: "",
        cases: [],
        documents: [],
        type: "folder",
        documenttype: 4
    }
    return _case;
}

export function createDocument(data) {
    let _document = {
        ...data,
        created: randomDate(),
        modified: "",
        type: "document"
    }
    return _document;
}

function randomDate(date1 = '01-01-2021', date2 = new Date().toLocaleDateString()){
    function randomValueBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1));
    } else{
        return new Date(randomValueBetween(date1, date2));
    }
}

export function fakeCaseData() {
    const cases = [];
    for (let i = 0; i < 20; i++) {
        cases.push(createCase({
            id: i,
            name: `example case ${i}`,
            company: "None"
        }));
    }
    return cases;
}

// searches an array recursively for a matching id
export function findById(data, id) {
    if (typeof id === "string") id = +id;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            return data[i];
        } else if (data[i].cases && data[i].cases.length && typeof data[i].cases === "object") {
            let _data = findById(data[i].cases, id);
            if (_data) return _data;
        }
    }
}

export function findByName(data, name) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].name === name) {
            return data[i];
        } else if (data[i].cases && data[i].cases.length && typeof data[i].cases === "object") {
            let _data = findByName(data[i].cases, name);
            if (_data) return _data;
        }
    }
}

const dataSetup = [{"name":"Case 1","company":"None","id":0,"created":"2021-03-03T04:34:54.328Z","modified":"","cases":[{"name":"case 1","company":"None","id":1,"created":"2021-01-23T22:41:16.762Z","modified":"","cases":[{"name":"813 pages 500 thousand words.odt","id":2,"created":"2021-01-20T04:36:44.173Z","modified":"","type":"document","selected":true}],"documents":[],"type":"folder","selected":true}],"documents":[],"type":"folder","selected":false}];
export const editorData = {
    time: 1556098174501,
    blocks: [
        {
            type: "header",
            data: {
                text: "Document Viewer",
                level: 2
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "In this document viewer the user can view the page as well as click on specific blocks to edit or interact with them"
            }
        },
        {
            type: "header",
            data: {
                text: "Key features",
                level: 3
            }
        },
        {
            type: "list",
            data: {
                style: "unordered",
                items: [
                    "block style setup for easy management",
                    "load and save data as json",
                    "design is customizable"
                ]
            }
        },
        {
            type: "header",
            data: {
                text: "Styling and markups",
                level: 3
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus rutrum, neque in sollicitudin rutrum, leo massa bibendum lorem, sed auctor sem mauris a metus. Suspendisse bibendum, leo quis suscipit placerat, lectus arcu sodales arcu, nec congue ligula purus ut enim. Suspendisse potenti. Morbi ac congue odio, eget aliquet ligula. Etiam tempus viverra sem at malesuada. Mauris arcu felis, lacinia eu mattis et, volutpat fermentum nibh. Nulla scelerisque justo diam, ac consectetur felis sagittis et.<mark class="cdx-marker"> Donec faucibus nisi arcu, in efficitur nunc dapibus sed. Praesent eu metus vitae nisl convallis accumsan. Vestibulum in maximus nulla. Curabitur tortor risus, luctus et nisl ut, posuere cursus urna.</mark> Integer posuere, nisl non commodo rutrum, magna sapien tempus purus, tempus euismod est purus sed turpis. Pellentesque vestibulum ipsum vitae ex accumsan placerat.`
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    `Etiam semper, metus vitae ullamcorper pulvinar, erat dolor elementum lectus, a faucibus quam arcu eget sem. Vestibulum varius luctus placerat. In quis velit nec erat efficitur tempor. Cras ultricies pretium purus, at aliquam ante bibendum eget. Maecenas ac nunc odio. Cras non nisi in erat aliquam laoreet. Donec in turpis in magna iaculis laoreet a eget augue. Phasellus mollis convallis ante, ut tincidunt enim ullamcorper venenatis. Quisque vel tristique lectus. Curabitur aliquam, eros sed laoreet pellentesque, ipsum nisl placerat ipsum, vitae accumsan elit risus et lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis velit quis risus pellentesque, laoreet ultricies urna mollis. Praesent cursus cursus urna placerat lobortis.`
            }
        },
        {
            type: "delimiter",
            data: {}
        },
        {
            type: "header",
            data: {
                text: "Header management",
                level: 6
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    `Ut accumsan nibh in eros blandit, vel facilisis metus convallis. Pellentesque sed aliquam erat, ac semper mauris. In at vestibulum lectus, hendrerit volutpat turpis. Vestibulum sem leo, luctus in justo in, interdum mollis lacus. Etiam suscipit, odio ut consectetur tincidunt, velit purus pretium urna, sed efficitur neque urna id ipsum. Cras vestibulum erat sit amet eleifend luctus. Morbi eu sem vitae metus dictum semper. Donec tempor, tellus tempor interdum accumsan, nibh nunc facilisis ante, ut vestibulum nulla odio at metus. Proin sit amet purus faucibus, lobortis nibh non, luctus ante. Phasellus in viverra est. Sed maximus metus eget massa rhoncus, non placerat orci interdum. Nulla vel urna quis nisi placerat dapibus nec vel sem. In hac habitasse platea dictumst. Vivamus id dolor ut diam interdum consectetur sit amet vitae sem. Suspendisse vulputate efficitur ornare. Nunc lorem orci, sagittis egestas nulla eget, feugiat rutrum erat.`
            }
        },
        {
            type: "delimiter",
            data: {}
        }
    ],
    version: "2.12.4"
}


export const fakeDataSetup = {
    data: [...dataSetup], //[...fakeCaseData()]
    updateData: function(data) {
        this.data = data;
    },
    id: -1
}
