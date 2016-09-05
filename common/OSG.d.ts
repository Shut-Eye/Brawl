declare module OSG {
	function globalify(): any;
	
}

interface Window {
	OSG: typeof OSG;
	osg: any;
	osgViewer: any;
}