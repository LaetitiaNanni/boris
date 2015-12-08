'use strict';

import THREE from 'three';
// import glslify from 'glslify';

var glslify = require('glslify');

export default class Particule extends THREE.Object3D {
  constructor() {
    super();

    //var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    var geometry = new THREE.SphereGeometry(2, 64, 64);
    this.material = new THREE.MeshLambertMaterial({color: 0xffaa00, shading: THREE.SmoothShading});


  // this.material = new THREE.ShaderMaterial({
  //   uniforms: {
  //     tMatCap: {type: 't', value: THREE.ImageUtils.loadTexture('assets/textures/matcap2.jpg')}
  //   },
  //   // fog: true,
  //   vertexShader: glslify('../shaders/mat2-vs.glsl'),
  //   fragmentShader: glslify('../shaders/mat2-fs.glsl'),
  //   shading: THREE.SmoothShading
  // });
  // this.material.uniforms.tMatCap.value.wrapS = this.material.uniforms.tMatCap.value.wrapT = THREE.ClampToEdgeWrapping;

  this.mesh = new THREE.Mesh(geometry, this.material);
  this.add(this.mesh);


  // var customMaterial = new THREE.ShaderMaterial(
  // {
  //   uniforms: {
  //     'c': {type: 'f', value: 0},
  //     'p': {type: 'f', value: 4.0}
  //   },
  //   vertexShader: glslify('../shaders/particule-vs.glsl'),
  //   fragmentShader: glslify('../shaders/particule-fs.glsl'),
  //   // side: THREE.FrontSide,
  //   blending: THREE.AdditiveBlending,
  //   transparent: true,
  //   // fog: true
  // });
  var gmaterial = new THREE.MeshLambertMaterial({color: 0xffaa00, transparent: true, fog: true, opacity: 0.1});


  this.glow = new THREE.Mesh(this.mesh.geometry.clone(), gmaterial.clone());
  this.glow.positions = this.mesh.positions;
  this.glow.scale.multiplyScalar(1.4);
  this.add(this.glow);


  }

}
