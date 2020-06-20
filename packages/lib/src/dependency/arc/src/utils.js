const path = require('path')

function randomEl (list) {
  var i = Math.floor(Math.random() * list.length)
  return list[i]
}

var adjectives = ['adamant', 'adroit', 'amatory', 'animistic', 'antic', 'arcadian', 'baleful', 'bellicose', 'bilious', 'boorish', 'calamitous', 'caustic', 'cerulean', 'comely', 'concomitant', 'contumacious', 'corpulent', 'crapulous', 'defamatory', 'didactic', 'dilatory', 'dowdy', 'efficacious', 'effulgent', 'egregious', 'endemic', 'equanimous', 'execrable', 'fastidious', 'feckless', 'fecund', 'friable', 'fulsome', 'garrulous', 'guileless', 'gustatory', 'heuristic', 'histrionic', 'hubristic', 'incendiary', 'insidious', 'insolent', 'intransigent', 'inveterate', 'invidious', 'irksome', 'jejune', 'jocular', 'judicious', 'lachrymose', 'limpid', 'loquacious', 'luminous', 'mannered', 'mendacious', 'meretricious', 'minatory', 'mordant', 'munificent', 'nefarious', 'noxious', 'obtuse', 'parsimonious', 'pendulous', 'pernicious', 'pervasive', 'petulant', 'platitudinous', 'precipitate', 'propitious', 'puckish', 'querulous', 'quiescent', 'rebarbative', 'recalcitant', 'redolent', 'rhadamanthine', 'risible', 'ruminative', 'sagacious', 'salubrious', 'sartorial', 'sclerotic', 'serpentine', 'spasmodic', 'strident', 'taciturn', 'tenacious', 'tremulous', 'trenchant', 'turbulent', 'turgid', 'ubiquitous', 'uxorious', 'verdant', 'voluble', 'voracious', 'wheedling', 'withering', 'zealous']
var nouns = ['ninja', 'chair', 'pancake', 'statue', 'unicorn', 'rainbows', 'laser', 'senor', 'bunny', 'captain', 'nibblets', 'cupcake', 'carrot', 'gnomes', 'glitter', 'potato', 'salad', 'toejam', 'curtains', 'beets', 'toilet', 'exorcism', 'stick figures', 'mermaid eggs', 'sea barnacles', 'dragons', 'jellybeans', 'snakes', 'dolls', 'bushes', 'cookies', 'apples', 'ukulele', 'kazoo', 'banjo', 'opera singer', 'circus', 'trampoline', 'carousel', 'carnival', 'locomotive', 'hot air balloon', 'animator', 'artisan', 'artist', 'colorist', 'inker', 'coppersmith', 'director', 'designer', 'flatter', 'stylist', 'leadman', 'limner', 'make-up artist', 'model', 'musician', 'penciller', 'producer', 'scenographer', 'silversmith', 'teacher', 'beader', 'foreman', 'maintenance', 'engineering', 'mechanic', 'miller', 'moldmaker', 'panel beater', 'patternmaker', 'plant operator', 'plumber', 'sawfiler', 'shop foreman', 'soaper', 'wheelwright', 'woodworkers']

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

exports.generateRandomName = function () {
  return capitalize(randomEl(adjectives)) + ' ' + capitalize(randomEl(nouns))
}

exports.concatBytes = function (bytes1, bytes2) {
  return bytes1 + (bytes2.slice(2))
}

exports.getBytesLength = function (bytes) {
  return Number(bytes.slice(2).length) / 2
}

exports.importAbi = function (abiPath) {
  let abi = require(`${abiPath}`)
  if (abi.rootVersion) {
    const abiName = abiPath.substring(abiPath.lastIndexOf('/') + 1)
    const abiFolder = path.dirname(abiPath)
    const rootPath = path.join(
      abiFolder, `../${abi.rootVersion}/${abiName}`
    )
    abi = require(`./${rootPath}`)
  }
  return abi
}
