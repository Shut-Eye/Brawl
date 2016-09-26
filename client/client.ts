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
		Node_Impl   : THREE.Object3D;

	}

	export interface AjaxRequest<T> {
		XHR: XMLHttpRequest;
		Promise: Promise<T>;
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

	export class GameStaticObject {
		Object 		: THREE.Geometry;
		Node_Impl   : THREE.Object3D;
	}

	class GameCamera{
		Camera 		: THREE.Camera;
		Node_Impl   : THREE.Object3D;

		SetAspect(aspect: number){
			this.Camera.aspect = aspect;
			this.Camera.updateProjectionMatrix();
		}

		UpdateProjectionMatrix(){
			this.Camera.updateProjectionMatrix();
		}
	}

	export class GameNode{
		constructor(){
			this.Node_Impl = new THREE.Object3D();
		}

		Node_Impl   : THREE.Object3D;
	}

	export class GameScene {
		constructor(){
			this.ThreeScene 	= new THREE.Scene();	
			this.Manager		= new THREE.LoadingManager();
			this.ObjLoader 		= new THREE.OBJLoader(this.Manager);
			this.ColladaLoader 	= THREE.ColladaLoader();

			this.SceneRoot = new GameNode();

			//var Node = THREE.Object3D();
		}

		Assets:			GameAsset[]	  = [];
		Objects:		SceneObject[] = [];

		SceneRoot: GameNode;

		ThreeScene: 	THREE.Scene;
		ObjLoader: 		THREE.OBJLoader;
		Manager: 		Temp;
		ColladaLoader: 	Temp;

		AddObject(Obj: SceneObject){
			console.log("Adding Object to Scene!");
			console.log(Obj);

			this.Objects.push(Obj);
			this.ThreeScene.add(Obj.Node_Impl);
		}

		AddCamera(AspectRatio: number, Near: number, Far: number) : GameCamera {
			var C 	 = new GameCamera;
			C.Camera = new THREE.PerspectiveCamera(55, AspectRatio, Near, Far);
			C.Node_Impl   = C.Camera;

			//Rotate_Degree(C, -0.3, 0, 0);
			//Translate(C, 0, 100, 0);

			//C.Camera.updateMatrix();

			return C;
		}

		LoadDae(file) : GameNode {
			var SceneRoot	= new GameNode();

			this.ColladaLoader.load(file, (result) => {
				console.log('result:', result);
   				SceneRoot.Node_Impl.add(result.scene);

   				this.ThreeScene.add(SceneRoot.Node_Impl);
   				//SceneRoot.Node.rotation.x = Math.PI/2;
   				Rotate_Degree(SceneRoot, 0, 0, -90);
   				Rotate_Degree(SceneRoot, -90, 0, 0);
			});

			return SceneRoot;
		}

		LoadDaeAsync(file: string): AjaxRequest<GameNode> {
			var Req		= Ajax(file);
			var Promise	= Req.Promise.then(r => {
				var XML			= ParseXML(r);
				var Result		= this.ColladaLoader.parse(XML);
				console.log('result:', Result);

				var SceneRoot	= new GameNode();
				SceneRoot.Node_Impl.add(Result.scene);

				return SceneRoot;
			});

			return {
				XHR: Req.XHR,
				Promise,
			}
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

	export class Player{
		PlayerID: 	string;
		Node:		GameNode;
		Dx:			number;
		Dy:			number;

		Add(Obj: SceneObject){
			this.Node.Node_Impl.add(Obj.Node_Impl);
		}

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
			this.Scene.ThreeScene.add(NewPlayer.Node.Node_Impl);

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
							this.Players[0].Dy = Msg.Magnitude * .2;
							console.log("MoveUpDown: " +  Msg.Magnitude);

							break;
					}
				}

				Translate(this.Players[0].Node, this.Players[0].Dx, 0, this.Players[0].Dy);
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

	export class ClientEngine {
		Handler:			GameInputHandler;
		Scene:				GameScene;
		Renderer:			THREE.WebGLRenderer;
		AnimationHandle:	number;
		Gamepads:			Controller[]		= [];
		ActiveCamera:		GameCamera;
		GameState:			GamePlayModel;

		init(width: number, height: number){
			this.Scene	  		= new GameScene;
			this.Renderer 		= new THREE.WebGLRenderer({ antialias: true });
			this.GameState		= new GamePlayModel(this.Scene);

			console.log( "Aspect Ratio", width / height );
			console.log( "Height", height );
			console.log( "Width", width );

			this.ActiveCamera = this.Scene.AddCamera(
				Math.min(width/height, 20), 0.1, 10000.0);

			// HACK;
			this.Resize(width, height);
		}

		AddCube(x: number = 1, y: number = 1, z: number = 1){
			var object		= new GameStaticObject;
			var Geo 		= new THREE.BoxGeometry(x, y, z);
			var material 	= new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube 		= new THREE.Mesh(Geo, material);

			object.Node_Impl 	= cube;
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
				object.Node_Impl = Geo;
				object.Object 	 = Geo;
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

	export function SetPlayerModelOBJ(model: string, player: Brawl.Player, scene: Brawl.GameScene){
		scene.ObjLoader.load(model, (Geo) => {
			var object		= new Brawl.GameStaticObject;
			var material 	= new THREE.MeshNormalMaterial();

			Geo.traverse( child => {
				if(child instanceof THREE.Mesh){
					child.material.material = material;
			}});

			player.Node.Node_Impl.add(Geo);

		});
		return player;
	}

	function CreateGamepad(Source: Gamepad): Controller {
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

	export function Scale(Obj: SceneObject, x: number = 1, y: number = 1, z: number = 1){
		Obj.Node_Impl.scale.x *= x;
		Obj.Node_Impl.scale.y *= y;
		Obj.Node_Impl.scale.z *= z;
	}

	export function Translate(Obj: SceneObject, x: number = 0, y: number = 0, z: number = 0){
		Obj.Node_Impl.position.x += x;
		Obj.Node_Impl.position.y += y;
		Obj.Node_Impl.position.z += z;
	}

	export function SetPosition(Obj: SceneObject, x: number = 0, y: number = 0, z: number = 0){
		Obj.Node_Impl.position.x = x;
		Obj.Node_Impl.position.y = y;
		Obj.Node_Impl.position.z = z;
	}

	export function Rotate_Degree(Obj: SceneObject, x: number = 0, y: number = 0, z: number = 0){
		Obj.Node_Impl.rotation.x += x * 2 * Math.PI / 360;
		Obj.Node_Impl.rotation.y += y * 2 * Math.PI / 360;
		Obj.Node_Impl.rotation.z += z * 2 * Math.PI / 360;
	}

	export function Ajax(url: string): AjaxRequest<string> {
		var XHR: XMLHttpRequest;
		var NewPromise = new Promise((resolve, reject) => {
			XHR = new XMLHttpRequest();

			XHR.open("GET", url, true);

			XHR.onreadystatechange = function(oEvent) {
				if (XHR.readyState === 4) {
					if (XHR.status === 200) {
						console.log("SUCCESS", XHR);
						resolve(XHR.response);
					} else {
						console.log("ERROR", XHR);
						reject(XHR);
					}
				}
			};

			XHR.onerror = () => {
				console.error('NOPE', XHR);
			}

			XHR.send(null);
		});

		return {
			Promise: NewPromise,
			XHR: XHR,
		};
	}

	export function ParseXML(text: string) {
		var Parser	= new DOMParser();
		var XMLDoc	= Parser.parseFromString(text, 'text/xml');
		return XMLDoc;
	}

}