"use client";

import React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from '@react-three/drei';
import { Object3D } from 'three';

interface ModelViewerProps {
  modelPath: string;
}

const Model: React.FC<{ path: string }> = ({ path }) => {
  // Determine the file extension
  const fileExtension = path.split('.').pop()?.toLowerCase();

  // Select the loader based on the file extension
  const loader =
    fileExtension === 'fbx'
      ? FBXLoader
      : fileExtension === 'obj'
      ? OBJLoader
      : ColladaLoader;

  const loadedModel = useLoader(loader, path);

  return <primitive object={loadedModel as Object3D} />;
};

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath }) => {
  return (
    <Canvas style={{ height: '500px', width: '100%' }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Model path={modelPath} />
      <OrbitControls />
    </Canvas>
  );
};

export default ModelViewer;
