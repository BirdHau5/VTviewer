function setup() {
  // createCanvas(400, 400);
}

function draw(){
  // mappedmouseX= map(mouseX, 0, 600, 0, 1, true);
  // cube.rotation.y = mappedmouseX;
  // console.log(mappedmouseX);
}

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000.0;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// var light = new THREE.PointLight( 0xffffff, 0.8 );
// camera.add( light );
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 5);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.001;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 500.0;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500.0;
directionalLight.shadow.camera.left = 100;
directionalLight.shadow.camera.right = -100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
scene.add(directionalLight);

var renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor(0xa2b3bb);
renderer.outputEncoding = THREE.sRGBEncoding;

const moduleUrl = new URL("/assets/Module 1 Animated 2.obj");

document.body.appendChild(renderer.domElement);

// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([posx, negx, posy, negy, posz, negz]);

// Add the orbit controls to permit viewing the scene from different angles via the mouse.

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 0;
controls.maxDistance = 500;
camera.position.set(20, 20, 2);
controls.update();

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dLightHelper);

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x21201e,
  side: THREE.FrontSide,
}); //THREE.DoubleSide

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(20, 10);
scene.add(gridHelper);

const assetLoader = new THREE.GLTFLoader();
let mixer;
assetLoader.load(
  moduleUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, "Animation");
    const action = mixer.clipAction(clip);
    // const action = mixer.clipAction(gltf.scene.animations[0]);
    action.play();

    // clips.forEach(function (clip) {
    //     const action = mixer.clipAction(clip);
    //     action.play();
    // })
    model.side = THREE.DoubleSide;
    model.receiveShadow = true;
    model.castShadow = true;
    model.position.x = -7;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function seekAnimationTime(animMixer, timeInSeconds) {
  animMixer.time = 0;
  for (var i = 0; i < animMixer._actions.length; i++) {
    animMixer._actions[i].time = 0;
  }
  animMixer.update(timeInSeconds);
}

const gui = new dat.GUI();
const options = {
  planeColor: "#ffea00",
  side: THREE.DoubleSide,
  speed: 0.01,
  frame: 0,
};
// gui.addColor(options, "planeColor").onChange(function (e) {
//   plane.material.color.set(e);
// });
// // gui.add(options, 'side').onChange(function (e) {
// gui.add(options, "side", 1, 2).onChange(function (e) {
//   if (e <= 1.5) {
//     planeMaterial.side = THREE.FrontSide;
//   } else {
//     planeMaterial.side = THREE.DoubleSide;
//   }
// });
gui.add(options, "frame", 0, 245).onChange(function (e) {
  seekAnimationTime(mixer, e);
});

const clock = new THREE.Clock();
function animate() {
  // requestAnimationFrame(animate);
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
