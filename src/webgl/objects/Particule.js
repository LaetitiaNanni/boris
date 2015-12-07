'use strict';

import THREE from 'three';

export default class Particule extends THREE.Object3D {
  constructor() {
    super();

    //var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    var geometry = new THREE.SphereGeometry(2, 16, 16);
    var material = new THREE.MeshLambertMaterial({color: 0xffaa00, shading: THREE.SmoothShading});

    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);

  }

}
