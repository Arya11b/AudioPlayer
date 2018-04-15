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
    scene.add(spotlight());
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
window.onload = init;
window.addEventListener('resize',resize,false);