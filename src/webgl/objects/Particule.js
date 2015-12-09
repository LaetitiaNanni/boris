'use strict';

import THREE from 'three';
import * as colors from '../config/colors';

var glslify = require('glslify');

export default class Particule extends THREE.Object3D {
  constructor() {
    super();

    var geometry = new THREE.SphereGeometry(2, 64, 64);
    this.material = new THREE.MeshLambertMaterial({color: colors.particuleColor});
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.add(this.mesh);

    var gmaterial = new THREE.MeshLambertMaterial({color: colors.particuleColor, transparent: true, fog: true, opacity: 0.2});
    this.glow = new THREE.Mesh(this.mesh.geometry.clone(), gmaterial.clone());
    this.glow.positions = this.mesh.positions;
    this.glow.scale.multiplyScalar(1.4);
    this.add(this.glow);


  }

}
