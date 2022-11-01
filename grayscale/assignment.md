*Erreichbare Punktzahl:* **8 Punkte**

*Das Plattnerpus schaut sich im Familienalbum Bilder seiner Vorfahren an. Da die Familie der Ornithorhynchidae seit 1825 so bezeichnet wird, kann das Plattnerpus seine Vorfahren bis zur Zeit der [ersten Fotografie](https://de.wikipedia.org/wiki/Blick_aus_dem_Arbeitszimmer) zurückverfolgen. Somit enthält das Album viele Schwarzweißfotos.*

Graustufen-Konvertierung ist eine oftmals notwendige Transformation von Bildern, wenn beispielsweise der Drucker keinen Farbdruck unterstützt. Implementieren Sie diese Konvertierung in der Methode `averageGray(...)` indem Sie den Durchschnitt der Farbkanäle bilden und in `weightedGray(...)` in der Sie die Kanäle so gewichten, dass das Ergebnis besser der menschlichen Helligkeitswahrnehmung entspricht. Implementieren Sie zusätzlich eine Schwarz-Weiß-Konvertierung mit Hilfe eines Grenzwertes und eine mit Hilfe des Error-Diffusion-Dithering nach Floyd-Steinberg, bei denen nur schwarze und weiße Pixel verwendet werden. Ergänzen Sie dazu die Methoden `threshold(...)` und `floydSteinberg(...)`.

Die Methoden finden Sie in vscode-link(./code/grayscale.ts). Verwenden Sie die Funktionen `getPixelColor(...)` und `setPixelColor(...)` um Farbwerte aus dem Eingabebild zu lesen bzw. ins Ausgabebild zu schreiben.

### Beispielausgaben

table(4,
    ![](./img/gray_average.png)<br>
    Graustufenbild^, gebildet mit Durchschnitt der Farbkanäle,
    ![](./img/gray_weighted.png)<br>
    Graustufenbild^, gebildet mit gewichteten Farbkanälen,
    ![](./img/bw_threshold.png)<br>
    Schwarz-Weiß-Bild^, gebildet mit Hilfe eines Grenzwertes,
    ![](./img/bw_floyd_steinberg.png)<br>
    Schwarz-Weiß-Bild^, gebildet mit Error-Diffusion-Dithering
)
