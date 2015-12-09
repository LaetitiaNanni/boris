'use strict';

import THREE from 'three';
import bindAll from 'lodash.bindall';
import raf from 'raf';
import resize from 'brindille-resize';
import * as colors from './webgl/config/colors';
import WAGNER from '@superguigui/wagner';

// objects
import Structure from './webgl/objects/Structure';

// shaders
// import './webgl/shaders/SkyShader';

// controls
import './webgl/controls/OrbitControls';

// DEV utils
import dat from 'dat-gui';
import Stats from 'stats.js';

// passes
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass';
import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass';
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass';
import brighContrastPass from '@superguigui/wagner/src/passes/brightness-contrast/BrightnessContrastPass';
// import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass';


export default class App {
  constructor($container) {

    console.log('App.constructor()');

    bindAll(this, 'render', 'handleResize');

    this.isAnimate = false;

    this.passes = {
      usePostProcessing: true,
      useFXAA: true,
      useBlur: false,
      useBloom: true,
      useContrast: false
    };

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog( 0x000000, 500, 2000 );

    // OBJECTS
    this.structure = new Structure();
    this.scene.add(this.structure);

    // LIGHT
    var spherelight = new THREE.PointLight(0xfffccc);
    spherelight.position.set(0,0,0);
    this.scene.add(spherelight);

    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.ambientLight.intensity = 22.2;
    this.ambientLight.color.setHex( 0xffffff );
    this.scene.add(this.ambientLight);

    // RENDERER
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(resize.width, resize.height);
    $container.appendChild(this.renderer.domElement);
    // this.renderer.setClearColor(0x323232);
    // this.renderer.gammaInput = true;
    // this.renderer.gammaOutput = true;

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    // this.controls.addEventListener( 'change', this.render );


    this.initPostprocessing();

    this.addGui();

    raf(this.render);

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

    var config = {
      uniforms: {
        'c': 0.3,
        'p': 2.7
      },
      pos: 0
    }

    var fglobals = this.gui.addFolder('Global');
    fglobals.add(this, 'isAnimate').onChange(()=>{
      // if(this.isAnimate) 
      //   this.structure.animate();
    });
    // fglobals.add(config, 'pos', 0 , 1000, 1).onChange(()=>{
    //   let particules = this.structure.particules;
    //   for(let i = 0; i < particules.length; i++) {
    //     var sphere = particules[i];
    //     sphere.position.normalize();
    //     sphere.position.multiplyScalar(config.pos);
    //   }

    // });

    for(let p in this.passes) {
      fglobals.add(this.passes, p);
    }

    fglobals.add(this.bcPass.params, 'contrast', 0.0, 1.0, 0.1);
    fglobals.add(this.bcPass.params, 'brightness', 0.0, 1.0, 0.1);

    fglobals.open();

    var ffog = this.gui.addFolder('Fog');
    ffog.addColor(colors, 'fogColor').onChange(() => { this.scene.fog.color.setHex(colors.fogColor); this.renderer.setClearColor( this.scene.fog.color ); });
    ffog.add(this.scene.fog, 'near', 0,3000);
    ffog.add(this.scene.fog, 'far', 100,3000);

    var fstruc = this.gui.addFolder('Structure');
    fstruc.open();
    fstruc.addColor(colors, 'particuleColor').onChange(() => {
      let particules = this.structure.particules;
      for(let i = 0; i < particules.length; i++) {
        particules[i].material.color.setHex(colors.particuleColor);
        particules[i].glow.material.color.setHex(colors.particuleColor);

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
      this.structure.line.mesh2.material.color.setHex(colors.lineColor);
      this.structure.line.mesh.material.color.setHex(colors.lineColor); 

    });

  }

  initPostprocessing() {
    this.renderer.autoClearColor = true;
    this.composer = new WAGNER.Composer(this.renderer);
    this.fxaaPass = new FXAAPass();
    this.boxBlurPass = new BoxBlurPass(1, 3);
    this.bloomPass = new BloomPass({
      blurAmount: 8,
      applyZoomBlur: true
    });
    this.bcPass = new brighContrastPass(0.5,0.5);
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

    if(this.passes.usePostProcessing) {
      this.composer.reset();
      this.composer.render(this.scene, this.camera);

      if(this.passes.useBlur) this.composer.pass(this.boxBlurPass);
      if(this.passes.useBloom) this.composer.pass(this.bloomPass);
      if(this.passes.useFXAA) this.composer.pass(this.fxaaPass);
      if(this.passes.useContrast) this.composer.pass(this.bcPass);

      this.composer.toScreen();
    }
    else {
      this.renderer.render(this.scene, this.camera);
    }

    
    this.stats.end();

  }
}
