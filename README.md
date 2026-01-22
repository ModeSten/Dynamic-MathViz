# Dynamic-MathViz
Toolset for visualizing math concepts, built upon D3 JS

This codebase is developed for making it easi to create interactive web based visuals of mathematichs concepts.

The code is structures around a number of classes, following a common structure, with each class being intended to manage
a particular visual representation. Al classes share a common structure for managing things like updates. There are two kinds
of classes, one (visualObj) managing the creation and update of simple SVG elements such as lines (paths) and markers (circles).
A second classes, (ExstentionObj) containe the logic for creating visual elements like graphs and then use instances of VisualObj
(ex LineObj class) to create corepsonding SVG elements.
