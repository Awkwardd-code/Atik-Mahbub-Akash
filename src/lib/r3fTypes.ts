// React Three Fiber type extensions
// Import compatibility fix first
import './reactThreeCompat';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend fiber to include common THREE elements
extend({
  Group: THREE.Group,
  Mesh: THREE.Mesh,
  PlaneGeometry: THREE.PlaneGeometry,
  BoxGeometry: THREE.BoxGeometry,
  SphereGeometry: THREE.SphereGeometry,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  AmbientLight: THREE.AmbientLight,
  DirectionalLight: THREE.DirectionalLight,
  SpotLight: THREE.SpotLight,
  PointLight: THREE.PointLight,
  HemisphereLight: THREE.HemisphereLight,
  PerspectiveCamera: THREE.PerspectiveCamera,
  OrthographicCamera: THREE.OrthographicCamera,
  Scene: THREE.Scene,
});

// Export for components that need to use it
export { extend };
