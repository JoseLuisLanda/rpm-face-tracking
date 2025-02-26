import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import { Object3D, Euler } from 'three';
import { useTracking } from './context/FaceTrackingContext';

interface AvatarProps {
  url: string;
}

function Avatar({ url }: AvatarProps) {
  const { blendshapes, rotation } = useTracking();
  const { scene } = useGLTF(url);
  const { nodes } = useGraph(scene);

  const headMeshRef = useRef<Object3D[]>([]);
  const nodeRefs = useRef<Record<string, Object3D>>({});

  useEffect(() => {
    const headMesh: Object3D[] = [];

    if (nodes.Wolf3D_Head) headMesh.push(nodes.Wolf3D_Head);
    if (nodes.Wolf3D_Teeth) headMesh.push(nodes.Wolf3D_Teeth);
    if (nodes.Wolf3D_Beard) headMesh.push(nodes.Wolf3D_Beard);
    if (nodes.Wolf3D_Avatar) headMesh.push(nodes.Wolf3D_Avatar);
    if (nodes.Wolf3D_Head_Custom) headMesh.push(nodes.Wolf3D_Head_Custom);

    const bodyNodes: Record<string, Object3D> = {};
    const bodyPartNames = [
      'Head', 'Neck', 'Spine2',
      'Wolf3D_Shoulder_L', 'Wolf3D_Shoulder_R',
      'Wolf3D_Body',
      'Wolf3D_Arm_L', 'Wolf3D_Arm_R',
      'Wolf3D_Hand_L', 'Wolf3D_Hand_R'
    ];

    bodyPartNames.forEach(name => {
      if (nodes[name]) {
        bodyNodes[name] = nodes[name];
      } else {
        console.warn(`Node ${name} not found in model`);
      }
    });

    headMeshRef.current = headMesh;
    nodeRefs.current = bodyNodes;

    console.log("Available nodes in model:", Object.keys(nodes));

    return () => {
      headMeshRef.current = [];
      nodeRefs.current = {};
    };
  }, [nodes, url]);

  useFrame(() => {
    if (blendshapes && blendshapes.length > 0 && rotation) {
      blendshapes.forEach(element => {
        headMeshRef.current.forEach(mesh => {
          if ((mesh as any).morphTargetDictionary && (mesh as any).morphTargetInfluences) {
            let index = (mesh as any).morphTargetDictionary[element.categoryName];
            if (index >= 0) {
              (mesh as any).morphTargetInfluences[index] = element.score;
            }
          }
        });
      });

      const parts = nodeRefs.current;

      if (parts['Head']) {
        parts['Head'].rotation.set(rotation.x, rotation.y, rotation.z);
      }

      if (parts['Neck']) {
        parts['Neck'].rotation.set(rotation.x / 5 + 0.3, rotation.y / 5, rotation.z / 5);
      }

      if (parts['Spine2']) {
        parts['Spine2'].rotation.set(rotation.x / 10, rotation.y / 10, rotation.z / 10);
      }

      if (parts['Wolf3D_Shoulder_L']) {
        parts['Wolf3D_Shoulder_L'].rotation.set(rotation.x / 15, rotation.y / 15, rotation.z / 15);
      }

      if (parts['Wolf3D_Shoulder_R']) {
        parts['Wolf3D_Shoulder_R'].rotation.set(rotation.x / 15, rotation.y / 15, rotation.z / 15);
      }

      if (parts['Wolf3D_Body']) {
        parts['Wolf3D_Body'].rotation.set(rotation.x / 20, rotation.y / 20, rotation.z / 20);
      }

      if (parts['Wolf3D_Arm_L']) {
        parts['Wolf3D_Arm_L'].rotation.set(rotation.x / 25, rotation.y / 25, rotation.z / 25);
      }

      if (parts['Wolf3D_Arm_R']) {
        parts['Wolf3D_Arm_R'].rotation.set(rotation.x / 25, rotation.y / 25, rotation.z / 25);
      }

      if (parts['Wolf3D_Hand_L']) {
        parts['Wolf3D_Hand_L'].rotation.set(rotation.x / 30, rotation.y / 30, rotation.z / 30);
      }

      if (parts['Wolf3D_Hand_R']) {
        parts['Wolf3D_Hand_R'].rotation.set(rotation.x / 30, rotation.y / 30, rotation.z / 30);
      }
    }
  });

  return <primitive object={scene} position={[0, -1.75, 3]} />;
}

export default Avatar;