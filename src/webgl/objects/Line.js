'use strict';

import THREE from 'three';
import Complex from 'three-simplicial-complex';
import triangulate from 'delaunay-triangulate';
import top from 'simplicial-complex';

export default class Line extends THREE.Object3D {
  constructor(points) {
    super();

    this.points = points;
    this.triangles = triangulate(this.points);

    this.sc = {
        positions: this.points,
        cells: top.unique(top.skeleton(this.triangles, 3))
    };

    this.cpl = Complex(THREE);
    this.complex = this.cpl(this.sc);

    this.material = new THREE.MeshLambertMaterial({color: 0x2222ff, wireframe: true, fog: true, wireframeLinewidth: 2 });
    this.mesh = new THREE.Mesh(this.complex, this.material);
    //this.mesh3 = new THREE.Line(this.complex, new THREE.LineBasicMaterial({color: 0xff00ff, opacity: 0.5}));

    this.add(this.mesh);
  }

  update(points) {
    this.points = points;
    this.triangles = triangulate(this.points);

    this.sc = {
        positions: this.points,
        cells: top.unique(top.skeleton(this.triangles, 2))
        // cells: this.triangles
    };

    this.complex = this.cpl(this.sc);
    this.mesh.geometry = this.complex;
  }
}
