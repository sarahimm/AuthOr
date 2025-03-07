var innerW, canvasH, c, tBase, tCar, tTop;
var pageW, pageH, pageOffset, pageX, pageY, imgX, imgY, imgW, imgH;
var pageBuffer, eraser, promptField, autofill;
var sysRole, sysAdj, userPrompt, numOptions, numTokens, temp;


function preload(){
  tBase = loadImage("img/Typewriter-base.png");
  tCar = loadImage("img/Typewriter-carriage.png");
  tTop = loadImage("img/Typewriter-top.png");
  logo = loadImage("img/logo.png");
  BLEH_on = loadImage("img/BLEH-recording.png");
  BLEH_off = loadImage("img/BLEH-recordingOff.png"); 
  table = loadImage("img/marble.png");
  wall = loadImage("img/wall2.png");
}
function setup() {
  canvasH=window.innerHeight;
  canvasW=window.innerWidth;
  innerW=min(canvasW, 1.5*canvasH);
  marginL=0.5*(canvasW - innerW);
  c=createCanvas(canvasW, canvasH);
  
  imgX = (-.2 * innerW) + marginL;
  imgY = canvasH - innerW * .6;
  imgW = 1.5 * innerW;
  imgH = innerW;
  
  pageW = 0.42 * innerW;
  pageH = 0.15 * innerW;
  pageOffset = -.48 * pageW;
  pageX = (0.285 * innerW) + marginL;
  pageY = canvasH - 0.37 * innerW;
  
  pageBuffer=createGraphics(pageW, .7 * canvasH, P2D);
  pageBuffer.fill(256);
  pageBuffer.rect(0, 0,pageW, .7 * canvasH);
  
  document.getElementById("savePage").addEventListener('click', function () {
    pageBuffer.save();
  });

  document.getElementById("newPage").addEventListener('click', function() {
    pageBuffer.fill(256);
    pageBuffer.rect(0, 0, pageW, .7 * canvasH);
  })
  lineH = 15;
  pageBuffer.textSize(11);
  pageBuffer.textFont('Courier');
  cursorUnit = textWidth('a');
  eraser=color(245);
  eraser.setAlpha(150);
  strokeWeight(0);

  promptField = document.getElementById('prompt');
  autofill = document.getElementById('autofill');

  userPrompt = "";
  angleMode(DEGREES);
}

function draw() {
  noStroke();
  background('AntiqueWhite');
  //blendMode(MULTIPLY);
  //image(logo, canvasW - 180, 20, 180, 100);
  blendMode(BLEND);
  fill(60, 40, 25);
  image(wall, -0.5 * canvasW, -0.3 * canvasH, 1.5 * canvasW, 1.5 * canvasH, 0, 0, wall.width, wall.height, COVER);
  quad(-.37*canvasW, 1.56 * canvasH, .04*canvasW, .48*canvasH, .96*canvasW, .48*canvasH, 1.37*canvasW, 1.56 * canvasH);
  image(table,-0.25 * canvasW, .5*canvasH, 1.5* canvasW, canvasH);
  //image(tBase, imgX, imgY, imgW, imgH);
  stroke(0);
  rotate(-5);
  fill(60,15,5);
  rect(.09*canvasW, .69*canvasH, 30, 80);
  rect(5 + .09*canvasW, 20 + .69*canvasH, 10, 40);
  ellipse(15+ 0.09*canvasW, 80 + .69*canvasH, 30,20);
  rect(.25*canvasW, .68*canvasH, 28, 74);
  ellipse(14+ 0.25*canvasW, 74 + .68*canvasH, 28,20);
  fill(70,25,15);
  rect(5 + .09*canvasW, 18 + .69*canvasH, 10, 60);
  rect(5 + .25*canvasW, 19 + .68*canvasH, 10, 50);
  if(autofill.checked){
    image(BLEH_on,0, 0, .28* canvasW, .38 * canvasW);
  }else{
    image(BLEH_off, 0, 0, .28 * canvasW, .38 * canvasW);
  }

  rotate(5);
  /*rect(.04 * canvasW, .195 * canvasW, 20, textWidth(userPrompt));
  fill(0);
  rotate(-90);
  text(userPrompt, -textWidth(userPrompt) -.195 * canvasW, 14 + .04 * canvasW);
  rotate(90);
  fill("white");
  */
  copy(pageBuffer, 0, 0, int(pageW), int(pageH), int(pageX - pageOffset), int(pageY), int(pageW), int(pageH));
  image(tCar,  imgX-pageOffset - 0.008 * innerW, imgY, imgW, imgH);
  image(tTop,  imgX, imgY, imgW, imgH);
  
}

function keyTyped(){
  if(document.activeElement === promptField){
    return;
  }
  if( key==="Enter"){
   pageOffset = -.48 * pageW;
   return false;
  }
  else{
    pageBuffer.fill(0);
    newchar=key;
    if(pageOffset < pageW * 0.48){
      pageBuffer.text(newchar,(0.5*pageW) + pageOffset, pageH - 15);
      pageOffset += cursorUnit;
    }
    if(autofill.checked){
      promptField.value+=newchar;
    }
    userPrompt = promptField.value;
    document.getElementById('currentPrompt').innerText = userPrompt;
    return false;
  }
}

function keyPressed(){
  if(document.activeElement === promptField ){
    return;
  }
  if(key==='Control'){
    if (autofill.checked){
      autofill.checked = false;
      document.getElementById("recordingLight").style.background = "none";
      document.getElementById("recordingLight").style.boxShadow = "0px 0px 0px red";
    }else{
      autofill.checked = true;
      document.getElementById("recordingLight").style.background = "red";
      document.getElementById("recordingLight").style.boxShadow = "0px 0px 3px red";
    }
    return false;
  }
  if(key=== 'Tab'){
    printCompletions((0.5*pageW) + pageOffset, pageH-15);
    return false;
  }
  if (key ==='Backspace'){
    pageBuffer.fill(eraser);
    pageBuffer.noStroke();
    pageBuffer.blendMode(LIGHTEST);
    if(pageOffset > -0.48 * pageW){
      pageBuffer.rect((0.5*pageW) + pageOffset - cursorUnit, pageH - 30, cursorUnit, 20); 
      pageOffset -= cursorUnit;
    }
    pageBuffer.blendMode(BLEND);
    if(autofill.checked){
      promptField.value = promptField.value.slice(0,-1);
      document.getElementById('currentPrompt').innerText = promptField.value;
      return false;
    }
  }
  else if(key==='ArrowLeft'){
      move(37, 500);
  }
  else if(key==='ArrowRight'){
    move(39, 500);
  }
  else if(key==='ArrowUp'){
    move(38, 500);
  }
  else if(key==='ArrowDown'){
    move(40, 500);
  }
}

function move(keycode, wait){
  if(keyIsDown(keycode)){
    if(keycode==37){ //Left
      if(pageOffset > pageW * -0.48){
        pageOffset -= cursorUnit;
      }
    }else if (keycode==39){ //Right
      if(pageOffset < pageW * 0.48){
        pageOffset += cursorUnit;
      }
    }else if (keycode==38){ //Up
      if(pageY < canvasH - 0.27 * innerW){
        pageY += 0.5 * lineH;
        pageH -= 0.5 * lineH;
      }
    }else if (keycode==40){ //Down
      if(pageY > 20){
        pageY -= 0.5 * lineH;
        pageH += 0.5 * lineH;
      }
    }
    setTimeout(function(){move(keycode, max(50,.7 *wait));}, wait);
  }
  return;
}

async function printCompletions(x,y,num){
  choices = await getCompletions();
  y2 = y + lineH * 0.5 * (1 - choices.length);
  x2 = x + 2 * cursorUnit;
  for(var choice of choices){
    pageBuffer.stroke(0);
    pageBuffer.strokeWeight(1);
    pageBuffer.noFill();
    pageBuffer.bezier(x,y - 0.2*lineH,x2,y - 0.2*lineH,x,y2 - 0.2*lineH,x2,y2 - 0.2*lineH);
    pageBuffer.fill(0,200,0);
    pageBuffer.strokeWeight(0);
    let linex = x2;
    for(var cha of choice){ 
      pageBuffer.text(cha,linex,y2);
      linex += cursorUnit;
    }
    y2 += lineH;
  }
  pageOffset += cursorUnit * (2+choices[choices.length -1].length);
  pageY -= 0.5 * (choices.length - 1) * lineH;
  pageH += 0.5 * (choices.length - 1) * lineH;
}

async function getCompletions(){
  updateParams();
  address="http://127.0.0.1:5000/api/query?msg=";
  address+=encodeURIComponent(userPrompt);
  promptField.value="";
  document.getElementById('currentPrompt').innerText = "";
  address+="&sysPrompt="+encodeURIComponent("You are a " + sysRole + " assistant. Continue the sentence or line you are given by providing the most " + sysAdj + " next word or phrase.");
  address+="&numOptions="+encodeURIComponent(numOptions);
  address+="&numTokens="+encodeURIComponent(numTokens);
  address+="&temp="+encodeURIComponent(temp);
  let response = await fetch(address);
  let reply = await response.json();
  let array = [];
  for(var choice of reply.choices){
    array.push(choice);
  }
  while(array.length < numOptions){
    array.push("Error");
  }
  return array;
}

function updateParams(){
  sysRole = document.getElementById("role").value;
  sysAdj = document.getElementById("adjective").value;
  userPrompt = document.getElementById("prompt").value; 
  numOptions = document.getElementById("numOptions").value; 
  numTokens = document.getElementById("maxTokens").value; 
  temp = document.getElementById("temperature").value;
}