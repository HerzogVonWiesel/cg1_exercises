*Erreichbare Punktzahl:* **10 Punkte**

<i>Da die Google-Server mal wieder Probleme machen, will sich der Weihnachtmann nicht auf Google Maps verlassen. Deshalb lässt er von seinen elf Elfen ein eigenes Navigationssystem programmieren.

1. Elf Prima baut eine Benutzeroberfläche.
2. Elf Secundus kümmert sich um die Kommunikation mit Navigationssatelliten.
3. Elf Tria trianguliert darauf basierend die aktuelle Position.
4. Elf Quattro quatscht die ganze Zeit bloß.
5. Elf Quinta bindet die Wunschverwaltungs-API an.
6. Elf Sextus versucht, das Ganze für Arch Linux zu deployen.
7. Elf Septimus hilft ihm dabei, sein System immer wieder zu reparieren.
8. Elf Octavia gibt Acht, dass ihnen die Situation nicht entgleitet.
9. Elf Nova implementiert den Abruf von Kartendaten von OpenStreetMap.
10. Elf Decimus verzweifelt an der optimalen Lösung des Travelling Salesman Problems.
11. Elf Ölf versucht, die Dihydrogenmonoxydkristallstrahltriebwerke anzusteuern. Dazu muss er zwischen der aktuellen und gewünschten Flugrichtung interpolieren.
</i>

Ein Objekt bewegt sich von links nach rechts und soll dabei unter Verwendung verschiedener Interpolationsverfahren rotiert werden. 

Implementieren Sie zunächst Funktionen für die intrisische und extrinsische Rotation in vscode-link(./code/kardan.ts) (2 Punkte).
Die Funktionen erhalten die drei Rotationswinkel in Radianten und geben die entsprechende Rotationsmatrix zurück. Sie können diese Funktionen als Hilfsfunktionen für Ihre weitere Implementierung nutzen.

Implementieren Sie die Hilfsmethoden `lerp` (in vscode-link(./code/lerp.ts), 1 Punkt) und `slerp` (in vscode-link(./code/slerp.ts), 2 Punkte). Die Hilfsmethoden sollen für die lineare bzw. sphärische Interpolation verwendet werden.

Nutzen Sie ihre implementierten Hilfsfunktionen um folgende Interpolationsvarianten umzusetzen:

- Lineare Interpolation der Matrixkoeffizienten in vscode-link(./code/interpolateMatrix.ts) (1 Punkt).
- Lineare Interpolation der Eulerwinkel in vscode-link(./code/interpolateEuler.ts) (2 Punkte).
- Sphärische Interpolation mit Hilfe von Quaternionen in vscode-link(./code/interpolateQuaternion.ts) (2 Punkte).

Bis auf `lerp` und `slerp` selbst dürfen Sie Hilfsfunktionalitäten aus den in `webgl-operate` enthaltenen Klassen `vec3`, `mat4`, `quat` usw. verwenden.

Die Start- und Endorientierung wird durch Eulerwinkel (genauer: Kardanwinkel) in Radianten beschrieben.

- Der Rollwinkel beschreibt die Drehung um die Z-Achse, die zum Betrachter hinzeigt.
- Der Nick-/Pitchwinkel beschreibt die Drehung um die X-Achse, die nach rechts zeigt.
- Der Gier-/Yawwinkel beschreibt die Drehung um die Y-Achse, die nach oben zeigt.

Die Variable `t` läuft während eines Durchlaufs von 0.0 bis 1.0 und definiert den aktuellen Stand der Interpolation.

Zur Kontrolle der eigenen Ergebnisse stehen für die bereitgestellten Voreinstellungen vorberechnete Rotationsmatrizen bereit, die verwendet werden, um eine Kopie des Modells zu rotieren.


## Hinweise

Notation auf [Wikipedia](https://de.wikipedia.org/wiki/Eulersche_Winkel#Kardan-Winkel) $(W)$:

- $x$ zeigt nach vorne
- $y$ zeigt nach rechts
- $z$ zeigt nach oben

Notation in Übung $(Ü)$:

- $x$ zeigt nach rechts
- $y$ zeigt nach oben
- $z$ zeigt nach vorne

Die Notationen können durch Rotation um $\frac{2}{3}\pi$ um Achse $(1, 1, 1)$ ineinander überführt werden.
