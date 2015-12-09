'use strict';

import THREE from 'three';
import Complex from 'three-simplicial-complex';
import triangulate from 'delaunay-triangulate';
import top from 'simplicial-complex';
import * as colors from '../config/colors';

export default class Line extends THREE.Object3D {
  constructor(points) {
    super();

    this.points = points;
    this.triangles = triangulate(this.points);
    this.materials = [];

    this.sc = {
        positions: this.points,
        cells: top.unique(top.skeleton(this.triangles, 3))
    };

    this.cpl = Complex(THREE);
    this.complex = this.cpl(this.sc);

    this.materials.push(new THREE.MeshLambertMaterial({color: colors.lineColor, wireframe: true, fog: true, wireframeLinewidth: 2}));
    this.materials.push(new THREE.MeshLambertMaterial({color: colors.lineColor, wireframe: false, fog: true, transparent: true, opacity: 0.1}));

    this.mesh = new THREE.Mesh(this.complex, this.materials[0]);
    this.mesh2 = new THREE.Mesh(this.complex, this.materials[1]);

    //this.mesh3 = new THREE.Line(this.complex, new THREE.LineBasicMaterial({color: 0xff00ff, opacity: 0.5}));
    this.add(this.mesh);    
    // this.add(this.mesh2);

  }

  update(points, delaunay) {
    this.points = points;

    if (delaunay) {
      this.triangles = top.unique(top.skeleton(triangulate(this.points), 3));
    }

    this.sc = {
        positions: this.points,
        cells: this.triangles
    };

    this.complex = this.cpl(this.sc);
    this.mesh.geometry = this.complex;
    this.mesh2.geometry = this.complex;

  }
}
