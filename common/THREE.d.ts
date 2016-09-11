declare module THREE {

	// TYPES //

	type Unknown = any;

	interface Geometry {

	}

	// CLASSES //

	class Color {

	}

	class Vector3 {
		x:	number;
		y:	number;
		z:	number;
	}

	class Quaternion {

	}
	
	class Euler {
		order:	string;
		x:		number;
		y:		number;
		z:		number;
	}

	class Matrix3 {

	}

	class Matrix4 {

	}

	class Layers {

	}

	class Object3D {
		add(object: Object3D):	Object3D;
		addEventListener(type: string, listener: Function): void;
		applyMatrix( matrix: Matrix4): void;
		clone(recursive: boolean): Object3D;
		copy(source: Object3D, recursive: boolean): Object3D;
		dispatchEvent(event: Unknown): void;
		getChildByName( name );
		getObjectById( id );
		getObjectByName( name );
		getObjectByProperty( name, value );
		getWorldDirection( optionalTarget );
		getWorldPosition( optionalTarget );
		getWorldQuaternion( optionalTarget );
		getWorldRotation( optionalTarget );
		getWorldScale( optionalTarget );
		hasEventListener( type, listener );
		localToWorld( vector );
		lookAt( vector );
		raycast( );
		remove( object );
		removeEventListener( type, listener );
		renderDepth( value );
		rotateOnAxis( axis, angle );
		rotateX( angle );
		rotateY( angle );
		rotateZ( angle );
		setRotationFromAxisAngle( axis, angle );
		setRotationFromEuler( euler );
		setRotationFromMatrix( m );
		setRotationFromQuaternion( q );
		toJSON( meta );
		translate( distance, axis );
		translateOnAxis( axis, distance );
		translateX( distance );
		translateY( distance );
		translateZ( distance );
		traverse( callback: Function );
		traverseAncestors( callback: Function );
		traverseVisible( callback: Function );
		updateMatrix();
		updateMatrixWorld( force );
		worldToLocal( vector: Vector3 );

		castShadow:				boolean;
		/** (best guess) */
		children:				Object3D[];
		eulerOrder:				"XYZ" | "XZY" | "YXZ" | "YZX" | "ZXY" | "ZYX";
		frustumCulled:			boolean;
		id:						number;
		layers:					Layers;
		matrix:					Matrix4;
		matrixAutoUpdate:		boolean;
		matrixWorld:			Matrix4;
		matrixWorldNeedsUpdate:	boolean;
		modelViewMatrix:		Matrix4;
		name:					string;
		normalMatrix:			Matrix3;
		/** (best guess) */
		parent:					Object3D;
		position:				Vector3;
		quaternion:				Quaternion;
		receiveShadow:			boolean;
		renderOrder:			number;
		rotation:				Euler;
		scale:					Vector3;
		type:					string;
		up:						Vector3;
		useQuaternion:			Quaternion;
		userData:				Object;
		uuid:					string;
		visible:				boolean;
	}

	function ColladaLoader(): any;

	class WebGLRenderer {
		constructor();
		constructor(element: HTMLElement);
		constructor({ antialias: boolean });

		render(x, y);
		setSize(x, y);

		domElement: any;
	}

	class BoxGeometry {
		constructor(x, y, z);
	}

	class Light extends Object3D {
		constructor(color: Color, intensity: number);

		copy(source: Light): Light;

		color:					Color;
		intensity:				number;
		onlyShadow:				Unknown;
		shadowBias:				Unknown;
		shadowCameraBottom:		Unknown;
		shadowCameraFar:		Unknown;
		shadowCameraFov:		Unknown;
		shadowCameraLeft:		Unknown;
		shadowCameraNear:		Unknown;
		shadowCameraRight:		Unknown;
		shadowCameraTop:		Unknown;
		shadowCameraVisible:	Unknown;
		shadowDarkness:			Unknown;
		shadowMapHeight:		Unknown;
		shadowMapWidth:			Unknown;
	}

	class AmbientLight extends Light {
		constructor(x);
	}

	class MeshBasicMaterial {
		constructor(x);
	}

	class MeshNormalMaterial {
		constructor();
	}

	class Camera extends Object3D {
		updateProjectionMatrix();

		aspect: number;
	}

	class Mesh extends Object3D {
		constructor(x, y);
	}

	class LoadingManager {
	}

	class OBJLoader {
		constructor(x: LoadingManager);

		load(url: string, Function): Unknown;
	}

	class Scene extends Object3D {
		constructor();

		autoUpdate: boolean;
		background: Unknown;
	}

	class PerspectiveCamera extends Camera {
		constructor(FOV, AspectRatio, Near, Far);
	}
}