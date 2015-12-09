'use strict';

import domready from 'domready';
import Detector from './webgl/three/Detector';
import App from './App';

import 'gsap';


let app;

domready(() => {
  if (Detector.webgl) {
    app = new App(document.querySelector('.webgl'));
  } else {
    // fallback here
  }
});
