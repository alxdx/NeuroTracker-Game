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
var composer, glitchPass
/*******variables de juego**************/
const cv=0.1;
const total=8;
var spheres=[];
let sphere;
var selectBOOL,moveBOOL;
var plus = new THREE.Vector3();
var minus = new THREE.Vector3();
var selectedSphere=[];
var puntuacion=0,fallos=0;
/**variables para choque elastico**/
var separation = new THREE.Vector3();
var normal = new THREE.Vector3();
var relativeVelocity = new THREE.Vector3();
/*****variables de control**************/
var largox=68,altoy=35,anchoz=22,radio=2.8;
var image,image2;
var P1,P2;
var mouse = new THREE.Vector2(), projector,raycaster,INTERSECTED;
var targetList = [];

setup();
updateOptions();
function setup(){
	init();
	draw();
	GAME();

}
function GAME(){
	glitchPass.renderToScreen = false;
	glitchPass.goWild=false;
	selectBOOL=false;
	moveBOOL=false;
	setTimeout('selectOne()',2000);
	draw();
	setTimeout('animate()',7000);
	if(fallos===3){
		setup();
		
	}
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
	var ranColor=new THREE.Color();//.setHSL( Math.random(), 1, .5 );
	/*************aqui se crean las esferas********/
	for (var i = 0; i < total; i++) {
		
		var varx=(Math.random() * 60)-30;
		var vary=(Math.random() * 30)-15;
		var varz= (Math.random() * 15)-9;
		if(i!==0){
			for (var j=0; j<spheres.length; j++){
				console.log("tryS");
				if(distance(varx,vary,varz,spheres[j].position.x,spheres[j].position.y,spheres[j].position.z)<(2*radio)){
					varx=(Math.random() * 60)-30;
					vary=(Math.random() * 30)-15;
					varz= (Math.random()* 15)-9;
					j=-1;
				}
			}
		}
		targetList[i]=spheres[i]= madeEsfera(varx,vary,varz,ranColor);

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
	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();

	/********POSTPROCESSING********/
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = false;
	composer.addPass( glitchPass );

	controls.update();

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener('mousemove',onDocumentMouseMove,false);
	//resizer
	window.addEventListener( 'resize', onWindowResize, false );
	/**inicia booleans para control de juego**/
	selectBOOL=false;
	moveBOOL=false;
	//glitchPass.goWild=true;
}


function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
		moveBall();
		composer.render();		
}
function draw(){
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove(event){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	proyectar();
}

function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }

function select(){
	if (selectBOOL===false){

		P1=Math.floor(Math.random()*10);
		P2=Math.floor(Math.random()*10);
		if(P1!==P2){
			image.position.copy(spheres[P1].position);
			image2.position.copy(spheres[P2].position);
			scene.add(image,image2);
			console.log("seleccionados");
			selectCiclo=true;
		}
		else
			select();
		selectBOOL=true;
	}
	draw();
	setTimeout('unselect()',6000);
		
}
function selectOne(){
	if (selectBOOL===false){
			P1=(Math.floor(Math.random()*(total-1)));
			image.position.copy(spheres[P1].position);
			scene.add(image);
			console.log("seleccionado");
			selectCiclo=true;
		
		selectBOOL=true;
	}
	draw();
	setTimeout('unselectOne()',6000);		
}
function unselectOne(){
	if(selectBOOL===true){
		scene.remove(image);
		draw();
		selectBOOL=false;
		moveBOOL=true;
		console.log("Deseleccionado",moveBOOL);
	}
}
function unselect(){
	if(selectBOOL===true){
		scene.remove(image2);
		scene.remove(image);
		console.log("Deseleccionados");
		draw();
		selectBOOL=false;
		moveBOOL=true;
	}
}
function moveBall(){
	if(moveBOOL===true){
			for ( var i = 0 ; i < total ; i++ ) {
				var sphere = spheres[i];
				plus.copy( sphere.position ).addScalar( radio ).add( sphere.vel );
				minus.copy( sphere.position ).subScalar( radio ).add( sphere.vel );
				detectWall(sphere);
				elastic(sphere,i);			
				sphere.position.add( sphere.vel );
			}
		setTimeout('stopBall()',8000);
	}
	
}
function stopBall(){
	if(moveBOOL===true)
		moveBOOL=false;

}
function onDocumentMouseDown( event ) {
	event.preventDefault();

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() )
	intersects=ray.intersectObjects( targetList )
	if ( intersects.length > 0 ){
		console.log("Hit @ " + toString( intersects[0].point ));
		if(intersects[0].object===spheres[P1]){
			puntuacion++;
			P1=-1
			console.log(puntuacion);
			GAME();
		}
		else{
			if (moveBOOL===false && selectBOOL===false){
				fallos++;
				console.log("MAL",fallos);
				glitchPass.renderToScreen = true;
				glitchPass.goWild=true;
				setTimeout('GAME()',1000);
			}
			
			
		}
	}
}
function updateOptions(){
	document.getElementById("puntuacion").innerHTML = puntuacion;
	document.getElementById("fallos").innerHTML = 3-fallos;

}
function detectWall(b1){
	if ( plus.x > ((largox/2)) || minus.x < (-largox)/2) b1.vel.x = -b1.vel.x;
	if ( plus.y > ((altoy/2))  || minus.y < (-altoy)/ 2) b1.vel.y = -b1.vel.y;
	if ( plus.z > ((anchoz/2)) || minus.z < (-anchoz)/2) b1.vel.z = -b1.vel.z;
}
function elastic(sphere,i){
	for ( var j = i + 1 ; j < total ; j++ ) {
		var b2 = spheres[j];
		separation.copy( sphere.position ).add( sphere.vel ).sub( b2.position ).sub( b2.vel );
		// exchange normal velocities for collision, leave tangential alone
		if ( separation.length() < 2 * radio ) {
			normal.copy( sphere.position ).sub( b2.position ).normalize();
			relativeVelocity.copy( sphere.vel ).sub( b2.vel );
			var dot = relativeVelocity.dot( normal );
			normal = normal.multiplyScalar( dot );
			sphere.vel.sub( normal );
			b2.vel.add( normal );
		}
	}
}
function madeEsfera(varx,vary,varz,colorH){
	var sphereGeometry = new THREE.SphereBufferGeometry( radio, 20, 20 );
	var sphereMaterial=new THREE.MeshToonMaterial({color:colorH});

	sphere=new THREE.Mesh(sphereGeometry,sphereMaterial);
		sphere.position.set(varx,vary,varz) 
	sphere.vel=new THREE.Vector3(Math.random()- cv,Math.random()- cv,Math.random()- cv);
	return sphere;
}
function distance(x1,y1,z1,x2,y2,z2) {
  var distance = Math.sqrt(   (x1 - x2) * (x1 - x2) 
  							+ (y1 - y2) * (y1 - y2) 
                            + (z1 - z2) * (z1 - z2) );
  return distance;
}
function proyectar(){
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( targetList );
	if ( intersects.length > 0 ) {
	if ( INTERSECTED != intersects[ 0 ].object ) {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );
		}
	} else {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = null;
	}
}
