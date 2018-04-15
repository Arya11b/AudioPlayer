/**
 * Created by Arya on 4/8/2018.
 */
//Created By Arya 11
// Global Vars
var scene;
var camera;
var renderer;

const colorVariety = 0xffffff;

function init(){
    // declaring vars
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000);
    //
    renderer.setClearColor(0x000000,1.0);
    renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth,window.innerHeight);
    //
    camera.position.x = 10;
    camera.position.y = 15;
    camera.position.z = 15;
    camera.lookAt(scene.position);
    // adding objects
    scene.add(spotlight());
    scene.add(particleSystem("pm1.jpg"));
    scene.add(particleSystem("pm2.png"));
    //
    document.body.appendChild(renderer.domElement);
    //
    render();
}
function render() {
    renderer.render(scene,camera);
    requestAnimationFrame(render); //calls itself when needed
}
function spotlight(){
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(10,20,20);
    light.shadowCameraNear = 15;
    light.shadowCameraFar = 50;
    light.castShadow = true;
    return light;
}
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}
function showVertices(mesh) {
    var vertices = mesh.geometry.vertices;
    var vertexGeo = new THREE.SphereGeometry(0.2);
    var vertexMat = new THREE.MeshPhongMaterial({
        color: 0x00ff00
    });
    vertices.forEach(function (vertex){
        var vertexMesh = new THREE.Mesh(vertexGeo,vertexMat);
        vertexMesh.position = vertex;
        scene.add(vertexMesh);
    });
}
function setUpAudio() {
    context = new AudioContext();
    sourceNode = context.createBufferSource();
    splitter = context.createChannelSplitter();
    analyser = context.createAnalyser();
    // This is a value between 0 and 1, where 0 represents no time averaging with the last analysis's frame. The default value is 0.8.
    analyser.smoothingTimeConstant = 0.4;
    // fast fourier transform size must be in power of 2 unless an error is thrown
    analyser.fftSize = 1024;
    analyser2 = context.createAnalyser();
    analyser2.smoothingTimeConstant = 0.4;
    analyser2.fftSize = 1024;
    sourceNode.connect(splitter);
    splitter.connect(analyser, 0);
    splitter.connect(analyser2, 1);
    sourceNode.connect(context.destination);
}
function particleSystem(particleTexture) {
    var boxGeo = new THREE.BoxGeometry(4,7,4,15,25,15);
    var particleMat = new THREE.ParticleSystemMaterial();
    particleMat.map = THREE.ImageUtils.loadTexture("./assets/textures/" + particleTexture);
    // This property defines how the particle color or the texture blends together with the color of the pixels that are behind it.
    particleMat.blending = THREE.AdditiveBlending;
    particleMat.transparent = true;
    var ps = new THREE.ParticleSystem(boxGeo,particleMat);
    return ps;
}
window.onload = init;
window.addEventListener('resize',resize,false);