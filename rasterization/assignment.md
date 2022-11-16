*Erreichbare Punktzahl:* **8 Punkte**

Grafikkarte Gretel hat ein paar Fragmente im Wald verloren und weiß nicht mehr, wie Dreiecke rasterisiert werden. Bitte hilf ihr dabei!

Das Dreieck als geometrisches Primitiv und seine Rasterisierung spielen in der Computergrafik eine zentrale Rolle. In der Vorlesung haben wir das Edge Function Testing kennengelernt. Für einen Punkt $P = (x, y)$ und zwei Punkte $V_0 = (x_0, y_0)$ und $V_1 = (x_1, y_1)$ kann mit der Formel 

$$
\epsilon = (x - x_0) * (y_1 - y_0) - (y - y_0) * (x_1 - x_0)
$$

bestimmt werden, auf welcher Seite der Kante von $V_0$ zu $V_1$ der Punkt $P$ liegt (im Falle einer Clockwise Order, die wir für diese Übung annehmen).

Diese Formel enspricht der doppelten Fläche des Dreiecks, das durch die drei Punkte aufgespannt wird, siehe [hier](https://en.wikipedia.org/wiki/Triangle#Using_coordinates). Demensprechend kann über die Formel auch die Fläche des gesamten Dreiecks bestimmt werden.

Neben der Information, ob ein Punkt innerhalb eines Dreiecks liegt, kann über die Formel demnach auch bestimmt werden, wie nah ein Punkt an den Eckpunkten liegt: Die Fläche, die durch zwei Eckpunkte und den betrachteten Punkt aufgespannt wird, nimmt zu, je näher der Punkt am gegenüberliegenden Eckpunkt liegt. Mithilfe der Gesamtfläche des Dreieck kann der Wertebereich auf $[0, 1]$ normiert werden.

### Fragmentbasierte Rasterisierung

Implementieren Sie in vscode-link(./code/fragmentbasedRasterization.frag) einen Test, um zu prüfen, ob das betrachtete Fragment innerhalb des durch `u_vertices` (Liste der Vertices als xy-Koordinate, Wertebereich $[0, 1]^2$) gegebenen Dreiecks liegt. Berechnen Sie außerdem, wie nah das Fragment an allen Eckpunkten liegt, um die Vertexfarben, gegeben durch `u_colors` (jeweilige Vertexfarbe in RGB), über die Fläche linear zu interpolieren und entsprechend auszugeben. Eine Beispielausgabe ist unten zu sehen.

### Hardwarebeschleunigte Rasterisierung

Ergänzen Sie vscode-link(./code/vertexbasedRasterization.vert) und vscode-link(./code/vertexbasedRasterization.frag) so, dass die gleiche Ausgabe wie in der ersten Teilaufgabe erzeugt wird. Die Rasterisierung wird bereits durch die Grafikpipeline durchgeführt, es fehlt also nur die Einfärbung der Fragmente. Die Vertexfarbe ist mit `a_color` im Vertexshader pro Vertex und durch `v_color` im Fragmentshader als Array gegeben. Bevorzugen Sie eine einfache Implementierung, die bestehende Funktionalität der Grafikpipeline ausnutzt.

### Beispielausgabe

![Original](./img/rasterung.png)  
Rasterisiertes Dreieck mit interpolierten Vertexfarben
