*Erreichbare Punktzahl:* **10 Punkte (+ 2 Bonuspunkte)**

*Das Plattnerpus hat sich eine Lavalampe gekauft. Doch leider funktioniert sie noch nicht.*

Schreiben Sie eine Visualisierung von Metabällen. Gegeben seinen $n$ Bälle. Eine 2D-Metaball-Funktion ist gegeben als die Menge von Dichtefunktionen

$$f_i(x,y)=\left( \frac{ r_i }{ \sqrt{\left( x - x_i \right)^2 + \left( y - y_i \right)^2 } } \right)^2$$

wobei $(x_i, y_i)$ das Zentrum des i-ten Balls angibt, $r_i$ den Radius und $(x, y)$ den zu untersuchenden Punkt. $f(x, y)$ gibt also die Dichte des Balls am Punkt $(x, y)$ zurück (Abstand zum Kreismittelpunkt). Wenn die Summe der Dichten aller Metabälle am Punkt $(x, y)$ größer als ein Schwellwert $s$ ist, also

$$\sum_{ i=0 }^{ n } f_i(x,y) > s$$

wird die Fläche an der Stelle gefüllt. Nehmen Sie für diese Aufgabe $s = 1.0$ an.

Implementieren Sie das entsprechende Verfahren in der Datei vscode-link(./code/metaballs.frag), um eine Ausgabe vergleichbar mit der ersten Abbildung zu erzeugen.

Implementieren Sie eine weitere Visualisierung, die der zweiten Abbildung entspricht, um bis zu zwei Bonus-Punkte zu erhalten.

### Beispielausgabe

table(4,
    ![](./img/metaballs_bw.png)<br>
    Metaball-Visualisierung mit weißen Bällen auf schwarzen Hintergrund,
    ![](./img/metaballs_color.png)<br>
    Metaball-Visualisierung mit bunten Farbverläufen zwischen den Bällen
)
