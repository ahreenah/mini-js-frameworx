let gen = (name, data)=>(...children)=>({
            name,
            data,
            _isTreeObject: true,
            children: children.filter((i)=>i._isTreeObject || typeof i == "string" || typeof i == "function"),
            params: children.filter((i)=>!i._isTreeObject && typeof i != "string" && typeof i != "function")[0]
        });
let col = gen("col", {
    tag: "div",
    style: {
        display: "flex",
        flexDirection: "column"
    }
});
let row = gen("row", {
    tag: "div",
    style: {
        display: "flex",
        flexDirection: "row"
    }
});
let button = gen("button", {
    tag: "button"
});
let input = gen("input", {
    tag: "input"
});
let refreshButtonRef = {};
function styleToText(v) {
    let res = "";
    const kebabize = (str)=>{
        return str.split("").map((letter, idx)=>{
            return letter.toUpperCase() === letter ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}` : letter;
        }).join("");
    };
    for(let i in v)res += kebabize(i) + ":" + v[i] + ";";
    return res;
}
function render(tree) {
    if (typeof tree == "string") {
        let res = document.createElement("span");
        res.innerText = tree;
        return res;
    }
    if (typeof tree == "function") return render(tree());
    let res1 = document.createElement(tree.data.tag);
    if (tree?.params?.onClick) res1.addEventListener("click", tree.params.onClick);
    if (tree?.params?.onChange) res1.addEventListener("change", tree.params.onChange);
    if (tree?.params?.ref) tree.params.ref.domNode = res1;
    if (tree?.params?.value) res1.setAttribute("value", tree?.params?.value);
    res1.setAttribute("style", styleToText({
        ...tree.data.style,
        ...tree?.params?.style
    }));
    for (let i of tree.children)res1.appendChild(render(i));
    return res1;
}
let page = ()=>{
    let body = "mainBody";
    let funcBody = "funcBody: " + state1.x.y;
    let buttons = row(button("-", {
        onClick: ()=>{
            state1.x.y--;
        }
    }), button("+", {
        onClick: ()=>{
            state1.x.y++;
        }
    }));
    return col(body, funcBody, buttons, "text length>" + state1.demoText?.length, input({
        type: "text",
        value: state1.demoText,
        onChange: (v)=>state1.demoText = v.target.value
    }), button("trim text to" + state1.x.y + " symbols", {
        onClick: ()=>{
            state1.demoText = state1.demoText.substr(0, state1.x.y);
        }
    }));
};
const proxyHandler = {
    get (target, key) {
        if (typeof target[key] === "object" && target[key] !== null) return new Proxy(target[key], proxyHandler);
        return target[key];
    },
    set (target, prop, value) {
        console.log(`changed ${prop} from ${target[prop]} to ${value}`);
        target[prop] = value;
        let res = render(page());
        document.body.innerHTML = "";
        document.body.appendChild(res);
    }
};
let createState = (v)=>new Proxy(v, proxyHandler);
let state1 = createState({
    x: {
        y: 1
    }
});
state1.x.y = 1;
let res = render(page());
console.log(document);
document.body.innerHTML = "";
document.body.appendChild(res);

//# sourceMappingURL=index.b925dda0.js.map
