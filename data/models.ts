const stl = new Map<string, string>([
    ['Runder Würfel', require('./models/cube.stl')],
    ['Suzanne', require('./models/monkey.stl')],
    ['Würfel', require('./models/real_cube.stl')],
    ['Schraube', require('./models/screw.stl')],
]);

const glb = new Map<string, string>([
    ['Hubschrauber', require('./models/roflcopter.glb')],
    ['Heißluftballon', require('./models/balloon.glb')],
    ['Koordinaten', require('./models/coordinates.glb')],
    ['Menger-Schwamm', require('./models/mengerSponge.glb')],
    ['Geschenk', require('./models/present.glb')],
    ['Karl Klammer', require('./models/clippy.glb')],
    ['Häufchen', require('./models/poop.glb')],
    ['Lachendes Gesicht', require('./models/rofl.glb')],
    ['Tanzender Außerirdischer', require('./models/alien.glb')],
    ['Einheitswürfel (CG)', require('./models/unitCube.glb')],
    ['Einheitswürfel (DE)', require('./models/einheitswuerfel.glb')],
]);

const scenes = new Map<string, string>([
    ['Minecraft-Dorf', require('./models/village.glb')],
    ['Wasserfall', require('./models/waterfall.glb')],
    ['Weihnachtsdorf', require('./models/xmasVillage.glb')],
]);

export {
    stl, glb, scenes
};
