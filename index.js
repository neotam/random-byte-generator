
const random = require('lodash.random'); 
globalThis.random = random; 

const BCOUNT_LIMIT = Math.pow(2, 24);

$( e => {
  $('#genbytes').on('click', e => genRandBytes());
  registerEvents(); 
  window.byteInterpreter = new ByteInterpreter(); 
  globalThis.delimiter = ""; 
})

// TODO: Perfomrance Optimize and asynchronous 
function genRandBytes(){
  console.log("Generating Bytes");
  let bcount = $('#bytecount').val(); 
  if (bcount > BCOUNT_LIMIT) 
    return; 
  var bytes = '';
  var bitsc = bcount * 8; 
  for(let i=0; i < bitsc; i++){
    bytes += random(); 
  }
  doProcess(bytes); 
}

function registerEvents(){
  $('#clear').on('click', e=> {
    $('#bytesout').val('');
  })
  $('#select').on('click', e=>$('#bytesout').select()); 
  $('input[name="nsystem"]').on('click', onNsystemClick);
}


// Change display encoding/charset on radio button change
function onNsystemClick(e){
  console.log(e.target.value); 
  let pSelected = getPreviousRadio(); 
  let selected = e.target.value; 
  byteInterpreter.interpret(pSelected, selected)

}


class ByteInterpreter {
  constructor() {

  }

  interpret(ifrom, ito){
    if (!ifrom || !ito) {
      console.log(`Invalid from or to {ifrom} -> {ito}`);
      return; 
    }
      console.log(`interpreting from ${ifrom} to ${ito}`)
      let b = ito && (ito in this) && this[ito](ifrom);
      // b && $("#bytesout").val(b); 
      
  }

  getCurrentBytes(){
    return $("#bytesout").val(); 
  }  

  binary(){

  }

  octal(ifrom){
    console.log("To octal "); 
    let bytes = this.getCurrentBytes(); 

  }

  hexadecimal(ifrom){
    console.log("To Hex"); 
    let bytes = this.getCurrentBytes();
    updateBytesOut(toHexaDecimal, ToBin.hexToBin(bytes)); 


  }

  decimal(){

  }

  ascii(){
    
  }



}


function doProcess(bytes){
  bytes = bytes || $('#bytesout').val()
  let nsystem = $('input[name="nsystem"]:checked').val().toLowerCase(); 
  let data = '';
  switch (nsystem) {
    case 'binary': 
      data = bytes; 
      // $('#bytesout').val(bytes); 
      updateBytesOut(toBinary, bytes);
      break; 
    case 'octal':
      updateBytesOut(toOctal, bytes)
      break; 
    case 'hexadecimal':
      updateBytesOut(toHexaDecimal, bytes)
      break; 
    case 'decimal': 
      updateBytesOut(toDecimal, bytes)
      break; 
    case 'ascii': 
      updateBytesOut(toASCII, bytes)
      break; 
    default: 
      console.warn('Invalid Option')
  }
}

function updateBytesOut(func, bytes){
  let dataiter = func(bytes); 
  let data = Array.from(dataiter).join(delimiter);
  $("#nsystemradios").data("selected", func.name.replace("to", "").toLowerCase()); 
  $('#bytesout').val(data); 
}

function* toBinary(bytes){
  let data = groupbyCount(bytes, 8)
  for(let i of data){
    yield i; 
  }
}

function* toOctal(bytes){
  let data = groupbyCount(bytes, 3)
  for(let i of data){
    yield parseInt(i, 2).toString(8); 
  }
}


function* toHexaDecimal(bytes){
  let data = groupbyCount(bytes, 4)
  for(let i of data){
    yield parseInt(i, 2).toString(16).toUpperCase(); 
  }
}


function* toDecimal(bytes, nbits=8){
  let data = groupbyCount(bytes, nbits)
  for(let i of data){
    yield parseInt(i, 2); 
  }
}


function* toASCII(bytes){
  let data = groupbyCount(bytes, 8);
  for(let i of data){
    yield String.fromCharCode(parseInt(i, 2));
  }
}

class ToBin {
  // static _tobin = undefined; 

  constructor() {
    if(!_tobin){
      _tobin = this; 
    }
    return _tobin; 
  }

  static *hexToBin(bytes) {
    let grpby4bits = []; 
    for(let i of bytes) {
      if (!i.trim())
        continue
      grpby4bits.push(i)
      if (grpby4bits.length == 4) {
        grpby4bits.unshift('0', 'o');
        let bits = eval(grpby4bits.join("")).toString(2)
        yield bits; 
        grpby4bits = []
      }
      
    }
  }

  static *octToBin(bytes) {
    for(let i of bytes) {
      if (!i.trim())
        continue
      yield parseInt(i, 16).toString(2); 
    }
  }



}

function groupbyCount(bytes, n){
  // Group bytes with n number of digits in each
  if (!(typeof bytes === "string" || bytes instanceof String))
    return bytes; 
  let regx = new RegExp(`.{1,${n}}`, 'g');
  return bytes.match(regx);
}

function getPreviousRadio(){
  return $("#nsystemradios").data("selected");
}
