import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Euler, Matrix4 } from 'three';
import { FaceLandmarker, FaceLandmarkerOptions, FilesetResolver } from "@mediapipe/tasks-vision";

// Definimos la forma de nuestro contexto
type FaceTrackingContextType = {
  blendshapes: any[];
  rotation: Euler;
  isTracking: boolean;
};

// Inicializamos con valores por defecto
const defaultContextValue: FaceTrackingContextType = {
  blendshapes: [],
  rotation: new Euler(0, 0, 0),
  isTracking: false,
};

// Creamos el contexto
const FaceTrackingContext = createContext<FaceTrackingContextType>(defaultContextValue);

export const FaceTrackingProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [, forceUpdate] = useState({});
  const blendshapesRef = useRef<any[]>([]);
  const rotationRef = useRef<Euler>(new Euler());

  // Variables que no necesitan estar en el estado
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  // Opciones para el FaceLandmarker
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

  // Función de inicialización
  const setup = async () => {
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, options);

      // Usamos setTimeout para asegurarnos de que el elemento de video ya esté en el DOM
      setTimeout(() => {
        videoRef.current = document.getElementById("video") as HTMLVideoElement;

        if (!videoRef.current) {
          console.error("Video element not found");
          return;
        }

        navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        }).then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener("loadeddata", () => {
              predict();
              setIsTracking(true);
            });
          }
        }).catch(error => {
          console.error("Error accessing camera:", error);
        });

        console.log("MediaPipe Face Landmarker initialized successfully");
      }, 500);
      
    } catch (error) {
      console.error("Error setting up face tracking:", error);
    }
  };

  // Función para la detección facial
  const predict = async () => {
    if (!faceLandmarkerRef.current || !videoRef.current) {
      requestAnimationFrame(predict);
      return;
    }

    let nowInMs = Date.now();
    if (lastVideoTimeRef.current !== videoRef.current.currentTime) {
      lastVideoTimeRef.current = videoRef.current.currentTime;

      try {
        const faceLandmarkerResult = faceLandmarkerRef.current.detectForVideo(videoRef.current, nowInMs);

        if (
          faceLandmarkerResult.faceBlendshapes &&
          faceLandmarkerResult.faceBlendshapes.length > 0 &&
          faceLandmarkerResult.faceBlendshapes[0].categories
        ) {
          blendshapesRef.current = faceLandmarkerResult.faceBlendshapes[0].categories;

          if (
            faceLandmarkerResult.facialTransformationMatrixes &&
            faceLandmarkerResult.facialTransformationMatrixes.length > 0
          ) {
            const matrix = new Matrix4().fromArray(
              faceLandmarkerResult.facialTransformationMatrixes[0].data
            );
            rotationRef.current = new Euler().setFromRotationMatrix(matrix);

            // Force re-render approx 30 times per second, not on every frame
            if (Date.now() % 33 < 16) {
              forceUpdate({});
            }
          }
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    }

    requestAnimationFrame(predict);
  };

  // Configurar el tracking al montar el componente
  useEffect(() => {
    setup();

    return () => {
      // Cleanup function
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Valor del contexto
  const contextValue = {
    blendshapes: blendshapesRef.current,
    rotation: rotationRef.current,
    isTracking,
  };

  return (
    <FaceTrackingContext.Provider value={contextValue}>
      {children}
    </FaceTrackingContext.Provider>
  );
};

// Hook personalizado para facilitar el uso del contexto
export const useTracking = () => {
  const context = useContext(FaceTrackingContext);
  if (!context) {
    throw new Error(
      "useTracking debe ser usado dentro de un FaceTrackingProvider"
    );
  }
  return context;
};