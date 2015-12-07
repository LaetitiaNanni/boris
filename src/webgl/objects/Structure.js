'use strict';

import THREE from 'three';
import '../shaders/FresnelShader';

// objects
import Particule from './Particule';
import Line from './Line';



export default class Structure extends THREE.Object3D {
  constructor() {
    super();

    this.particules = [];
    this.positions = [];


    for (var i = 0; i < 50; i++) {

      this.particule = new Particule();

      this.particule.position.x = Math.random() * 2 - 1;
      this.particule.position.y = Math.random() * 2 - 1;
      this.particule.position.z = Math.random() * 2 - 1;
      this.particule.position.normalize();
      this.particule.position.multiplyScalar(Math.random() * 10 + 850);
      this.particule.scale.set(10,10,10);

      this.positions[i] = [this.particule.position.x, this.particule.position.y, this.particule.position.z];

      // this.glow.scale.x = this.glow.scale.y = this.glow.scale.z = 10;
      this.add(this.particule);
      // this.add(this.glow);
      // geometry.vertices.push(this.particule.position);
      this.particules.push(this.particule);
    }


    this.line = new Line(this.positions);
    this.add(this.line);

  }

  update(t) {
    for (var i = 0; i < this.particules.length; i++) {
      var sphere = this.particules[i];
      sphere.position.x = 650 * Math.cos(t + i);
      sphere.position.y = 650 * Math.sin(t + i * 1.1);
      this.positions[i] = [sphere.position.x, sphere.position.y, sphere.position.z];
    }
    this.line.update(this.positions);

  }
}
