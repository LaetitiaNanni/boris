'use strict';

import THREE from 'three';
import triangulate from 'delaunay-triangulate';
import Complex from 'three-simplicial-complex';
import top from 'simplicial-complex';

export default class Particule extends THREE.Object3D {
  constructor() {
    super();

    this.particules = [];
    this.positions = [];

    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    var geometry = new THREE.SphereGeometry(2, 16, 16);


    for (var i = 0; i < 50; i++) {

      this.mesh = new THREE.Mesh(geometry, material);

      this.mesh.position.x = Math.random() * 2 - 1;
      this.mesh.position.y = Math.random() * 2 - 1;
      this.mesh.position.z = Math.random() * 2 - 1;
      this.mesh.position.normalize();
      this.mesh.position.multiplyScalar(Math.random() * 10 + 850);

      this.positions[i] = [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];


      this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 10;

      this.add(this.mesh);
      // geometry.vertices.push(this.mesh.position);
      this.particules.push(this.mesh);
    }


    var triangles = triangulate(this.positions);
    // console.log('triangles', triangles);

    var sc = {
        positions: this.positions,
        cells: top.unique(top.skeleton(triangles, 3))
    };

    var cpl = Complex(THREE);
    var complex = cpl(sc);

    var material2 = new THREE.MeshDepthMaterial({color: 0x222222, wireframe: true, shading: THREE.SmoothShadin, wireframeLinewidth: 2 });


    // this.mesh3 = THREE.SceneUtils.createMultiMaterialObject(complex, [
    //   // new THREE.MeshLambertMaterial({color: 0xffffff}),
    //   new THREE.MeshBasicMaterial({color: 0x222222, wireframe: true})
    // ]);


    this.mesh3 = new THREE.Mesh(complex, material2);
    this.mesh2 = new THREE.Line(complex, new THREE.LineBasicMaterial({color: 0xff00ff, opacity: 0.5}));

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


    var triangles = triangulate(points);
    console.log('triangles');

    var sc = {
        positions: points,
        cells: top.unique(top.skeleton(triangles, 3))
    };

    var cpl = Complex(THREE);
    var complex = cpl(sc);

    this.mesh3.geometry = complex;
  }
}
