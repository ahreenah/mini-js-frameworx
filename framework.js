export let gen = (name,data)=>(...children)=>({
    name,data,
    _isTreeObject:true,
    children:children.filter(i=>i._isTreeObject || typeof(i)=='string' || typeof(i)=='function'),
    params:children.filter(i=>!i._isTreeObject && typeof(i)!='string' && typeof(i)!='function')[0]
})
export let col = gen('col',{tag:'div',style:{display:'flex',flexDirection:'column'}})
export let row = gen('row',{tag:'div',style:{display:'flex',flexDirection:'row'}})
export let button = gen('button',{tag:'button'})
export let input = gen('input',{tag:'input'})



function styleToText(v){
    let res = ''
    
    const kebabize = str => {
        return str.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
            ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
            : letter;
        }).join('');
    }
    
    for(let i in v){
        res+=kebabize(i)+':'+v[i]+';'
    }
    return res
}

export function render(tree){
    let provide={}
    if(typeof (tree)=='string'){
        let res  = document.createElement('span')
        res.innerText = tree
        return res
    }
    if(tree?.params?.provide)
        provide = tree?.params?.provide
    console.log(tree.name,'context:',provide)
    if(typeof(tree)=='function')return render(tree({context:provide}))
    let res = document.createElement(tree.data.tag)
    if(tree?.params?.onClick)
        res.addEventListener('click',tree.params.onClick)
    if(tree?.params?.onChange)
        res.addEventListener('change',v=>{
            console.log(v.target.checked)
            tree.params.onChange(v.target.checked)
        })
    if(tree?.params?.ref)
        tree.params.ref.domNode = res
    if(tree?.params?.value)
        res.setAttribute('value',tree?.params?.value)
    res.setAttribute('style',styleToText({...tree.data.style,...tree?.params?.style}))
    if(tree?.params?.type){
        res.setAttribute('type',tree?.params.type)
        if(tree.params.type=='checkbox')
            tree.params.checked = tree.params.value
    }
    if(tree?.params?.checked)
        res.setAttribute('checked',tree?.params.checked)
    for(let i of tree.children){
        if(provide)
            if(!i.params){
                i.params={}
            }
            if(i.params){
                i.params.provide = {...i.params.provide,...provide}
                // console.warn('passed provide to '+i.name+':-))',provide,i.params.provide)
                // console.log(i)
            }
        res.appendChild(render(i))
    }
    return res
}

export function renderFullHtml(page){
    let res = render(page())
    document.body.innerHTML=''
    document.body.appendChild(res)
}

export function createState(page,fullScreenRender){
    const proxyHandler = {
        get(target, key) {
            if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], proxyHandler);
            }
            return target[key];
        },
        set(target, prop, value) {
            console.log(`changed ${prop} from ${target[prop]} to ${value}`);
            target[prop] = value;
            if(fullScreenRender)
            renderFullHtml(page)
        },
    };

    return (v)=>new Proxy(v,proxyHandler)
}


export default {
    gen, col, row, button, input, render
}