interface Window {
	Client: Brawl.ClientEngine;
}

window.addEventListener('load', function() {
	'use strict';

	// create client
	var ViewContainer = document.getElementById('ViewContainer');
	var Client = new Brawl.ClientEngine();
	window.Client = Client;

	// init client
	Client.init(ViewContainer.clientWidth, ViewContainer.clientHeight);

	// set render canvas
	ViewContainer.appendChild(Client.Renderer.domElement);

	(() => {
		// detect window resize
		var ResizeTimeout;
		window.addEventListener('resize', function() {
			// todo: exit if no longer 'running'
			if (ResizeTimeout) return;

			ResizeTimeout = setTimeout(function() {
				ResizeTimeout = 0;

				// todo: only update if dimensions have changed
				Client.Resize(ViewContainer.clientWidth, ViewContainer.clientHeight);
			}, 250);
		});
	})();

	window.addEventListener('blur', () => {
		// todo: pause game
		console.log('pause');
	});

	window.addEventListener('focus', () => {
		// todo: resume game
		console.log('resume');
	});

	(() => {
		// create game scene

		var SceneRoot: Brawl.GameNode = LoadTestScene(Client.Scene);

		var Player = Client.GameState.AddPlayer1();
		Brawl.SetPlayerModelOBJ("assets/head.obj", Player, Client.Scene);

		Player.Add(Client.ActiveCamera);

		function LoadTestScene(Scene: Brawl.GameScene): Brawl.GameNode {
			Client.ActiveCamera.Node_Impl.position.z = 5;
			Client.ActiveCamera.Node_Impl.position.y = 3;

			Brawl.Rotate_Degree(Client.ActiveCamera, -20);

			var SceneRoot: any = Scene.LoadDae("assets/alleyway.dae");
			var scale: number = 0.1;

			Brawl.Scale(SceneRoot, scale, scale, scale);

			return SceneRoot;
		}

		// end: create game scene
	})();

	Client.Run();
});