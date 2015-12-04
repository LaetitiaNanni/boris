'use strict';

import THREE from 'three';

export default class Line extends THREE.Object3D {
  constructor() {
    super();
    var geometry = new THREE.Geometry();

    this.mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xffffff, opacity: 0.5}));
    this.add(this.mesh);
  }
}
