'use strict';

import THREE from 'three';
import '../shaders/FresnelShader';

export default class Sky extends THREE.Object3D {
  constructor() {
    super();

    var path = 'assets/textures/cube/MilkyWay/dark-s_';
    var urls = [path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg'];
    
    var imagePrefix = "assets/textures/cube/MilkyWay/dark-s_";
    var directions  = ["px", "nx", "py", "ny", "pz", "nz"];
    var imageSuffix = ".jpg";

  this.geometry = new THREE.BoxGeometry( 50000, 50000, 50000 );   
  var materialArray = [];
  
  for (var i = 0; i < 6; i++) {

    materialArray.push( new THREE.MeshLambertMaterial(
    {
      map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
      side: THREE.BackSide  
    }));
  }

  this.skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  this.skyBox = new THREE.Mesh( this.geometry, this.skyMaterial );
  this.add( this.skyBox );


  }
}