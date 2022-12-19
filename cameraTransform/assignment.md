*Erreichbare Punktzahl:* **6 Punkte (+ 1 Bonuspunkt)**

*Clippy möchte in den Clip Space transformiert und dann geclippt werden, denn schließlich hat auch er verstanden, dass es nichts bringt, mehr von sich zu zeigen als am Ende überhaupt sichtbar sein wird. Dabei kommt ihm seine Spezialfähigkeit zu Gute, auch nach Drehung, Streckung und Stauchung beliebige Anteile seiner Oberfläche auszublenden und so die Prozessierungsleistung der GPU bestens auszunutzen.*

In der Vorlesung haben Sie kennengelernt, wie die Szenengeometrie mithilfe von View Transformation und perspektivischer Projektion transformiert wird. Erzeugen Sie die folgenden Matrizen in vscode-link(./code/transformation.ts) jeweils mit `mat4.fromValues`:

- `LookAt` transformiert die Koordinaten so, dass die Kamera im Ursprung platziert wird und in negative z-Richtung (`-z`) schaut.
- `AngleAdjustment` sorgt dafür, dass der horizontale und vertikale Blickwinkel der Kamera jeweils 90° betragen.
- `Scaling` passt die Koordinaten so an, dass die Far-Clipping-Plane bei `z=-1` liegt.
- `PerspectiveTransform` verzerrt das View Frustum zu einem Quader und führt dabei perspektivische Verkürzung ein.

Dabei dürfen aus `mat4` nur die Funktionen `fromValues`/`create` zum Erzeugen und `mul` zum Kombinieren von Matrizen verwendet werden.

Als Eingabewert ist die Kamera gegeben, die alle benötigten Werte liefert. Die berechneten Matrizen werden nacheinander auf die Koordinaten angewendet. Über den Anzeigemodus kann eingestellt werden, bis zu welchem Schritt die Matrizen berechnet werden sollen. Dadurch lässt sich das Ergebnis aller Matrizen bis zu diesem Schritt anzeigen.

#### Bonus

Implementieren Sie die `shouldBeClipped`-Funktion in vscode-link(./code/warpedModel.frag). Diese soll basierend auf der übergebenden homogenen Koordinaten entscheiden, ob ein Fragment verworfen werden kann.

#### Ergebnis

table(3,
    ![Original](./img/0_orig.png)<br>
    Original,
    ![LookAt](./img/1_lookat.png)<br>
    LookAt,
    ![Winkeländerung des Sichtvolumens](./img/2_angle.png)<br>
    Winkeländerung des Sichtvolumens,
    ![Original](./img/3_scale.png)<br>
    Skalierung des Sichtvolumens,
    ![LookAt](./img/4_persp.png)<br>
    Perspektivische Transformation,
    ![Winkeländerung des Sichtvolumens](./img/5_clip.png)<br>
    Clippy-ing
)
