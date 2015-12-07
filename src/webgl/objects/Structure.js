'use strict';

import THREE from 'three';
import triangulate from 'delaunay-triangulate';
import Complex from 'three-simplicial-complex';
import top from 'simplicial-complex';
import '../shaders/FresnelShader';

// objects
import Particule from './Particule';



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


    this.triangles = triangulate(this.positions);

    this.sc = {
        positions: this.positions,
        cells: top.unique(top.skeleton(this.triangles, 3))
    };

    this.cpl = Complex(THREE);
    this.complex = this.cpl(this.sc);

    var material2 = new THREE.MeshLambertMaterial({color: 0x2222ff, wireframe: true, fog: true, wireframeLinewidth: 2 });


    this.mesh3 = new THREE.Mesh(this.complex, material2);
    //this.mesh3 = new THREE.Line(this.complex, new THREE.LineBasicMaterial({color: 0xff00ff, opacity: 0.5}));

    this.add(this.mesh3);

  }

  update(t) {
    for (var i = 0; i < this.particules.length; i++) {
      var sphere = this.particules[i];
      sphere.position.x = 650 * Math.cos(t + i);
      sphere.position.y = 650 * Math.sin(t + i * 1.1);
      this.positions[i] = [sphere.position.x, sphere.position.y, sphere.position.z];
    }
    this.updateDelaunay(this.positions);
  }

  updateDelaunay(points) {

    this.triangles = triangulate(points);

    this.sc = {
        positions: points,
        cells: top.unique(top.skeleton(this.triangles, 2))
        // cells: this.triangles
    };

    this.complex = this.cpl(this.sc);

    this.mesh3.geometry = this.complex;
  }
}
