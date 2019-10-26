"use strict";
var angulo = 0;
var posicao = 0;

var anguloAnterior;
var pontoAnterior;

//Linha da pista
var materialLinha = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
var geometriaLinha = new THREE.Geometry();

//Cena
var cena = new THREE.Scene();

//Câmera
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

//Posição da câmera
camera.position.set(1, 0.09, 18);

//Renderizador
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101010);
var canvas = renderer.domElement;
document.body.appendChild(renderer.domElement);

//Luz da câmera
var luz = new THREE.DirectionalLight(0xffffff, 1);
luz.position.setScalar(10);
cena.add(luz);

//Pista
var planoPista = new THREE.PlaneGeometry(20, 20, 1, 1);
var pistaMaterial = new THREE.MeshLambertMaterial({
  map: new THREE.TextureLoader().load('pista.png')
});
//Unindo o material da pista com o plano
var material = new THREE.Mesh(planoPista, pistaMaterial);
material.receiveShadow = true;
material.position.set(1, 0, 0);

// Adicionando o a pista a cena
cena.add(material);

//Spline 
//Pontos por onde a curva irá passar
var curva = new THREE.SplineCurve([
  new THREE.Vector3(-7.2, 3, 0.2),
  new THREE.Vector3(-7.2, 7.5, 0.2),
  new THREE.Vector3(-4, 7.5, 0.2),
  new THREE.Vector3(-3.5, 3, 0.2),
  new THREE.Vector3(2, 3, 0.2),
  new THREE.Vector3(3, 7.5, 0.2),
  new THREE.Vector3(5.5, 7.5, 0.2),
  new THREE.Vector3(6.5, 1.5, 0.2),
  new THREE.Vector3(8.7, 0, 0.2),
  new THREE.Vector3(9, -3, 0.2),
  new THREE.Vector3(6.6, -4.5, 0.2),
  new THREE.Vector3(6, -7.9, 0.2),
  new THREE.Vector3(3.3, -8, 1),
  new THREE.Vector3(2.5, -5, 0.2),
  new THREE.Vector3(2.5, -2, 0.2),
  new THREE.Vector3(-1.2, -2, 0.2),
  new THREE.Vector3(-1.8, -6, 0.2),
  new THREE.Vector3(-4, -6, 0.2),
  new THREE.Vector3(-4.6, -3.8, 0.2),
  new THREE.Vector3(-6.7, -2.9, 0.2),
  new THREE.Vector3(-7.2, 3, 0.2),
]);

var caminho = new THREE.Path(curva.getPoints(50));
var geometriaLinha = caminho.createPointsGeometry(50);

//Desenhar os pontos de referencia 
var materialPonto = new THREE.PointsMaterial({ size: 10, sizeAttenuation: false });

//For responsáve por adicionar os pontos na tela
for (let p of curva.points) {
  var geometriaPonto = new THREE.Geometry();
  geometriaPonto.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
  var ponto = new THREE.Points(geometriaPonto, materialPonto);
  cena.add(ponto);
}

//Linha que será o caminho por onde o carro irá passar
var linha = new THREE.Line(geometriaLinha, materialLinha);
cena.add(linha);

//Corpo do carro
var geometria = new THREE.BoxGeometry(1, 1.5, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cubo = new THREE.Mesh(geometria, material);
/*
//Roda do carro
var circulo = new THREE.CircleGeometry(0.2, 32);
var imagemRoda = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('roda.png'),
  side: THREE.DoubleSide
});

//Roda 1
var roda1 = new THREE.Mesh(circulo, imagemRoda);
roda1.rotation.x = 1.6;
roda1.rotation.y = 1.6;
roda1.position.x = 0.6;
roda1.position.y = -0.4;

var roda2 = roda1.clone();
roda2.rotation.x = 1.6;
roda2.rotation.y = 1.6;
roda2.position.x = -0.6;
roda2.position.y = -0.4;
*/

var cilindro = new THREE.CylinderGeometry( 5, 5, 0.2, 32 );
var imagemRoda = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('roda.png'),
  side: THREE.DoubleSide
});
var roda1 = new THREE.Mesh( cilindro, imagemRoda );





var carro = new THREE.Group();
carro.add(cubo);
carro.add(roda1);
carro.position.set(-7.2, 3, 0.2);
cena.add(carro);
// Angulo e ponto de inicio (esse dois não estão sendo utilizados em nada)
//anguloAnterior = pegarAngulo( posicao );
//pontoAnterior = caminho.getPointAt( posicao );

function pegarAngulo(posicao) {
  // Pegando a tangent 2D da curva
  var tangent = caminho.getTangent(posicao).normalize();

  // Mudando a tangent para 3D
  angulo = - Math.atan(tangent.x / tangent.y);

  return angulo;
}

function desenhar() {
  movimento();
  requestAnimationFrame(desenhar);
  renderer.render(cena, camera);
}

function movimento() {

  // Adicionando a posição para o movimento
  posicao += 0.001;
  console.log("Posiçao", posicao)
  // Obtendo o ponto da posição
  if(posicao > 1.0){
    posicao = 0.001;
  }
  var ponto = caminho.getPointAt(posicao);
  carro.position.x = ponto.x;
  carro.position.y = ponto.y;

  var angulo = pegarAngulo(posicao);
  // Define o quaternion
  carro.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angulo);

  /**
   * Esses dois não estão interferindo em nada no código
   */
  //pontoAnterior = ponto;
  //anguloAnterior = angulo;

  repeticao();
}

function repeticao() {

}

//Variáveis para avaliar o deslocamento do mouse
var xi;
var yi;

canvas.addEventListener("mousedown", function (e) {
  xi = e.offsetX;
  yi = e.offsetY;
}, false);

//Evento de movimento do mouse (se há botão pressionado)
canvas.addEventListener("mousemove", function (e) {
  if (e.buttons > 0) {
    camera.position.x = 8 * (xi - e.offsetX) / canvas.width;
    camera.position.y = 8 * (e.offsetY - yi) / canvas.height;
  }
}, false);

requestAnimationFrame(desenhar);