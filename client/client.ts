/**********************************************************************

Copyright (c) 2015 - 2016 Brawl

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**********************************************************************/

module Brawl {

	// CONSTANTS //

	export const enum GAMEINPUTMESSAGES {
		GIME_Forward,
		GIME_Backward,
		GIME_Right,
		GIME_Left,
		GIME_Jump,
	}

	// INTERFACES //

	interface SceneObject{
		Node   : THREE.Object3D;
	}

	// CLASSES //

	class GameInputMessage {
		KC:		GAMEINPUTMESSAGES;
		State:	number;
	}
		
	class GameInputHandler {
	}

	class GameStaticObject{
		Object : THREE.Geometry;
		Node   : THREE.Object3D;
	}
	
	class GameCamera{
		Camera : THREE.Camera;
		Node   : THREE.Object3D;
	}

	class GameScene {
		constructor(){
			this.ThreeScene = new THREE.Scene();	
			this.Manager	= new THREE.LoadingManager();
			this.Loader 	= new THREE.OBJLoader(this.Manager);
			
			var Light = new THREE.AmbientLight(0x101030);
			this.ThreeScene.add(Light);
		}
		
		Objects: SceneObject[] = [];
		
		ThreeScene: any;
		Loader: 	any;
		Manager: 	any;

		AddObject(Obj){
			console.log("Adding Object to Scene!");
			console.log(Obj);
			
			this.Objects.push(Obj);
			this.ThreeScene.add(Obj.Node);
		}

		AddCamera(AspectRatio, Near, Far) : GameCamera {
			var C 	 = new GameCamera;
			C.Camera = new THREE.PerspectiveCamera(75, AspectRatio, Near, Far);
			C.Node   = C.Camera;
			
			return C;
		}

	}

	class GamePlayModel {
		
	}

	class ClientEngine {
		Handler : GameInputHandler;

		Scene : GameScene;

		Renderer : THREE.WebGLRenderer;

		AnimationHandle: number;

		Gamepads: Gamepad[] = [];

		ActiveCamera : GameCamera;

		connect_controller(event: any){
		}
		
		disconnect_controller(event: any){
		}
		
		init(width: number, height: number){
			this.Scene	  		= new GameScene;
			this.Renderer 		= new THREE.WebGLRenderer();

			document.body.appendChild( this.Renderer.domElement );
			
			console.log( "" + width/height  + " : Aspect Ratio");
			console.log( "" + height 		+ " : Height");
			console.log( "" + width 		+ " : Width");
			
			this.ActiveCamera 	= this.Scene.AddCamera(Math.min(width/height, 20), 
													   0.1, 10000.0);
			
			this.ActiveCamera.Node.position.z = 5;
			
			//this.AddCube();
			this.AddObj("head.obj");
		}

		AddCube(){
			var object		= new GameStaticObject;
			var Geo 		= new THREE.BoxGeometry(1, 1, 1);
			var material 	= new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube 		= new THREE.Mesh( Geo, material );
			
			object.Node = cube;
			object.Object = Geo;
			
			this.Scene.AddObject(object);
		}

		AddObj(model){
			this.Scene.Loader.load(model, (Geo) => {
				var object		= new GameStaticObject;
				var material 	= new THREE.MeshNormalMaterial();
				
				Geo.traverse( child => {
					if(child instanceof THREE.Mesh){
						child.material.material = material;
						child.scale *= 10;
					}
				});
				
				console.log(Geo);
				
				//Geo.material    = material;
				object.Node 		 = Geo;
				object.Object 		 = Geo;
				Scale(object, 10, 10, 10);
				
				this.Scene.AddObject(object);
			});
		}

		Update_GameInput(){
			var Gamepads = navigator.getGamepads();
			for (var I = 0; I < Gamepads.length; ++I) {
				var Gamepad = Gamepads[I];
				var OldGamepad = this.Gamepads[I];
				var Connected = Gamepad && Gamepad.connected;
				var OldConnected = OldGamepad && OldGamepad.connected;
				
				if (Connected && !OldConnected) {
					// add new gampad
					OldGamepad = CreateGamepad(Gamepad);
					console.log( "Gamepad", I, "Connected:", Gamepad.id );
					this.Gamepads[I] = OldGamepad;	// weird but valid
				}
				else if (OldConnected && !Connected) {
					// disable missing gamepads
					OldGamepad.connected = false;
					console.log( "Gamepad", I, "Disconnected:", OldGamepad.id );
					
					// todo: depress all buttons
					
					// todo: reset axies
				}
				
				// detect changes
				if (Connected && OldConnected) {
					for (var BtnIdx = 0; BtnIdx < Gamepad.buttons.length; ++BtnIdx) {
						// detect/update buttons change
						var Btn = Gamepad.buttons[BtnIdx];
						var OldBtn = OldGamepad.buttons[BtnIdx];
						if (Btn.value !== OldBtn.value || Btn.pressed !== OldBtn.pressed) {
							console.log('Gamepad', I, 'Btn', BtnIdx, 'changed:', OldBtn.value, '>>', Btn.value);
							OldBtn.pressed = Btn.pressed;
							OldBtn.value = Btn.value;
						}
					}
					
					for (var AxisIdx = 0; AxisIdx < Gamepad.axes.length; ++AxisIdx) {
						// detect/update button change
						var Axis = Gamepad.axes[AxisIdx];
						var OldAxis = OldGamepad.axes[AxisIdx];
						if (Axis !== OldAxis) {
							console.log('Gamepad', I, 'Axis', AxisIdx, 'changed:', OldAxis, '>>', Axis);
							OldGamepad.axes[AxisIdx] = Axis
						}
					}
				}
			}
		}

		Update_Draw(){
			this.Renderer.render(this.Scene.ThreeScene, this.ActiveCamera.Camera);
		}

		Update_FixedStep(){
			this.Update_GameInput();
			this.Update_Draw();
			this.ActiveCamera.Camera.rotation.y += 0.015;
		}

		Run(){
			if (this.AnimationHandle)
				return;
			
			var CB = () => {
				// console.log("Frame Start");
				this.AnimationHandle = requestAnimationFrame(CB);
				// update everything
				this.Update_FixedStep();
				
				//console.log("Frame End");
			}
			
			this.AnimationHandle = requestAnimationFrame(CB);
		}

		Stop(){
			cancelAnimationFrame(this.AnimationHandle);
			this.AnimationHandle = null;
		}
	}

	// FUNCTIONS //

	export function InitClientEngine(width, height): ClientEngine {
		var Client = new ClientEngine();
		Client.init(width, height);
		
		console.log("Initiated");
		
		return Client;
	}

	function CreateGamepad(Source: Gamepad): Gamepad {
		// todo: return a custom type instead of native 'Gamepad'
		var New: Gamepad = {
			id: 		Source.id,
			index:		Source.index,
			mapping:	Source.mapping,
			connected:	Source.connected,
			buttons:	[],
			axes:		[],
			timestamp:	Source.timestamp,
		};
		
		for (var BtnIdx = 0; BtnIdx < Source.buttons.length; ++BtnIdx) {
			var Btn = Source.buttons[BtnIdx];
			New.buttons.push({
				pressed:	Btn.pressed,
				value:		Btn.value
			});
		}
		
		for (var AxisIdx = 0; AxisIdx < Source.axes.length; ++AxisIdx) {
			New.axes.push(Source.axes[AxisIdx]);
		}
		
		return New;
	}

	function Scale(Obj: SceneObject, x: number = 1, y: number = 1, z: number = 1){
		Obj.Node.scale.x *= x;
		Obj.Node.scale.y *= y;
		Obj.Node.scale.z *= z;
	}

	function Translate(Obj: SceneObject, x: number = 1, y: number = 1, z: number = 1){
		Obj.Node.position.x += x;
		Obj.Node.position.y += y;
		Obj.Node.position.z += z;
	}

	function SetPosition(Obj: SceneObject, x: number = 1, y: number = 1, z: number = 1){
		Obj.Node.position.x = x;
		Obj.Node.position.y = y;
		Obj.Node.position.z = z;
	}

	function Rotate_Degree(Obj: SceneObject, x: number = 1, y: number = 1, z: number = 1){
	}
}
