*Erreichbare Punktzahl:* **6 Punkte**

Lutz möchte Szenen aus seinen Lieblings-Videospiel teilen und nimmt daher einige Screenshots und Videos auf. Da es zum Zeitpunkt der Aufnahme schon spät in der Nacht ist, hat sich jedoch der Blaulichtfilter automatisch eingeschaltet. Entsprechend haben alle Bilder und Videos eine rötliche Tönung. Die Farbkorrektur manuell auf alles anzuwenden, wäre viel Arbeit, und eine Wiederholung der Aufnahmen ist auch nicht umsetzbar, da Lutz sich nicht sicher ist, ob er den Boss noch mal besiegen kann. Wenn es doch nur eine Möglichkeit gäbe, die gleiche Farbanpassung schnell auf diverse Bilder und Videos anzuwenden...

Color-LUTs (lookup tables) können verwendet werden, um Farbanpassungen vorzuberechnen. Komplexe Filter können performant angewendet werden, indem zur Laufzeit statt der eigentlichen Berechnungen nur ein Texturzugriff ausgeführt werden muss. Ein möglicher Einsatzbereich ist die Verarbeitung von vorhandenen Bild- und Videodaten, aber auch Color Grading von interaktiven Visualisierungen. So unterstützt beispielsweise die Spieleengine Unity Postprocessing mithilfe von LUTs.

Die LUTs beinhalten dabei bereits gefilterte Farbtöne. Der Definitionsbereich dieser Abbildung umfasst den gesamten RGB-Farbraum, allerdings in einer reduzierten Auflösung. Für Eingabewerte, die zwischen Samples liegen, wird in alle drei Dimensionen linear interpoliert. Um den 3D-Raum in einer 2D-Textur abspeichern zu können, werden die "Schichten" der dritten Dimension nebeneinander in einer 2D-Textur gespeichert.

![](./img/lut_3d_2d.png)  
Abbildung des 3D-Farbwürfels auf eine 2D-Textur.

Der Wertebereich kann ebenfalls den gesamten RGB-Farbraum umfassen. Beim anwenden der LUT auf ein Eingabebild wird die Eingabefarbe als Position im Farbwürfel aufgefasst und die an dieser Stelle gespeicherte Farbe verwendet.

In einer Identitäts-LUT verweist jede Farbe auf sich selbst. An der Koordinate (1, 0, 0) ist beispielsweise ein roter Pixel gespeichert. Basierend auf der Identitäts-LUT können z.B. mit üblichen Bildbearbeitungsprogrammen Effekte angewendet werden. Die Ergebnis-LUT kodiert dann die Abbildung der Originalfarben auf gefilterte Farben. Beispiel: Nach einer Farbtonverschiebung ist an der Koordinate (1, 0, 0) statt einem roten nun ein oranger Pixel gespeichert.

table(2,
    ![](./img/lut_labeled.png)<br>
    Identitäts-LUT mit Auflösung 4. Wie im Bild annotiert^, sollten in den markierten Pixeln die entprechenden Extrema der Farbkanäle gespeichert sein.,
    ![](./img/lut_labeled_hueshift.png)<br>
    LUT nach Farbtonverschiebung.
)

### Export der Identitäts-LUT

Über den "Lut exportieren"-Button soll eine Identitäts-LUT in der eingestellten Auflösung exportiert werden. Das Framework ist bereits so aufgesetzt, dass die Ausgabe des vscode-link(./code/export.frag)-Fragmentshaders in eine Textur gerendert und als Browser-Download bereitgestellt wird. Ihre Aufgabe ist, diese Textur mithilfe der `main`-Funktion im Shader zu befüllen. Die Ausgabe einer LUT mit Auflösung 4 sollte der oben gezeigten Identitäts-LUT entsprechen. Weitere Beispiele (in Originalauflösung) finden Sie im Ordner `exampleLuts`. (Anmerkung: Manche Image-Viewer interpolieren zwischen den Pixeln beim Anzeigen des Bildes, sodass sich die einzelnen Pixelwerte nicht mehr auseinanderhalten lassen. Dadurch können die LUTs höher aufgelöst wirken, als sie tatsächlich sind.)

### Anwenden einer LUT auf ein Bild

Über den "LUT importieren"-Dateiinput kann eine LUT ausgewählt werden. Implementieren Sie die Funktion `main` im vscode-link(./code/apply.frag)-Fragmentshader so, dass die gewählte LUT auf das Eingabebild angewendet wird.

### Anmerkung: Verwendung der LUTs in anderen Programmen

Unity kann LUTs im verwendeten Format direkt einbinden. Wie Postprocessing verwendet werden kann, ist [hier](https://docs.unity3d.com/Manual/PostProcessingOverview.html) beschrieben. Das folgende Bild zeigt eine mithilfe von `sepia_64.png` eingefärbte leere Szene.

Adobe-Programme wie Photoshop und Premiere verwenden das [cube-Format](https://wwwimages2.adobe.com/content/dam/acom/en/products/speedgrade/cc/pdfs/cube-lut-specification-1.0.pdf), um LUTs zu speichern. Im `scripts`-Ordner liegt ein Script, um PNGs zu konvertieren. Beispielaufruf (im Ordner colorLut): `node .\scripts\png2cube.js .\exampleLuts\inverse_4.png .\exampleLuts\inverse_4.cube`. Vorsicht: Die Ausgabedatei wird überschrieben, ohne zu fragen. Außerdem können die `cube`-Dateien sehr groß werden, da die Daten als Text gespeichert sind &ndash; `sepia_64.png` erzeugt beispielsweise eine 14 MB große `sepia_64.cube`.

table(3,
    ![](./img/unity_lut.png)<br>
    Verwenden einer LUT in Unity,
    ![](./img/ps_lut.png)<br>
    Verwenden einer LUT in Photoshop,
    ![](./img/premiere_lut.png)<br>
    Verwenden einer LUT in Premiere
)
