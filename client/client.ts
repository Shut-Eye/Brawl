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

	const AxisMap = {
		0: GAMEINPUTMESSAGES.LeftRight,
		1: GAMEINPUTMESSAGES.UpDown,
		2: GAMEINPUTMESSAGES.CameraLeftRight,
		3: GAMEINPUTMESSAGES.CameraUpDown,
	}

	const AxisCofMap = {
		0: 1,
		1: -1,
		2: 1,
		3: -1,
	}

	const KeyMap = {
		0: GAMEINPUTMESSAGES.Action,
		1: GAMEINPUTMESSAGES.Block,
		2: GAMEINPUTMESSAGES.Kick,
		3: GAMEINPUTMESSAGES.Punch,
	}

	// Input -> Temporally Sliced groups of 5 frames -> Accept first Input Token, Ignore Rest


	// Input Stream Example
    // OOOOOOOOO X ----- OOOXX XXX--- OOAAAA 		
    // OOOOOOOOO X ----- OOOXx xxx--- OOAaaa a-----

    // OOOOOOOOO X ----- OOOXO ----- OOAOOO  			KICK -> KICK -> PUNCH
    // OOOOOOOOO X ----- OOOXo --X_h--- OOAaaa A_h		KICK -> STRONG KICK -> STRONG PUNCH
    //  

	// SAMPLE 2 //


	// CONSTANTS //

	const DeadZone: number = 0.3;
	const DeadZoneI: number = 1 - DeadZone;

	export const enum GAMEINPUTMESSAGES {
		LeftRight,
		UpDown,
		CameraLeftRight,
		CameraUpDown,
		Jump,
		Action,
		Kick,
		Punch,
		Block,
		NullEvent,
	}

	export const enum GAMEACTORMASK {
		Player  = 0x01,
		NPC		= 0x02,
		Static  = 0x04,
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

	class xNpcEvent{
		SourceNPC: number;
		TargetNPC: number;

/*
		{
			// Data
			//... 
		}
*/
	}

	class PlayerNPCEvent{
	}

	class Player{
		PlayerID: string;

		constructor(ID: string = ""){
			this.PlayerID = ID;
		}
	}

	class Npc{
		ID: number;
	}

	class Static{
	}

	class GamePlayModel {
		// Counters
		PlayerInputCounter: number;

		Players: 		Player[]	= [];
		NPCs:	 		Npc[]		= [];
		Statics: 		Static[]	= [];
		NPCPayerevents: xNpcEvent[]	= [];
		xNPCevents: 	xNpcEvent[]	= [];

		AddPlayer1(){
			this.Players.push(new Player("Player1"));
		}

		UpdatePlayers(evtQueue: InputEvent[]){
			// Update Player Input 
			if(this.PlayerInputCounter == 5){
				this.PlayerInputCounter = 0;
				// Handle Input
				// Code...
			}
			else 
				this.PlayerInputCounter++;

			for (var P in this.Players) {
				var Player = this.Players[P];

				for(var InputMsg in evtQueue){
					var Msg = evtQueue[InputMsg];
					switch (Msg.MessageType) {
						case GAMEINPUTMESSAGES.LeftRight:
							console.log("MoveLeftRight: " + Msg.Magnitude);
							break;
						case GAMEINPUTMESSAGES.UpDown:
							console.log("MoveUpDown: " +  Msg.Magnitude);
							break;
					}
				}
			}
		}

		UpdateNPCs(){
			for(var eventIdx in this.xNPCevents){
				var event 			= this.xNPCevents[eventIdx];
				var EventRecipient 	= this.NPCs[event.TargetNPC];
				var EventSource 	= this.NPCs[event.SourceNPC];

			}

			for(var eventIdx in this.NPCPayerevents){
				var event = this.NPCPayerevents[eventIdx];
			}
		}

		update(evtQueue: any){
			this.UpdatePlayers(evtQueue);
			this.UpdateNPCs();
		}
	}

	class InputEvent{
		MessageType: GAMEINPUTMESSAGES;
		Magnitude: number;

		constructor(type: GAMEINPUTMESSAGES = GAMEINPUTMESSAGES.NullEvent, magnitude: number = 0) {
			this.MessageType	= type;
			this.Magnitude		= magnitude;
		}
	}

	class ClientEngine {
		Handler : GameInputHandler;

		Scene : GameScene;

		Renderer : THREE.WebGLRenderer;

		AnimationHandle: number;

		Gamepads: Gamepad[] = [];

		ActiveCamera : GameCamera;

		GameState: GamePlayModel = new GamePlayModel();
		
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

			this.GameState.AddPlayer1();
		}

		AddCube(x: number = 1, y: number = 1, z: number = 1){
			var object		= new GameStaticObject;
			var Geo 		= new THREE.BoxGeometry(x, y, z);
			var material 	= new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube 		= new THREE.Mesh( Geo, material );
			
			object.Node 	= cube;
			object.Object 	= Geo;
			
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

		Update_GameObjects(InputQueue: any){
			this.GameState.update(InputQueue);
			this.ActiveCamera.Camera.rotation.y += 0.015;
		}


		Update_GameInput(): InputEvent[] {
			var evtQueue : InputEvent[] = [];

			var Gamepads = navigator.getGamepads();
			for (var I = 0; I < Gamepads.length; ++I) {
				var Gamepad 	 = Gamepads[I];
				var OldGamepad 	 = this.Gamepads[I];
				var Connected 	 = Gamepad && Gamepad.connected;
				var OldConnected = OldGamepad && OldGamepad.connected;
				
				if (Connected && !OldConnected) {
					// add new gampad
					OldGamepad = CreateGamepad(Gamepad);
					console.log( "Gamepad", I, "Connected:", Gamepad.id );
					var NewEvent = new InputEvent();

					evtQueue.push(NewEvent);
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
							//console.log('Gamepad', I, 'Btn', BtnIdx, 'changed:', OldBtn.value, '>>', Btn.value);
							OldBtn.pressed = Btn.pressed;
							OldBtn.value = Btn.value;

							var mapping = KeyMap[BtnIdx];
							if (mapping != null)
								evtQueue.push(new InputEvent(mapping, Btn.value));
						}
					}
					
					for (var AxisIdx = 0; AxisIdx < Gamepad.axes.length; ++AxisIdx) {
						// detect/update button change
						var Axis = Gamepad.axes[AxisIdx];
						var Axis0 = Math.abs(Axis) > DeadZone ? Axis : 0;
						var OldAxis = OldGamepad.axes[AxisIdx];
						if (Axis0 !== OldAxis) {
							//console.log('Gamepad', I, 'Axis', AxisIdx, 'changed:', OldAxis, '>>', Axis);
							OldGamepad.axes[AxisIdx] = Axis0;

							var mapping = AxisMap[AxisIdx];
							if (mapping != null)
								var Mapped: number = 0;
								if(Axis0 > 0){
									var Mapped = (Axis0 - DeadZone) * 1/(DeadZoneI)
								} else {
									var Mapped = (Axis0 + DeadZone) * 1/(DeadZoneI)
								}
								
							evtQueue.push(new InputEvent(mapping, Axis0 * AxisCofMap[AxisIdx] ? Mapped : Axis0));
						}
					}
				}
			}

			return evtQueue;
		}

		Update_Draw(){
			this.Renderer.render(this.Scene.ThreeScene, this.ActiveCamera.Camera);
		}

		Update_FixedStep(){
			this.Update_GameObjects(this.Update_GameInput());
			this.Update_Draw();
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
		Obj.Node.rotation.x += x;
		Obj.Node.rotation.y += y;
		Obj.Node.rotation.z += z;
	}
}
