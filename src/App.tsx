import './App.css';
import imageback from './imageback.png';

import { useEffect, useState, useRef } from 'react';
import { FaceLandmarker, FaceLandmarkerOptions, FilesetResolver } from "@mediapipe/tasks-vision";
import { Color, Euler, Matrix4, Object3D } from 'three';
import { Canvas, useFrame, useGraph } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';

let video: HTMLVideoElement;
let faceLandmarker: FaceLandmarker;
let lastVideoTime = -1;
let blendshapes: any[] = [];
let rotation: Euler;

const options: FaceLandmarkerOptions = {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
    delegate: "GPU"
  },
  numFaces: 1,
  runningMode: "VIDEO",
  outputFaceBlendshapes: true,
  outputFacialTransformationMatrixes: true,
};

function Avatar({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { nodes } = useGraph(scene);
  
  // Use refs to store node references
  const headMeshRef = useRef<Object3D[]>([]);
  const nodeRefs = useRef<Record<string, Object3D>>({});
  
  // Initialize rotation if it doesn't exist
  if (!rotation) {
    rotation = new Euler(0, 0, 0);
  }

  useEffect(() => {
    // Store references to all nodes we need to animate
    const headMesh: Object3D[] = [];
    
    // Collect head meshes for morphTargets
    if (nodes.Wolf3D_Head) headMesh.push(nodes.Wolf3D_Head);
    if (nodes.Wolf3D_Teeth) headMesh.push(nodes.Wolf3D_Teeth);
    if (nodes.Wolf3D_Beard) headMesh.push(nodes.Wolf3D_Beard);
    if (nodes.Wolf3D_Avatar) headMesh.push(nodes.Wolf3D_Avatar);
    if (nodes.Wolf3D_Head_Custom) headMesh.push(nodes.Wolf3D_Head_Custom);
    
    // Store references to body parts
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
    
    // Store refs
    headMeshRef.current = headMesh;
    nodeRefs.current = bodyNodes;
    
    // Log available nodes for debugging
    console.log("Available nodes in model:", Object.keys(nodes));
    
    return () => {
      // Cleanup
      headMeshRef.current = [];
      nodeRefs.current = {};
    };
  }, [nodes, url]);

  useFrame(() => {
    // Apply blendshapes for facial expressions
    if (blendshapes.length > 0) {
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
      
      // Apply rotations to body parts
      const parts = nodeRefs.current;
      
      // Head rotation - full effect
      if (parts['Head']) {
        parts['Head'].rotation.set(rotation.x, rotation.y, rotation.z);
      }
      
      // Neck rotation - reduced effect
      if (parts['Neck']) {
        parts['Neck'].rotation.set(rotation.x / 5 + 0.3, rotation.y / 5, rotation.z / 5);
      }
      
      // Spine rotation - subtle effect
      if (parts['Spine2']) {
        parts['Spine2'].rotation.set(rotation.x / 10, rotation.y / 10, rotation.z / 10);
      }
      
      // Shoulders rotation
      if (parts['Wolf3D_Shoulder_L']) {
        parts['Wolf3D_Shoulder_L'].rotation.set(rotation.x / 15, rotation.y / 15, rotation.z / 15);
      }
      
      if (parts['Wolf3D_Shoulder_R']) {
        parts['Wolf3D_Shoulder_R'].rotation.set(rotation.x / 15, rotation.y / 15, rotation.z / 15);
      }
      
      // Body rotation - very subtle
      if (parts['Wolf3D_Body']) {
        parts['Wolf3D_Body'].rotation.set(rotation.x / 20, rotation.y / 20, rotation.z / 20);
      }
      
      // Arms rotation
      if (parts['Wolf3D_Arm_L']) {
        parts['Wolf3D_Arm_L'].rotation.set(rotation.x / 25, rotation.y / 25, rotation.z / 25);
      }
      
      if (parts['Wolf3D_Arm_R']) {
        parts['Wolf3D_Arm_R'].rotation.set(rotation.x / 25, rotation.y / 25, rotation.z / 25);
      }
      
      // Hands rotation
      if (parts['Wolf3D_Hand_L']) {
        parts['Wolf3D_Hand_L'].rotation.set(rotation.x / 30, rotation.y / 30, rotation.z / 30);
      }
      
      if (parts['Wolf3D_Hand_R']) {
        parts['Wolf3D_Hand_R'].rotation.set(rotation.x / 30, rotation.y / 30, rotation.z / 30);
      }
    }
  });

  return <primitive object={scene} position={[0, -1.75, 3]} />
}

function App() {
  const [url, setUrl] = useState<string>("https://models.readyplayer.me/67be99147e1ad1bd7ca8d376.glb?morphTargets=ARKit&textureAtlas=1024");
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([imageback]);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState<number>(0);
  const [isCollapsibleVisible, setIsCollapsibleVisible] = useState<boolean>(false);
  const [isLeftCollapsibleVisible, setIsLeftCollapsibleVisible] = useState<boolean>(false);
  const [imageArrays, setImageArrays] = useState<{ [key: string]: string[] }>({});
  const [visibleArrayButtons, setVisibleArrayButtons] = useState<{ [key: string]: boolean }>({});
  
  const { getRootProps } = useDropzone({
    onDrop: files => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUrl(reader.result as string);
        setIsModelLoaded(true);
      }
      reader.readAsDataURL(file);
    }
  });

  const setup = async () => {
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, options);

      video = document.getElementById("video") as HTMLVideoElement;
      
      if (!video) {
        console.error("Video element not found");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      
      video.srcObject = stream;
      video.addEventListener("loadeddata", () => {
        predict();
        setIsTracking(true);
      });
      
      console.log("MediaPipe Face Landmarker initialized successfully");
    } catch (error) {
      console.error("Error setting up face tracking:", error);
    }
  }

  const predict = async () => {
    if (!faceLandmarker || !video) {
      requestAnimationFrame(predict);
      return;
    }
    
    let nowInMs = Date.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      
      try {
        const faceLandmarkerResult = faceLandmarker.detectForVideo(video, nowInMs);

        if (faceLandmarkerResult.faceBlendshapes && 
            faceLandmarkerResult.faceBlendshapes.length > 0 && 
            faceLandmarkerResult.faceBlendshapes[0].categories) {
          
          blendshapes = faceLandmarkerResult.faceBlendshapes[0].categories;

          if (faceLandmarkerResult.facialTransformationMatrixes && 
              faceLandmarkerResult.facialTransformationMatrixes.length > 0) {
            
            const matrix = new Matrix4().fromArray(faceLandmarkerResult.facialTransformationMatrixes[0].data);
            rotation = new Euler().setFromRotationMatrix(matrix);
          }
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    }

    requestAnimationFrame(predict);
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = `${event.target.value}?morphTargets=ARKit&textureAtlas=1024`;
    setUrl(newUrl);
    setIsModelLoaded(true);
  }

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newBackgroundImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newBackgroundImages.push(reader.result as string);
          if (newBackgroundImages.length === files.length) {
            setBackgroundImages(newBackgroundImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageArrayChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImageArrays(prev => ({ ...prev, [key]: newImages }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleArrayClick = (key: string) => {
    if (imageArrays[key]) {
      setBackgroundImages(imageArrays[key]);
      setCurrentBackgroundIndex(0);
    }
  };

  const toggleArrayButtons = (key: string) => {
    setVisibleArrayButtons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addNewArray = () => {
    const newKey = `Array ${Object.keys(imageArrays).length + 1}`;
    setImageArrays(prev => ({ ...prev, [newKey]: [] }));
    setVisibleArrayButtons(prev => ({ ...prev, [newKey]: false }));
  };

  const removeLastArray = () => {
    const keys = Object.keys(imageArrays);
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      setImageArrays(prev => {
        const newArrays = { ...prev };
        delete newArrays[lastKey];
        return newArrays;
      });
      setVisibleArrayButtons(prev => {
        const newVisible = { ...prev };
        delete newVisible[lastKey];
        return newVisible;
      });
    }
  };

  useEffect(() => {
    setup();
    document.getElementById('root')!.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
    
    return () => {
      // Cleanup function
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages]);

  useEffect(() => {
    document.getElementById('root')!.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
  }, [currentBackgroundIndex, backgroundImages]);

  return (
    <div className="App">
      <div className="button-container">
        <button id='btnShowDiv' onClick={() => setIsCollapsibleVisible(!isCollapsibleVisible)}>
          {isCollapsibleVisible ? 'Hide Info' : 'Show Info'}
        </button>
        <button onClick={() => document.getElementById('backgroundInput')?.click()}>Change Background</button>
        <button onClick={() => setIsLeftCollapsibleVisible(!isLeftCollapsibleVisible)}>
          {isLeftCollapsibleVisible ? 'Hide Image Controls' : 'Show Image Controls'}
        </button>
      </div>

      <div className={`collapsible-left-container ${isLeftCollapsibleVisible ? 'show' : ''}`}>
        <div className="image-array-container">
          {Object.keys(imageArrays).map(key => (
            <div key={key} className="image-array">
              <p>{key}</p>
              <input id={`file-input-${key}`} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleImageArrayChange(key, e)} />
              <button onClick={() => (document.getElementById(`file-input-${key}`) as HTMLInputElement)?.click()}>Add Images</button>
              <button onClick={() => handleArrayClick(key)}>Set as Background</button>
            </div>
          ))}
          <button onClick={addNewArray}>Add New Array</button>
          <button onClick={removeLastArray}>Remove Last Array</button>
        </div>
      </div>
      
      <div className={`collapsible-container ${isCollapsibleVisible ? 'show' : ''}`}>
        <div id="presentation">
          <p>Presentation content goes here...</p>
        </div>
        
        <div id="status-container" className="status-container">
          <div className={`status-indicator ${isTracking ? 'active' : ''}`}>
            {isTracking ? 'Tracking Active' : 'Initializing Tracking...'}
          </div>
          <div className={`status-indicator ${isModelLoaded ? 'active' : ''}`}>
            {isModelLoaded ? 'Model Loaded' : 'Default Model'}
          </div>
        </div>
        <div {...getRootProps({ className: 'dropzone' })}>
          <p>Drag & drop RPM avatar GLB file here</p>
        </div>
        <input className='url' type="text" placeholder="Paste RPM avatar URL" onChange={handleOnChange} />
      </div>
      
      <video className='camera-feed' id="video" autoPlay playsInline muted></video>
      
      <div className="canvas-container">
        <Canvas camera={{ fov: 25 }} shadows>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color={new Color(1, 1, 0)} intensity={0.5} castShadow />
          <pointLight position={[-10, 0, 10]} color={new Color(1, 0, 0)} intensity={0.5} castShadow />
          <pointLight position={[0, 0, 10]} intensity={0.5} castShadow />
          <Avatar url={url} />
        </Canvas>
      </div>
      
      <input id="backgroundInput" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleBackgroundChange} />
      
      <img className='logo' src="./logo.png" alt="Logo" />
    </div>
  );
}

export default App;