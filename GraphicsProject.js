"use strict";

var canvas;
var gl;

var numVertices = 36;
// 정사각형이 6개 이므로 삼각형이 12개 => 12 *3 = 36

var texSize = 64;

var program;

var index = 0;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture1, texture2;

// 텍스쳐 좌표계
var texCoord = [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)];

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
];

var vertexColors = [
  vec4(0.0, 1.0, 1.0, 1.0), // white
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [45.0, 45.0, 45.0];
var flag = true;

var thetaLoc;

function configureTexture(img) {
  texture1 = gl.createTexture(); // 텍스쳐 생성
  gl.bindTexture(gl.TEXTURE_2D, texture1); // 바인딩
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Y축을 기준으로 텍스쳐를 로딩한다.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); // 2D 이미지 데이터 생성
  gl.generateMipmap(gl.TEXTURE_2D); // Mipmap 생성
  gl.texParameteri(
    // 텍스쳐 필터 지정
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[0]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  colorsArray.push(vertexColors[0]);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[0]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[0]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[0]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[d]);
  colorsArray.push(vertexColors[0]);
  texCoordsArray.push(texCoord[3]);
}

function colorCube1() {
  // quad 함수를 통해 정육면체 생성
  quad(1, 0, 3, 2); // 윗면 -> 1
  var image1 = document.getElementById("texImage1");
  configureTexture(image1);
}

function colorCube2() {
  // quad 함수를 통해 정육면체 생성
  quad(2, 3, 7, 6); // 오른쪽면 -> 2
  var image2 = document.getElementById("texImage2");
  configureTexture(image2);
}

function colorCube3() {
  // quad 함수를 통해 정육면체 생성
  quad(3, 0, 4, 7); // 앞면 -> 3
  var image3 = document.getElementById("texImage3");
  configureTexture(image3);
}

function colorCube4() {
  // quad 함수를 통해 정육면체 생성
  quad(6, 5, 1, 2); // 뒷면 ->4
  var image4 = document.getElementById("texImage4");
  configureTexture(image4);
}

function colorCube5() {
  // quad 함수를 통해 정육면체 생성
  quad(4, 5, 6, 7); // 아랫면 -> 6
  var image6 = document.getElementById("texImage6");
  configureTexture(image6);
}

function colorCube6() {
  // quad 함수를 통해 정육면체 생성
  quad(5, 4, 0, 1); // 왼쪽면 -> 5
  var image5 = document.getElementById("texImage5");
  configureTexture(image5);
}

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  colorCube1();
  colorCube2();
  colorCube3();
  colorCube4();
  colorCube5();
  colorCube6();

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  thetaLoc = gl.getUniformLocation(program, "theta");

  document.getElementById("ButtonX").onclick = function () {
    axis = xAxis;
  };
  document.getElementById("ButtonY").onclick = function () {
    axis = yAxis;
  };
  document.getElementById("ButtonZ").onclick = function () {
    axis = zAxis;
  };
  document.getElementById("ButtonT").onclick = function () {
    flag = !flag;
  };

  render();
};

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  if (flag) {
    theta[axis] += 20.0;
  }
  gl.uniform3fv(thetaLoc, flatten(theta));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
  requestAnimFrame(render);
};
