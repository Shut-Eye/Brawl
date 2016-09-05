window.addEventListener('load', function() {
	var ViewContainer = document.getElementById('ViewContainer');
	var Client = Brawl.InitClientEngine(ViewContainer.clientWidth, ViewContainer.clientHeight);
	//console.log('Initialized Client Engine:', Client);

	ViewContainer.appendChild(Client.Renderer.domElement);
	//console.log('Added canvas element: ', Client.Renderer.domElement);

	Client.Run();
});