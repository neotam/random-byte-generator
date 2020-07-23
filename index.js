const random = require('lodash.random'); 
window.random = random; 

const BCOUNT_LIMIT = Math.pow(2, 24);

$( e => {
  $('#genbytes').on('click', e => genRandBytes());
  registerEvents(); 
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
  $('input[name="nsystem"]').on('click', onNsystemClick)
}

function onNsystemClick(e){
  console.log("Radio Button Click"); 
  console.log(e.target.value);

}


class ByteInterpreter {
  constructor() {

  }

  interpret(n){
    if (n != $('input[name="nsystem"]:checked').val().toLowerCase()){
      console.log("interpreting")
      let b = n && (n in this) && this[n]();
      b && $("")
    }
      
  }

  getCurrentBytes(){
    return $("#bytesout").val(); 
  }  

  binary(){

  }

  octal(){
    let bytes = this.getCurrentBytes(); 

  }

  hexadecimal(){

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
      $('#bytesout').val(bytes); 
      break; 
    case 'octal':
      updateBytesOut(toOctal, bytes)
      break; 
    case 'hexadecimal':
      updateBytesOut(toHex, bytes)
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
  let delimiter = ""; 
  let dataiter = func(bytes); 
  let data = Array.from(dataiter).join(delimiter);
  $('#bytesout').val(data); 
}


function* toOctal(bytes){
  let data = groupbyCount(bytes, 3)
  for(let i of data){
    yield parseInt(i, 2).toString(8); 
  }
}


function* toHex(bytes){
  let data = groupbyCount(bytes, 4)
  for(let i of data){
    console.log(i);
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

function groupbyCount(bytes, n){
  // Group bytes with n number of digits in each
  let regx = new RegExp(`.{1,${n}}`, 'g')
  return bytes.match(regx);
}

