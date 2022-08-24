import {
    gen, col, row, button, input, render, renderFullHtml, createState
} from './framework'



let buttons = (name)=>
    row(
        name,
        button(
            '-',
            {
                onClick:()=>{
                    state1.x.y--;
                },
            }
        ),
        button(
            '+',
            {
                onClick:()=>{
                    state1.x.y++;
                },
            }
        ),
    )

// stateless component
const rowCheckboxLabel = ({value,setValue,label})=>(
    row(
        input({
            type:'checkbox', 
            value:value,
            onChange:setValue
        }),
        label
    )
)

const reactiveModel = (object,key)=>({
    value:object[key],
    onChange:v=>object[key]=v
})

const demoContextConsumer = (props={}) => ({context})=>{
    console.log(context)
    return col(
        input({
            type:'text',
            value:state1.demoText,
            onChange:v=>state1.demoText=v.target.value
        }),
        'col',
        'props x:'+JSON.stringify(props.x),
        'context token:'+context.token
    )
}

let page = ()=>{
    let body = 'mainBoddy'
    let funcBody = 'funcBody: '+state1.x.y
    
    let description = 'em Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum'

    return col(
        {
            provide:{
                token:'dfs78dgfs78dgfas689dasfads'
            }
        },
        body,
        funcBody,
        buttons(JSON.stringify(state1)),
        'text length>'+state1.demoText?.length,
        row(
            {
                provide:{
                    inRowRightAfterTextLength:true
                }
            },
            input({
                type:'text',
                value:state1.demoText,
                onChange:v=>state1.demoText=v.target.value
            }),
            input({
                type:'text',
                value:state1.demoText,
                onChange:v=>state1.demoText=v.target.value
            }),
            demoContextConsumer({x:18}),
            input({
                type:'text',
                value:state1.demoText,
                onChange:v=>state1.demoText=v.target.value
            }),
        ),
        row(
            input({
                type:'checkbox', 
                value:state1.checks.a,
                onChange:v=>{state1.checks.a=v}
            }),
            'a'
        ),
        row(
            input({
                type:'checkbox', 
                value:state1.checks.b,
                onChange:v=>{state1.checks.b=v}
            }),
            'b',
        ),
        row(
            input({
                type:'checkbox', 
                value:state1.checks.b,
                onChange:v=>{state1.checks.b=v}
            }),
            'b',
        ),
        row(
            input({
                type:'checkbox', 
                value:state1.checks.a && state1.checks.b,
                onChange:v=>{state1.checks.a=state1.checks.a}
            }),
            'a && b'
        ),
        row(
            input({
                type:'checkbox',
                value:state1.checks.both,
                onChange:v=>{state1.checks.both=!state1.checks.both}
            }),
            'computed checkbox'
        ),
        button(
            'trim text to'+state1.x.y+' symbol(s)',
            {
                onClick:()=>{
                    state1.demoText = state1.demoText.substr(0,state1.x.y);
                },
            }
        ),
        // use with 
        row(
            input({
                type:'checkbox',
                value:state1.showText,
                onChange:v=>{state1.showText=!state1.showText}
            }),
            'show lorem'
        ),
        row(
            input({
                type:'checkbox',
                ...reactiveModel(state1,'showText')
            }),
            'show lorem'
        ),
        state1.showText&&description
    )
}

let state1 = createState(page,true)({
    x:{
        y:1
    },
    showText:false,
    checks:{
        a:true,
        b:false,
        get both(){
            return this.a && this.b
        },
        set both(v){
            this.a = v;
            this.b = v;
        }
    }
})
state1.x.y = 1
