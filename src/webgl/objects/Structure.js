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
    this.interval = 0.1;
    this.startT = 0.0001 * Date.now();

    for (var i = 0; i < 100; i++) {

      this.particule = new Particule();

      this.particule.position.x = Math.random() * 2 - 1;
      this.particule.position.y = Math.random() * 2 - 1;
      this.particule.position.z = Math.random() * 2 - 1;
      this.particule.position.normalize();
      this.particule.position.multiplyScalar(Math.random() * 10 + 650);
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

  animate() {
    let scalar = 50 + 650;

    for (var i = 0; i < this.particules.length; i++) {
      let sphere = this.particules[i];
      let newPos = sphere.position.clone();
      newPos.normalize().multiplyScalar(scalar);

      console.log( this.positions[i], newPos, scalar);
      
      var tl = new TimelineMax({repeat:20, yoyo: true});

      tl.fromTo(sphere.position, 0.8,
        {
          x: this.positions[i][0],
          y: this.positions[i][1],
          z: this.positions[i][2]
        }, 
        {
          x: newPos.x,
          y: newPos.y,
          z: newPos.z,
          ease: Cubic.easeInOut
        }
      ,0);

    }
    tl.fromTo(this.line.position, 0.8,
      {
        x: this.positions[i][0],
        y: this.positions[i][1],
        z: this.positions[i][2]
      }, 
      {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        ease: Cubic.easeInOut
      }
    ,0);

  }

  update(t) {

    for (var i = 0; i < this.particules.length; i++) {
      var sphere = this.particules[i];
      sphere.position.x = 650 * Math.cos(t + i);
      sphere.position.z = 650 * Math.sin(t + i * 1.1);
      this.positions[i] = [sphere.position.x, sphere.position.y, sphere.position.z];
    }

  // console.log((t - this.startT) + 'ms elapsed');

    if ((t - this.startT) >= this.interval) {
      this.line.update(this.positions, true);
      this.startT = t;
    } else {
      this.line.update(this.positions);
    }

  }
}
