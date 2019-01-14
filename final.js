/*********variables de escena******/
var scene,camera,renderer;
var band=false,loop=true;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var VIEW_ANGLE = 60;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;
var controls;
/*******variables de juego**************/
const total=8;
var spheres=[];
let sphere;
var X=[];
var Y=[];
var Z=[];

var largox=68,altoy=35,anchoz=22,radio=2.8;
var image,image2;
var P1,P2;

setup();
function setup(){
	init();
	animate();
}


function init(){
	scene=new THREE.Scene();
	camera= new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);
	renderer= new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH,HEIGHT);
	document.body.appendChild(renderer.domElement);
	controls=new THREE.OrbitControls(camera);
	scene.background = new THREE.Color( 0x111111 );
	camera.position.set(0,0,45);
	var geometry = new THREE.BoxBufferGeometry( largox, altoy, anchoz );
	var material = new THREE.MeshPhongMaterial( {
					color: 0x669999,
					opacity:.5,
					transparent: false,
					shininess: 10,
					specular: 0x111111,
					side:THREE.BackSide
				} );
	var cube= new THREE.Mesh(geometry,material);
	/*************aqui se crean las esferas********/
	for (var i = 0; i < total; i++) {
		
		var varx=(Math.random() * 60)-30;
		var vary=(Math.random() * 30)-15;
		var varz= (Math.random() * 15)-9;
		if(i!==0){
			for (var j=0; j<spheres.length; j++){
				console.log(distance(varx,vary,varz,spheres[j].position.x,spheres[j].position.y,spheres[j].position.z));
				if(distance(varx,vary,varz,spheres[j].position.x,spheres[j].position.y,spheres[j].position.z)<(2*radio)){
					varx=(Math.random() * 60)-30;
					vary=(Math.random() * 30)-15;
					varz= (Math.random()* 15)-9;
					j=-1;
				}
			}
		}
		spheres[i]= Esfera(varx,vary,varz);
		scene.add(spheres[i]);
	}
	/***********se crean circulos de marcaje************************************/
	var imageGeo=new THREE.CircleGeometry(3.5,25);
	var imageMat = new THREE.MeshToonMaterial( { color:0x6db1111 } );
	image= new THREE.Mesh(imageGeo,imageMat);
	image.position.set(0,0,0);

	image2= new THREE.Mesh(imageGeo,imageMat);
	image2.position.set(0,0,0);
	/***************POINTLIGHTS*****************/
	var pointLight=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight.position=cube.position;
	pointLight.position.z+=0;
	var ponlighHelper=new THREE.PointLightHelper(pointLight,.3);

	var pointLight2=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight2.position.set(-34,17.5,-10);
	var ponlighHelper2=new THREE.PointLightHelper(pointLight2,.5);

	var pointLight3=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight3.position.set(-34,-17.5,-10);
	var ponlighHelper3=new THREE.PointLightHelper(pointLight3,.5);

	var pointLight4=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight4.position.set(34,-17.5,-10);
	var ponlighHelper4=new THREE.PointLightHelper(pointLight4,.5);

	var pointLight5=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight5.position.set(34,17.5,-10);
	var ponlighHelper5=new THREE.PointLightHelper(pointLight5,.5);
	
	var pointLight6=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight6.position.set(34,-17.5,10);
	var ponlighHelper6=new THREE.PointLightHelper(pointLight6,.5);

	var pointLight7=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight7.position.set(34,17.5,10);
	var ponlighHelper7=new THREE.PointLightHelper(pointLight7,.5);

	var pointLight8=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight8.position.set(-34,17.5,10);
	var ponlighHelper8=new THREE.PointLightHelper(pointLight8,.5);

	var pointLight9=new THREE.PointLight(0xD8D8D8, 0.20, 100);
	pointLight9.position.set(-34,-17.5,10);
	var ponlighHelper9=new THREE.PointLightHelper(pointLight9,.5);

	var ambient= new THREE.AmbientLight( 0x669999 )
	ambient.intensity=.10;
	scene.add(ambient);
	scene.add(cube);
	
	//scene.add(pointLight);
	scene.add(ponlighHelper);
	scene.add(pointLight2);
	scene.add(ponlighHelper2);
	scene.add(pointLight3);
	scene.add(ponlighHelper3);
	scene.add(pointLight4);
	scene.add(ponlighHelper4);
	scene.add(pointLight5);
	scene.add(ponlighHelper5);
	scene.add(pointLight6);
	scene.add(ponlighHelper6);
	scene.add(pointLight7);
	scene.add(ponlighHelper7);
	scene.add(pointLight8);
	scene.add(ponlighHelper8);
	scene.add(pointLight9);
	scene.add(ponlighHelper9);
	
	controls.update();
	//resizer
	window.addEventListener( 'resize', onWindowResize, false );

	for (let i = 0; i < total; i++) {
		X[i]=Math.random()- 0.6;
 		
		Y[i]=Math.random()- 0.6;
		
		Z[i]=Math.random()- 0.6;
	}
}

function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		for (let i = 0; i < spheres.length; i++) {
		 	moveBall(spheres[i],X[i],Y[i],Z[i],i);
		}
			

		
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function changeColor(){
	
	P1=Math.floor(Math.random()*10);
	P2=Math.floor(Math.random()*10);
	image.position.x =spheres[P1].position.x;
	image.position.y =spheres[P1].position.y;
	image.position.z =spheres[P1].position.z;

	image2.position.x= spheres[P2].position.x;
	image2.position.y=spheres[P2].position.y;
	image2.position.z=spheres[P2].position.z;
	scene.add(image,image2);
}
function moveBall(sphere,vx,vy,vz,id){

	
	for (var i = 0; i < spheres.length; i++) {
		if(sphere===spheres[i]) continue;
		if(distance(sphere.position.x,sphere.position.y,sphere.position.z,spheres[i].position.x,spheres[i].position.y,spheres[i].position.z)<(2*radio))
			console.log("choque")	
	}
	
	sphere.position.x+=vx;
	sphere.position.y+=vy;
	sphere.position.z+=vz;
	detectWall(sphere,id);
}
function detectWall(sphere,id){
	if(	sphere.position.x>((largox/2)-radio) || sphere.position.x<(((-1*largox)/2)+radio) ){
		
		X[id]*=-1;
	}
	if(sphere.position.y>((altoy/2)-radio)  || sphere.position.y<(((-1*altoy)/2)+radio)){
		
		Y[id]*=-1; 
	}
	if(sphere.position.z>((anchoz/2)-radio) || sphere.position.z<(((-1*anchoz)/2)+radio)){
		Z[id]*=-1;
		
		 
	}
}

function distance(x1,y1,z1,x2,y2,z2) {
  var distance = Math.sqrt(   (x1 - x2) * (x1 - x2) 
  							+ (y1 - y2) * (y1 - y2) 
                            + (z1 - z2) * (z1 - z2) );
  return distance;
}

function Esfera(varx,vary,varz){
	var sphereGeometry = new THREE.SphereBufferGeometry( radio, 20, 20 );
	var sphereMaterial=new THREE.MeshToonMaterial({color:0xFFFF00});
	sphere=new THREE.Mesh(sphereGeometry,sphereMaterial);
		sphere.position.x=varx; 
		sphere.position.y=vary;
		sphere.position.z=varz;
		sphere.scale.x = sphere.scale.y = sphere.scale.z;
	return sphere;
}