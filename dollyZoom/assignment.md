*Erreichbare Punktzahl:* **6 Punkte (+ 2 Bonuspunkte)**

<i>Der Dolly-Zoom ist ein Filmeffekt, der sich eine optische Täuschung zunutze macht. Beim Dolly-Zoom fährt die Kamera auf Schienen (Dolly), während das fokussierte Objekt durch eine gegenläufige Anpassung der Brennweite während der Fahrt in unveränderter Größe im Bild bleibt. Dadurch wird der Bildausschnitt des Hintergrundes entweder größer (bei der Zufahrt – dolly in, zoom out) oder kleiner (bei der Wegfahrt – dolly out, zoom in) wodurch ein unnatürlicher Effekt entsteht.

Beispiele:
- [Vertigo](https://youtu.be/je0NhvAQ6fM?t=47)
- [Jaws](https://youtu.be/_eO_5q5dR9M?t=19)
- [Herr der Ringe](https://youtu.be/Cyq37Qs8dro?t=121)
- [Goodfellas](https://youtu.be/HZNBtx6RAn4?t=31)
</i>

Implementieren Sie eine Kamerasteuerung, die die Kamera auf einen festen Punkt in der Szene ausrichtet. Die Kamera soll sich auf den Fokuspunkt zu bzw. davon wegbewegen (gesteuert durch den Interpolationsfaktor), wobei das Objekt im Fokus durch den Dolly-Zoom-Effekt seine Größe beibehalten soll. Implementieren Sie dazu in vscode-link(./code/getFov.ts) und vscode-link(./code/updateCamera.ts) die ensprechenden Funktionen.

`getFov` soll basierend auf der Entfernung der Kamera und der gewünschten Größe des Fokusbereichs den (vertikalen) Blickwinkel der Kamera berechnen. Die Größe ist hier zu verstehen als das maximale Ausmaß eines Objekts, das noch ins Bild passen soll – wird die Größe des Fokusbereichs erhöht, wird das Objekt, auf das die Kamera blickt, kleiner angezeigt.

Der so berechnete Blickwinkel soll in `updateCamera` genutzt werden, um die Kamera richtig zu positionieren. Dazu müssen vier Werte gesetzt werden:
- `camera.center`: Der Punkt, auf den die Kamera blickt.
- `camera.eye`: Die Position der Kamera.
- `camera.up`: "Oben" aus Sicht der Kamera. Dieser soll senkrecht zum Vektor `center - eye` sein.
- `camera.fovy`: Der vertikale Blickwinkel der Kamera.

Entgegen festen Schienen im Film, soll die Kamera zusätzlich über eine Interaktionstechnik um den Fokuspunkt herum gedreht werden können. Die Rotation ist durch Länge und Breite (wie aus dem Geographieunterricht bekannt) spezifiziert. Eine positive Breite bedeutet dabei, dass die Szene von weiter oben betrachtet wird, eine positive Länge bedeutet eine Betrachtung von weiter rechts. Diese und alle anderen für die Lösung der Aufgabe benötigten Variablen sind im Code aufgelistet und kurz beschrieben.

#### Bonus

Um die Kamerafahrt noch interessanter zu gestalten, soll jetzt noch automatisch rotiert werden. Dazu müssen Inputs hinzugefügt werden, die für die "Enden" der Kamerafahrt jeweils Offsets für die Rotation spezifizieren. Diese Offsets müssen dann beim Rotieren der Kamera entsprechend beachtet werden.
