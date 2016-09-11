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
	'use strict';

	const AxisMap = {
		0: GAMEINPUTMESSAGES.LeftRight,
		1: GAMEINPUTMESSAGES.UpDown,
		2: GAMEINPUTMESSAGES.CameraLeftRight,
		3: GAMEINPUTMESSAGES.CameraUpDown,
	}

	const AxisCofMap = {
		0:  1,
		1: -1,
		2:  1,
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

	export const enum GAMEASSETTYPE {
		Obj,
		Dae,
	}

	// TYPES //

	type Temp = any;

	interface SceneObject{
		Node   : THREE.Object3D;
	}

	// CLASSES //

	class GameAsset {
		constructor(url: string, type: GAMEASSETTYPE, data: any) {
			this.Url	= url;
			this.Type	= type;
			this.Data	= data;
		}

		Url: string;
		Type: GAMEASSETTYPE;
		Data: any;
	}

	class GameInputMessage {
		KC:		GAMEINPUTMESSAGES;
		State:	number;
	}
		
	class GameInputHandler {
	}

	class GameStaticObject {
		Object : THREE.Geometry;
		Node   : THREE.Object3D;
	}
	
	class GameCamera{
		Camera : THREE.Camera;
		Node   : THREE.Object3D;

		SetAspect(aspect: number){
			this.Camera.aspect = aspect;
			this.Camera.updateProjectionMatrix();
		}

		UpdateProjectionMatrix(){
			this.Camera.updateProjectionMatrix();
		}
	}

	class GameNode{
		constructor(){
			this.Node = new THREE.Object3D();
		}

		Node   : THREE.Object3D;
	}

	class GameScene {
		constructor(){
			this.ThreeScene 	= new THREE.Scene();	
			this.Manager		= new THREE.LoadingManager();
			this.ObjLoader 		= new THREE.OBJLoader(this.Manager);
			this.ColladaLoader 	= THREE.ColladaLoader();

			var Light = new THREE.AmbientLight(0x101030);
			this.ThreeScene.add(Light);

			//var Node = THREE.Object3D();
		}
		
		Assets:			GameAsset[]	  = [];
		Objects:		SceneObject[] = [];
		
		ThreeScene: 	THREE.Scene;
		ObjLoader: 		THREE.OBJLoader;
		Manager: 		Temp;
		ColladaLoader: 	Temp;

		AddObject(Obj: SceneObject){
			console.log("Adding Object to Scene!");
			console.log(Obj);
			
			this.Objects.push(Obj);
			this.ThreeScene.add(Obj.Node);
		}

		AddCamera(AspectRatio: number, Near: number, Far: number) : GameCamera {
			var C 	 = new GameCamera;
			C.Camera = new THREE.PerspectiveCamera(55, AspectRatio, Near, Far);
			C.Node   = C.Camera;
			
			return C;
		}

		LoadDae(file){
			var SceneRoot	= new THREE.Object3D();

			this.ColladaLoader.load(file, (result) => {
				console.log(this);
   				SceneRoot.add(result.scene);

   				this.ThreeScene.add(SceneRoot);
   				SceneRoot.rotation.x = Math.PI/2;
   				SceneRoot.rotation.z = Math.PI/2;
			});
		}

		LoadDaeAsync(file: string): Promise<any> {
			return new Promise((resolve, reject) => {
				this.ColladaLoader.load(file, (result) => {
					console.warn('RESULT', result);
					/*
					var SceneRoot 	= new THREE.Object3D();

					console.log(this);
					SceneRoot.add(result.scene);

					this.ThreeScene.add(SceneRoot);
					SceneRoot.rotation.x = Math.PI/2;
					SceneRoot.scale.z 	 = -1;
					*/
				}, (error) => {
					console.warn('ERROR', error);
				});
			});
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
		PlayerID: 	string;
		Node:		GameNode;
		Dx:			number;
		Dy:			number;

		constructor(ID: string = ""){
			this.PlayerID = ID;
			this.Node = new GameNode();

			this.Dx = 0;
			this.Dy = 0;
		}
	}

	class Npc{
		ID: number;
	}

	class Static{
	}

	interface CameraController{
		Reset();
		Update(dt: number, Node: Temp);
	}

	class GameplayGameController{
		Reset(){
		}

		Update(dt: number, Node: Temp){
		}
	}

	function SetPlayerModelOBJ(model: string, player: Player, scene: GameScene){
		scene.ObjLoader.load(model, (Geo) => {
			var object		= new GameStaticObject;
			var material 	= new THREE.MeshNormalMaterial();
			
			Geo.traverse( child => {
				if(child instanceof THREE.Mesh){
					child.material.material = material;
					//child.scale *= 10;

			}});

			player.Node.Node.add(Geo);

		});
		return player;
	}

	class GamePlayModel {
		// Counters
		PlayerInputCounter: number;

		Players: 		Player[]	= [];
		NPCs:	 		Npc[]		= [];
		Statics: 		Static[]	= [];
		NPCPayerevents: xNpcEvent[]	= [];
		xNPCevents: 	xNpcEvent[]	= [];

		Scene: GameScene;

		constructor(scene: GameScene){
			this.Scene = scene;
		}

		AddPlayer1() : Player{
			// TODO: check if player 1 is already logged in
			var NewPlayer = new Player("Player1");
			this.Players.push(NewPlayer);
			this.Scene.ThreeScene.add(NewPlayer.Node.Node);

			return NewPlayer;
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
							this.Players[0].Dx = Msg.Magnitude * .3;
							break;
						case GAMEINPUTMESSAGES.UpDown:
							this.Players[0].Dy = -Msg.Magnitude * .2;
							console.log("MoveUpDown: " +  Msg.Magnitude);

							break;
					}
				}

				Translate(this.Players[0].Node, this.Players[0].Dx, this.Players[0].Dy, 0);
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

		update(evtQueue: InputEvent[]){
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
		Handler:			GameInputHandler;
		Scene:				GameScene;
		Renderer:			THREE.WebGLRenderer;
		AnimationHandle:	number;
		Gamepads:			Gamepad[]		= [];
		ActiveCamera:		GameCamera;
		GameState:			GamePlayModel;
		
		init(width: number, height: number){
			this.Scene	  		= new GameScene;
			this.Renderer 		= new THREE.WebGLRenderer({ antialias: true });
			this.GameState		= new GamePlayModel(this.Scene);

			document.body.appendChild( this.Renderer.domElement );
			
			console.log( "" + width / height  + " : Aspect Ratio");
			console.log( "" + height 		+ " : Height");
			console.log( "" + width 		+ " : Width");

			this.ActiveCamera 	= this.Scene.AddCamera(Math.min(width/height, 20), 
													   0.1, 10000.0);
			this.Resize(width, height);
			
			this.ActiveCamera.Node.position.z = 5;
			this.ActiveCamera.Node.position.y = 0;
			//this.AddCube();
			//this.AddObj("assets/head.obj");
			this.Scene.LoadDae("assets/test.dae");

			SetPlayerModelOBJ("assets/head.obj", this.GameState.AddPlayer1(), this.Scene);
		}

		AddCube(x: number = 1, y: number = 1, z: number = 1){
			var object		= new GameStaticObject;
			var Geo 		= new THREE.BoxGeometry(x, y, z);
			var material 	= new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube 		= new THREE.Mesh(Geo, material);
			
			object.Node 	= cube;
			object.Object 	= Geo;
			
			this.Scene.AddObject(object);
		}

		AddObj(Model : string){
			this.Scene.ObjLoader.load(Model, (Geo) => {
				console.log('Geo', Geo);
				var object		= new GameStaticObject;
				var material 	= new THREE.MeshNormalMaterial();
				
				Geo.traverse( child => {
					if(child instanceof THREE.Mesh){
						child.material.material = material;
						//child.scale *= 10;
					}
				});

				//Geo.material    = material;
				object.Node 		 = Geo;
				object.Object 		 = Geo;
				Scale(object, 10, 10, 10);
				
				this.Scene.AddObject(object);
			});
		}


		UpdateGameObjects(InputQueue: InputEvent[]){
			this.GameState.update(InputQueue);
		}


		UpdateGameInput(): InputEvent[] {
			var EvtQueue : InputEvent[] = [];

			var NewStates = navigator.getGamepads();
			for (var I = 0; I < NewStates.length; ++I) {
				var NewState 	 	= NewStates[I];
				var Gamepad 	 	= this.Gamepads[I];
				var NewConnected 	= NewState && NewState.connected;
				var Connected		= Gamepad && Gamepad.connected;
				
				if (NewConnected && !Connected) {
					// add new gampad
					Gamepad = CreateGamepad(NewState);
					//console.log( "Gamepad", I, "Connected:", NewState.id );
					var NewEvent = new InputEvent();

					EvtQueue.push(NewEvent);
					this.Gamepads[I] = Gamepad;	// weird but valid
				}
				else if (Connected && !NewConnected) {
					// disable missing gamepads
					Gamepad.connected = false;
					//console.log( "Gamepad", I, "Disconnected:", Gamepad.id );
					
					// todo: depress all buttons
					
					// todo: reset axes
				}
				
				// detect changes
				if (NewConnected && Connected) {
					for (var BtnIdx = 0; BtnIdx < NewState.buttons.length; ++BtnIdx) {
						// detect/update buttons change
						var BtnState	= NewState.buttons[BtnIdx];
						var Btn			= Gamepad.buttons[BtnIdx];

						if (BtnState.value !== Btn.value || BtnState.pressed !== Btn.pressed) {
							//console.log('Gamepad', I, 'Btn', BtnIdx, 'changed:', OldBtn.value, '>>', Btn.value);
							Btn.pressed = BtnState.pressed;
							Btn.value = BtnState.value;

							var mapping = KeyMap[BtnIdx];
							if (mapping != null)
								EvtQueue.push(new InputEvent(mapping, BtnState.value));
						}
					}
					
					for (var AxisIdx = 0; AxisIdx < NewState.axes.length; ++AxisIdx) {
						// detect/update button change
						var AxisState0	= NewState.axes[AxisIdx];
						var AxisState	= Math.abs(AxisState0) > DeadZone ? AxisState0 : 0;
						var Axis		= Gamepad.axes[AxisIdx];

						if (AxisState !== Axis) {
							//console.log('Gamepad', I, 'Axis', AxisIdx, 'changed:', OldAxis, '>>', Axis);
							Gamepad.axes[AxisIdx] = AxisState;

							var mapping = AxisMap[AxisIdx];
							if (mapping != null)
								var Mapped: number = 0;
								if(AxisState > 0){
									var Mapped = (AxisState - DeadZone) * 1/(DeadZoneI)
								} else {
									var Mapped = (AxisState + DeadZone) * 1/(DeadZoneI)
								}

							EvtQueue.push(new InputEvent(mapping, AxisState * AxisCofMap[AxisIdx] ? Mapped : AxisState));
						}
					}
				}
			}

			return EvtQueue;
		}

		UpdateDraw(){
			this.Renderer.render(this.Scene.ThreeScene, this.ActiveCamera.Camera);
		}

		UpdateFixedStep(){
			this.UpdateGameObjects(this.UpdateGameInput());
			this.UpdateDraw();
		}

		Run(){
			if (this.AnimationHandle)
				return;
			
			var CB = () => {
				// console.log("Frame Start");
				this.AnimationHandle = requestAnimationFrame(CB);
				// update everything
				this.UpdateFixedStep();
				
				//console.log("Frame End");
			}
			
			this.AnimationHandle = requestAnimationFrame(CB);
		}

		Stop(){
			cancelAnimationFrame(this.AnimationHandle);
			this.AnimationHandle = null;
		}

		Resize(width: number, height: number){
			console.log("Resizing RenderTarget");
			this.Renderer.setSize(width, height);

			this.ActiveCamera.SetAspect(width/height);
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

	export function Ajax(url: string): Promise<any> {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();

			xhr.open("GET", url, true);

			xhr.onreadystatechange = function(oEvent) {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						console.log("SUCCESS", xhr);
						resolve(xhr.response);
					} else {
						console.log("ERROR", xhr);
						reject(xhr);
					}
				}
			};

			xhr.onerror = () => {
				console.error('NOPE', xhr);
			}

			xhr.send(null);
		});
	}
}