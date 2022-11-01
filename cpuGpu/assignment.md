*Erreichbare Punktzahl:* **8 Punkte**

*Das Plattnerpus mag kein Chlorwasser und setzt sich deshalb immer eine Tauchermaske auf, wenn es ins Schwimmbad geht. Leider beschlägt die Brille beim Tauchen und alles sieht verschwommen aus.*

Viele digitale Bilddaten, insbesondere Fotos, weisen Farbfehler auf. Diese äußern sich z. B. in mangelndem Kontrast, unausgewogener Helligkeit, Farbstichen und Unschärfe. Durch eine digitale Nachbearbeitung können die Bilder meist qualitativ verbessert werden. Bildfilter sind wichtige Vertreter flächenbezogener Bildoperationen, um verschiedene visuelle Effekte zu ermöglichen.

Dabei ist es möglich, diese Effekte sowohl auf dem Prozessor, als auch auf der Grafikkarte zu implementieren. Eine CPU-seitige Implementierung ist intuitiver und meist einfacher umzusetzen. Eine GPU-seitige Umsetzung hat hingegen den Vorteil, aufgrund der guten Parallelisierbarkeit performanter umsetzbar zu sein.

Implementieren Sie die folgenden Bildfaltungsoperationen sowohl CPU-, als auch GPU-seitig:
- Box Blur / Weichzeichner: Erzeugen Sie einen Unschärfeeffekt mit einem quadtratischen Kernel.
  - CPU: Implementieren Sie die Funktion `blur()` in vscode-link(./code/blur.ts). Der Kernel soll dabei eine anpassbare Größe haben, der Radius ist in der Variable `blurRadius` bereitgestellt. Das Originalbild ist in `inputImage` gespeichert, das Ausgabebild in `outputImage`, beide vom Typ `Uint8Array`. Die Variablen `width` und `height` stellen die Abmessungen der Bilder bereit.
  - GPU: Implementieren Sie die Funktion `void main(void)` in vscode-link(./code/blur.frag). Die verfügbaren Variablen sind am Anfang der Datei beschrieben. Der Ergebniswert muss in `fragColor` gespeichert werden.
- Laplace-Filter: Es ist Ihnen überlassen, ob Sie bei der Kantenerkennung die diagonal verbundenen Pixel miteinbeziehen.
  - CPU: Implementieren Sie die Funktion `laplace()` in vscode-link(./code/laplace.ts). Die verfügbaren Variablen sind die gleichen wie beim Blur, jedoch ohne anpassbaren Radius, da der Kernel eine feste Größe besitzt.
  - GPU: Implementieren Sie die Funktion `void main(void)` in vscode-link(./code/laplace.frag). Die verfügbaren Variablen sind am Anfang der Datei beschrieben. Der Ergebniswert muss in `fragColor` gespeichert werden.

### Beispielausgaben

table(4,
    ![](./img/cpuGpu_blur.png)<br>
    Weichgezeichnetes Ergebnisbild,
    ![](./img/cpuGpu_edge.png)<br>
    Ergebnisbild der Kantenerkennung
)
