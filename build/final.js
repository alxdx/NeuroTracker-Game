var scene,camera,renderer;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var VIEW_ANGLE = 75;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;

init();
animate();

function init(){
	scene=new THREE.Scene();
	camera= new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);
	renderer= new THREE.WebGLRenderer();
	renderer.setSize(WIDTH,HEIGHT);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.BoxBufferGeometry( 30, 70, 30 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube= new THREE.Mesh(geometry,material);

	scene.add(cube);
	camera.position.z=-5;

	//resizer
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
