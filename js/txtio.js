const txtn = document.getElementById('codein');
const btn1 = document.getElementById('runbutton');
const txtot = document.getElementById('textout');
const tknot = document.getElementById('tokenoutput');
const ltxt = document.getElementById('lefttext');
const lmtxt = document.getElementById('midltext');
const rtxt = document.getElementById('righttext');
const btn2 = document.getElementById('nxtstp');
//const tstxt =document.getElementById('testtext');

const map = 
[
    [[1,5], [0,0], [0,0], [1,4], [0,0], [0,0], [3,1], [3,2], [3,3]],
    [[0,0], [1,6], [0,0], [0,0], [0,0], [4,0], [0,0], [0,0], [0,0]],
    [[0,0], [2,2], [1,7], [0,0], [2,2], [2,2], [0,0], [0,0], [0,0]],
    [[0,0], [2,4], [2,4], [0,0], [2,4], [2,4], [0,0], [0,0], [0,0]],
    [[1,5], [0,0], [0,0], [1,4], [0,0], [0,0], [3,8], [3,2], [3,3]],
    [[0,0], [2,6], [2,6], [0,0], [2,6], [2,6], [0,0], [0,0], [0,0]],
    [[1,5], [0,0], [0,0], [1,4], [0,0], [0,0], [0,0], [3,9], [3,3]],
    [[1,5], [0,0], [0,0], [1,4], [0,0], [0,0], [0,0], [0,0], [3,10]],
    [[0,0], [1,6], [0,0], [0,0], [1,11], [0,0], [0,0], [0,0], [0,0]],
    [[0,0], [2,1], [1,7], [0,0], [2,1], [2,1], [0,0], [0,0], [0,0]],
    [[0,0], [2,3], [2,3], [0,0], [2,3], [2,3], [0,0], [0,0], [0,0]],
    [[0,0], [2,5], [2,5], [0,0], [2,5], [2,5], [0,0], [0,0], [0,0]],
]

const lang = 
[
    ["null", "null"],
    ["EplusT", "E"],
    ["T","E"],
    ["TmultF","T"],
    ["F","T"],
    ["lparErpar","F"],
    ["id", "F"]
]







let textinput = 'null';
let tokens = [];
let tokensStringed = '';

var itorator = 0;
var stritorator = 0;
var character;
var preempt = false;

let stack = '0';
let input = '';
let action = 'Shift5';
//command is a way of keeping up with actions.
//Shift corisponds with 0, Reduce corisponds with 1,
//and accept corisponds with 2.
//so Shift3 (or S3) would translate to a [0, 3] command



function listinputtext(){
    textinput = txtn.value;
    txtot.innerHTML = textinput;;

    //create the tokens
    tokenrun()


    //lists out the tokens;
    StringTokenLister()
    tknot.innerHTML = tokensStringed;



    
    
    
    ltxt.innerHTML = "Stack:<br>" + stack+"<br>";
    lmtxt.innerHTML = "Input:<br>";
    rtxt.innerHTML = "Action:<br>";
    itorator = 0;
    document.getElementById('runbutton').disabled = true;
}

btn1.addEventListener('click', listinputtext);




function tokenrun(){
    itorator = 0;
    character = textinput.charAt(itorator);
    preempt = false;



    while(itorator < textinput.length)
    {
        preempt= false;
        switch (character)
        {
            case '*':
                tokens.push('mult');
                break;
            case '+':
                tokens.push('plus');
                break;
            case '(':
                tokens.push('lpar');
                break;
            case ')':
                tokens.push('rpar');
                break;
            case '$':
                tokens.push('$');
                break;
            default:
                tokens.push('id');
                while((!preempt) && itorator < textinput.length)
                {
                    itorator++;
                    character = textinput.charAt(itorator);

                    switch(character)
                    {
                        case '*':
                        case '+':
                        case '(':
                        case ')':
                        case '$':
                            preempt = true;
                            break;
                    }
                }
                break;
        }

        if(!preempt)
        {
            itorator++;
            if(itorator < textinput.length)
                character = textinput.charAt(itorator);
        }
    }


    
}
function StringTokenLister(){
    tokensStringed = '';
    stritorator = 0;
    while(stritorator < tokens.length)
    {
        tokensStringed = tokensStringed + '\n' + (tokens[stritorator]+'');
        stritorator++;
    }
}

function parstep()
{
    StringTokenLister();
    input = tokensStringed;
    lmtxt.innerHTML+=input+"<br>";

    var firstTok = tokens[0];
    var col = -1;
    var row = getStackNum();
    //tstxt.innerHTML+="row: "+row+"<br>";



    switch(firstTok)
    {
        case 'id':
            col = 0;
            break;
        case 'plus':
            col = 1;
            break;
        case 'mult':
            col = 2;
            break;
        case 'lpar':
            col = 3;
            break;
        case 'rpar':
            col = 4;
            break;
        case '$':
            col = 5;
            break;
    }

    

    var command = map[row][col][0];
    var key = map[row][col][1];

    //tstxt.innerHTML+="command: "+command+"<br>";
    //tstxt.innerHTML+="key: "+key+"<br>";

    switch(command)
    {
        case 0:
            perror();
            break;
        case 1:
            shift(key);
            break;
        case 2:
            reduce(key);
            break;
        case 3:
            perror();
            break;
        case 4:
            acceptParse();
            break;
    }
}
btn2.addEventListener('click', parstep)

function getStackNum()
{
    //tstxt.innerHTML+="getStknumfun<br>";
    var end = stack.length-1;
    //tstxt.innerHTML+="end: "+end+"<br>";
    var c = stack.charAt(end);
    var num = '';
    //tstxt.innerHTML+="c: "+c+"<br>";
    var unfinished = true;
    while(unfinished && end >= 0)
    {
        switch(c)
        {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                unfinished = true;
                num = c + num;
                break;
            default:
                unfinished = false;
                break;
        }

        end--;
        if(end>=0)
            c = stack.charAt(end);
    }
    return parseInt(num);
}

function perror()
{ 
    ltxt.innerHTML += 'ERROR! PARSE FAILED!'
    rtxt.innerHTML += 'ERROR! PARSE FAILED!'
    lmtxt.innerHTML += 'ERROR! PARSE FAILED!'
}

function shift(pow)
{
    stack = stack + tokens[0]+pow;
    tokens.shift();
    StringTokenLister();

    

    
    ltxt.innerHTML+=stack+"<br>";

    rtxt.innerHTML += "Shift "+pow+"<br>";
}

function reduce(pow)
{
    //tstxt.innerHTML+="pow: "+pow+"<br>";
    

    var git = lang[pow][0].length;
    var p = lang[pow][1];

    var end = stack.length-1;
    var c = stack.charAt(end);
    var cycle;

    for(i=0; i < git; i++)
    {
        cycle = true;
        while(cycle)
        {
            switch(c)
            {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    cycle = true;
                    break;
                default:
                    cycle = false;
                    break;
            }
            //tstxt.innerHTML+="InitialStack: "+stack+"<br>";
            stack = stack.substring(0,end);
            //tstxt.innerHTML+="PostStack: "+stack+"<br>";
            end--;
            c = stack.charAt(end);
        }
        //tstxt.innerHTML+="loop!<br>";
    }

    var ref = getStackNum();
    //tstxt.innerHTML+="ref: "+ref+"<br>";
    stack = stack + p;
    switch(p)
    {
        case 'E':
            stack = stack + map[ref][6][1];
            break;
        case 'T':
            stack = stack + map[ref][7][1];
            break;
        case 'F':
            stack = stack + map[ref][8][1];
    }

    ltxt.innerHTML+=stack+"<br>";
    rtxt.innerHTML+="Reduce "+pow+" ["+(ref+"")+", "+p+"]<br>";

}

function acceptParse()
{
    //ltxt.innerHTML+="PARSE SUCCESSFULL!";
    //lmtxt.innerHTML+="PARSE SUCCESSFULL!";
    rtxt.innerHTML+="accept";
    document.getElementById('nxtstp').disabled = true;
}