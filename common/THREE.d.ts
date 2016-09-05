declare module THREE {

    interface Geometry {
        
    }

    class Object3D {
        position : any;
        rotation : any;
        scale    : any;
    }

    class WebGLRenderer {
        constructor();
        constructor(element: HTMLElement);
        
        render (x, y);
        
        domElement : any;
    }
               
    class BoxGeometry{
        constructor(x, y, z);
    }
    
    class AmbientLight{
        constructor(x);
    }

    class MeshBasicMaterial{
        constructor(x);
    }
         
    class MeshNormalMaterial{
        constructor();        
    }

    class Camera extends Object3D{
    }
                
    class Mesh extends Object3D{
        constructor(x, y);
    }

    class LoadingManager{
    }
    
    class OBJLoader{
        constructor(x : LoadingManager);
    }

    class Scene{
        constructor();
    }

    class PerspectiveCamera extends Camera{
        constructor(FOV, AspectRatio, Near, Far);
    }

}

//declare var THREE: Three.ThreeStatic;