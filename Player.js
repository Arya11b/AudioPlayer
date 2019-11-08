/**
 * Created by Arya on 4/8/2018.
 */
//Created By Arya 11
// Global Vars
var scene;
var camera;
var renderer;
var c=0;
// for the second part
var systems = [];


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
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 20;
    // camera.rotation.x = toRad(10);
    // camera.lookAt(scene.position);
    // adding objects
    scene.add(spotlight());
    scene.add(plane('base'));
    scene.add(particleSystem("volumeLeft","pm1.jpg"));
    scene.add(particleSystem("volumeRight","pm2.png"));
    //
    document.body.appendChild(renderer.domElement);
    //
}
function play(songPath) {
    setUpAudio();
    render();
    loadAudio(songPath);
}
function render() {
    c++;
    if (c% 2== 0)
        updateWave();
    renderer.render(scene,camera);
    updateCubes();
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
function toRad(deg){
    return (deg/180) * Math.PI;
}
function plane(name) {
    var planegeo = new THREE.PlaneGeometry(30,20,1,1);
    var planemat = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    var plane = new THREE.Mesh(planegeo,planemat);
    plane.position = new THREE.Vector3(0,0,0);
    plane.rotation.x = toRad(-90.0);
    return plane;
}
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}
function updateCubes() {
    // get avg for the 1st channel
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var avg = getAverageVolume(array);
    // get avg for the 2nd channel
    var array2 = new Uint8Array(analyser2.frequencyBinCount);
    analyser2.getByteFrequencyData(array2);
    var avg2 = getAverageVolume(array2);
    if(scene.getObjectByName('volumeLeft')){
        var lv = scene.getObjectByName('volumeLeft');
        var rv = scene.getObjectByName('volumeRight');
        lv.scale.y = avg/20;
        lv.position = new THREE.Vector3(10,0,0);
        lv.position.y += avg/40;
        rv.scale.y = avg2/20;
        rv.position = new THREE.Vector3(-10,0,0);
        rv.position.y += avg2/40;
    }

}

function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    for (var i = 0; i < length; i++)
        values += array[i];
    average = values / length;
    return average;
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
// Audio section
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
function loadAudio(url){
    var request = new XMLHttpRequest();
    request.open('GET',url,true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        context.decodeAudioData(request.response,function (buffer) {
            playAudio(buffer);
        },err);
    };
    request.send();
}
function err(e) {
    console.log(e);
}
function playAudio(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}
function particleSystem(name,particleTexture) {
    var boxGeo = new THREE.BoxGeometry(2,3,2,15,25,15);
    var particleMat = new THREE.ParticleSystemMaterial();
    particleMat.map = THREE.ImageUtils.loadTexture("./assets/textures/" + particleTexture);
    // This property defines how the particle color or the texture blends together with the color of the pixels that are behind it.
    particleMat.blending = THREE.AdditiveBlending;
    particleMat.transparent = true;
    var ps = new THREE.ParticleSystem(boxGeo,particleMat);
    ps.name = name;
    return ps;
}
function updateWave() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(array);
    var particleMat = new THREE.ParticleSystemMaterial();
    particleMat.map = THREE.ImageUtils.loadTexture("./assets/textures/pm4.jpg");
    // This property defines how the particle color or the texture blends together with the color of the pixels that are behind it.
    particleMat.blending = THREE.AdditiveBlending;
    particleMat.transparent = true;
    particleMat.opacity = 0.6;
    particleMat.size = 0.3;
    var particleGeo = new THREE.Geometry();

    for (var i = 0; i < array.length ; i++) {
        // var v = new THREE.Vector3(1,array[i]/8,(i/15));
        var v = new THREE.Vector3((i/25),0,array[i]/8);
        particleGeo.vertices.push(v);
    }
    var ps = new THREE.ParticleSystem(particleGeo,particleMat);
    ps.sortParticles = true;
    systems.forEach(function (e) {
        e.position.z -= 0.5
    });
    if(systems.length === 40){
        var old = systems.shift();
        if(old) scene.remove(old);
    }
    ps.rotation.x = toRad(-90.0);
    ps.position = new THREE.Vector3(-10,-5,10);
    systems.push(ps);
    scene.add(ps);
}
window.onload = init;
window.addEventListener('resize',resize,false);
