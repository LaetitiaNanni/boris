'use strict';

import THREE from 'three';
import bindAll from 'lodash.bindall';
import raf from 'raf';
import resize from 'brindille-resize';
import * as colors from './webgl/config/colors';

//objects
import Structure from './webgl/objects/Structure';
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

    bindAll(this, 'render', 'handleResize');

    this.isAnimate = false;


    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;
    this.scene = new THREE.Scene();

    this.structure = new Structure();
    this.scene.add(this.structure);

    // LIGHT
    var spherelight = new THREE.PointLight(0xfffccc);
    spherelight.position.set(0,0,0);
    this.scene.add(spherelight);


    this.light = new THREE.SpotLight(0xfffccc,10, 6000 );
    this.light.position.set( -3500*3.5, 2500, 11500*5 );   //using this light.position as referance for "godray"lights, any vector3 will do,rename accordingly.
    // light.rotation.set( 0, Math.PI/2, 0 );

    this.scene.add(this.light);
    this.scene.fog = new THREE.Fog( 0x000000, 500, 2000 );
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.ambientLight.intensity = 22.2;
    this.ambientLight.color.setHex( 0xffffff );
    this.scene.add(this.ambientLight);


    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(resize.width, resize.height);
    $container.appendChild(this.renderer.domElement);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    // this.controls.addEventListener( 'change', this.render );


    raf(this.render);

    this.addGui();
    

  }
  addGui() {
    /// GUI stats
    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild( this.stats.domElement );


    /// datGUI
    this.gui = new dat.GUI();
    var config = () => {
      this.uniforms = "#ffae23";
    }

    var config = {
      uniforms: {
        'c': 0.3,
        'p': 2.7
      }
    }



    var fglobals = this.gui.addFolder('Global');
    fglobals.add(this, 'isAnimate');
    fglobals.open();

    var ffog = this.gui.addFolder('Fog');
    ffog.addColor(colors, 'fogColor').onChange(() => { this.scene.fog.color.setHex(colors.fogColor); });
    ffog.add(this.scene.fog, 'near', 0,3000);
    ffog.add(this.scene.fog, 'far', 100,3000);

    var fstruc = this.gui.addFolder('Structure');
    fstruc.open();
    fstruc.addColor(colors, 'particuleColor').onChange(() => {
      let particules = this.structure.particules;
      for(let i = 0; i < particules.length; i++) {
        particules[i].material.color.setHex(colors.particuleColor);
      }
    });

    // fstruc.add(config.uniforms, 'c', 0.0, 1.0, 0.01).onChange(() => {
    //   let particules = this.structure.particules;
    //   for(let i = 0; i < particules.length; i++) {
    //     particules[i].glow.material.uniforms[ "c" ].value = config.uniforms.c;
    //   }
    // });
    // fstruc.add(config.uniforms, 'p', 0.0, 6.0, 0.01).onChange(() => {
    //   let particules = this.structure.particules;
    //   for(let i = 0; i < particules.length; i++) {
    //     particules[i].glow.material.uniforms[ "p" ].value = config.uniforms.p;
    //   }
    // });
    fstruc.addColor(colors, 'lineColor').onChange(() => { 
      this.structure.line.material.color.setHex(colors.lineColor); 
    });

  }


  handleResize() {
    this.camera.aspect = resize.width / resize.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(resize.width, resize.height);
  }

  render() {
    raf(this.render);
    let t = 0.0001 * Date.now();
    this.stats.begin();

    if(this.isAnimate) 
      this.structure.update(t);

    // this.controls.update();
    // this.mesh.cubeCamera.updateCubeMap(this.renderer, this.scene);
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

  }
}
