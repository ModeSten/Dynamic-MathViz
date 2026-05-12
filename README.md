# Dynamic-MathViz
Toolset for visualizing math concepts, built upon D3 JS ( https://d3js.org )

This codebase is developed to simply the creation interactive web based visualizations of mathematics concepts.

The code is structured around various classes used to handle the parameters needed to create and update a particular visual element. 

Classes are set up to share as much code as possible through the use of class extensions; A group of related classes, sharing a similar purpose, will all be extensions of a shared parent class which implements all functions and parameters which do not need to differ between child classes; As an example, functions used to update objects are generally shared by child class instances.

The most fundamental classes (bellow) are in "math_viz.js" while classes representing higher level concepts are put in separate documents, ex "math_viz_labels.js" and "math_viz_derivata.js". 

core classes:
	
	CanvasObj: creates and manages a base SVG element to which various visual elements can be added

	VisualObj: Parent class for all classes which directly creates and manages SVG elements

		ChartObj:

		LineObj:

		MarkerObj:

		LabelObj:

	ExtensionObj: Parent class for classes which handles data creation and then uses VisualObj child class instances to render: Each instance of a child 			      class will contain the logic for creating a dataset and also hold a reference to a VisualObj class which is used to show this data

		GraphObj: Creates data points ( [x, y] coordinates) based on a function ( (x)=>{return f(x) ) and uses LineObj to display the data as a curve.

	UpdateNode: used to update a ViusualObj or ExtensionObj class object. Contains dictionary holding parameters to be updated, update duration, update 			    delay, next parameter (allowing chaining multiple updates by referencing another UpdateNode instance) and callback parameter, allowing 			    specification of function to be called after update completion

		