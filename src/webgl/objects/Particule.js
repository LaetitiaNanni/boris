'use strict';

import THREE from 'three';
import triangulate from 'delaunay-triangulate';
export default class Particule extends THREE.Object3D {
  constructor() {
    super();

    // var PI2 = Math.PI * 2;
    // var material = new THREE.SpriteCanvasMaterial({

    //   color: 0xffffff,
    //   program: (context) => {
    //     context.beginPath();
    //     context.arc(0, 0, 0.5, 0, PI2, true);
    //     context.fill();
    //   }

    // });

    var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var geometry = new THREE.SphereGeometry(2, 16, 16);

    var geometry2 = new THREE.Geometry();

    // var geometry = new THREE.Geometry();

    var points = [];

    for (var i = 0; i < 100; i++) {

      this.mesh = new THREE.Mesh(geometry, material);

      this.mesh.position.x = Math.random() * 2 - 1;
      this.mesh.position.y = Math.random() * 2 - 1;
      this.mesh.position.z = Math.random() * 2 - 1;
      this.mesh.position.normalize();
      this.mesh.position.multiplyScalar(Math.random() * 10 + 450);

      points[i] = [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];


      this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 10;

      this.add(this.mesh);
      geometry.vertices.push(this.mesh.position);
      geometry2.vertices.push(this.mesh.position);

    }



// var points = [
//   [0, 1],
//   [1, 0],
//   [1, 1],
//   [0, 0],
//   [0.5, 0.5]
// ]

    var triangles = triangulate(points);
    console.log('triangles', triangles);


    this.mesh = new THREE.Line(geometry2, new THREE.LineBasicMaterial({color: 0xffffff, opacity: 0.5}));
    this.add(this.mesh);


    // var triangles = Delaunay.triangulate( vertices );
    // var ctx = document.getElementById('canvas').getContext('2d');
    // ctx.strokeStyle = "red";

    for ( var i = 0; i < triangles.length ; i++ ) {
        var t = triangles[i];
        console.log('COUCOU', t);
        // ctx.beginPath();
        // ctx.moveTo(t.p1.x, t.p1.y);
        // ctx.lineTo(t.p2.x, t.p2.y);
        // ctx.lineTo(t.p3.x, t.p3.y);
        // ctx.lineTo(t.p1.x, t.p1.y);
        // ctx.stroke();
    }



  }

}
