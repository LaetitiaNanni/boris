'use strict';

import THREE from 'three';
import '../shaders/FresnelShader';

export default class Diamond extends THREE.Object3D {
  constructor() {
    super();

    // var path = 'assets/textures/cube/MilkyWay/dark-s_';
    // var urls = [path + 'px.jpg', path + 'nx.jpg', path + 'py.jpg', path + 'ny.jpg', path + 'pz.jpg', path + 'nz.jpg'];
    // var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);




    // uniforms[ "tCube" ].value = textureCube;

    this.cubeCamera = new THREE.CubeCamera( 0.9, 40000, 512 );
    this.cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    this.add( this.cubeCamera );

    this.material = new THREE.MeshLambertMaterial({
      color: 0x060f37,
      emissive: 0xf0f0ff,
      envMap: this.cubeCamera.renderTarget, 
      refractionRatio: 0.98, 
      reflectivity: 0.98, 
      transparent: true, 
      opacity: 0.5
    });
    // var shader = THREE.FresnelShader;
    // var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    // uniforms[ "tCube" ].value = this.cubeCamera.renderTarget; 
    // var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, transparent: true, opacity: 0.5 };
    // this.material = new THREE.ShaderMaterial( parameters );
    
    this.geometry = new THREE.SphereGeometry(300, 8, 8);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.scale.set(15,15,15); 
    this.add(this.mesh);


    // ///create cubecamera for making "skybox pictures"

    // this.refractGemCamera = new THREE.CubeCamera( 0.9, 40, 12 ); //a low resolution, like 256 or lower is recommended for a scene with many cameras.
    // this.add( this.refractGemCamera );
    
    // //set rendertarget for camera to three.cuberefractionmapping
    // this.refractGemCamera.renderTarget.mapping = THREE.CubeRefractionMapping;


    //     uniforms[ "tCube" ].value = this.refractGemCamera.renderTarget; 
    //     var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms,envMap: this.refractGemCamera.renderTarget};
    //     var material2 = new THREE.ShaderMaterial( parameters );

    //     //setup mesh#2  using material#2
    //     this.refractGem = new THREE.Mesh( this.geometry, material2 );
    //     this.refractGem.position.set(1500,2500,-1500);
    //     this.refractGem.scale.set(15,15,15); 
    //     console.log('', this.refractGemCamera.position, this.refractGem.position);

        this.cubeCamera.position.x = this.mesh.position.x;            
        this.cubeCamera.position.y = this.mesh.position.y;            
        this.cubeCamera.position.Z = this.mesh.position.Z;            

    //     this.add(this.refractGem );




  }
  update(renderer, scene) {
    this.cubeCamera.updateCubeMap( renderer, scene );
  }

}
