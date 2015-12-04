'use strict';

import THREE from 'three';
import bindAll from 'lodash.bindall';
import raf from 'raf';
import resize from 'brindille-resize';

//objects
import Particule from './webgl/objects/Particule';
import Line from './webgl/objects/Line';

//shaders
// import './webgl/shaders/SkyShader';

//controls
import './webgl/controls/OrbitControls';

//DEV utils
import dat from 'dat-gui';
import Stats from 'stats.js';

export default class App {
  constructor($container) {

    console.log('App.constructor()');

    bindAll(this, 'render', 'handleResize', 'guiChanged');

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;
    // this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    // this.camera.position.z = 100;
    this.scene = new THREE.Scene();

    this.mesh = new Particule();
    this.scene.add(this.mesh);

    // LIGHT
    var spherelight = new THREE.PointLight(0xfffccc);
    spherelight.position.set(0,0,0);
    this.scene.add(spherelight);


    this.light = new THREE.SpotLight(0xfffccc,10, 6000 );
    this.light.position.set( -3500*3.5, 2500, 11500*5 );   //using this light.position as referance for "godray"lights, any vector3 will do,rename accordingly.
    // light.rotation.set( 0, Math.PI/2, 0 );

    this.scene.add(this.light);

    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.ambientLight.intensity = 22.2;
    this.ambientLight.color.setHex( 0xffffff );
    this.scene.add(this.ambientLight);


    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(resize.width, resize.height);
    $container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    // this.controls.addEventListener( 'change', this.render );


    raf(this.render);

    
    /// GUI
    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms

    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
     
    document.body.appendChild( this.stats.domElement );

  

    var gui = new dat.GUI();

    // gui.add( this.effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( this.guiChanged );

    // this.guiChanged();
  }
  
  guiChanged() {
    
    var distance = 400000;
    var uniforms = this.sky.uniforms;
    uniforms.turbidity.value = this.effectController.turbidity;
    uniforms.reileigh.value = this.effectController.reileigh;
    uniforms.luminance.value = this.effectController.luminance;
    uniforms.mieCoefficient.value = this.effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = this.effectController.mieDirectionalG;

    var theta = Math.PI * ( this.effectController.inclination - 0.5 );
    var phi = 2 * Math.PI * ( this.effectController.azimuth - 0.5 );

    this.sunSphere.position.x = distance * Math.cos( phi );
    this.sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    this.sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

    this.sunSphere.visible = this.effectController.sun;

    this.sky.uniforms.sunPosition.value.copy( this.sunSphere.position );

    // raf(this.render);


  }

  handleResize() {
    this.camera.aspect = resize.width / resize.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(resize.width, resize.height);
  }

  render() {
    raf(this.render);
    this.stats.begin();
    // this.controls.update();
    // this.mesh.cubeCamera.updateCubeMap(this.renderer, this.scene);
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

  }
}
