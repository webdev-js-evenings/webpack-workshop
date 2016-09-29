[![Workshop logo](https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/v/t1.0-9/14462927_898177223660398_5621353142294193663_n.jpg?_nc_eui2=v1%3AAeFhqtQn8lYPBHXdBgc-zmRX4SyxuOWbrzHGfER6mzIu2LLpRxQEr6SxGfUaBcUvtkJ_JQMqPzqzcCW-iSBG6SptwUiT_5562xs6uCEV7Y4duQ&oh=fb322963b80d25c8da2466bea0b8f5aa&oe=586C3C50&__gda__=1483427980_b474f06db25908a006e970a2f56269a7)](Workshop logo)

# Webpack - zabal web workshop

## Co se naučíte?
Zařadíme si webpack mezi vývojové nástroje, aby nedošlo k dalším mýlkám. Ukážeme si proč není konkurentem Gulpu nebo Gruntu.

Zkusíme si základní konfiguraci a vysvětlíme si základní pojmy.

Bude tady hafo pojmů, proto doporučuji nejdřív přojít [můj článek o pojmech na frontendu](https://medium.com/@vojta/slovn%C3%AD%C4%8Dek-pro-weba%C5%99%C5%AF-v-roce-2015-4edac369d3a3#.dpozlpfja).


## Co je ten Webpack?
Každý z nás asi zná Grunt nebo Gulp a může se zdát, že Webpack nahrazuje Gulp nebo Grunt.

Tak to ale opravdu není. Webpack je nástroj pro "balení webu". Není to nástroj, kde si nakonfigurujete úkoly, které se mají spustit, když se stane to nebo to.

Webpack je opravdu jenom o tom, aby zabalil nějaký soubor pro jeho použití na webové platformě a prakticky víc toho nedokáže, není to nijak zvlášť univerzální nástroj.
Má ovšem vychytávky, které před ním nebyly možné a na ty se podíváme.

### Srování
Webpack tedy není jako Gulp, nelze na něm vydefinovat konkrétní kroky úkolů, které se mají stát kdy chceme.

Webpack je konkurencí nástroje Browserify.

Browserify je nástroj, který zabaluje javascriptové moduly podle stejného principu jako funguje commonjs. (co je to common js?).

Tedy ve zdrojácích v node.js je naprosto běžné vidět tohle:
``` js
const actions = require('./src/actions')
```

Tenhle kód říká - natáhni mi obsah souboru `./src/actions`. Avšak je jasné, že tohle prostě nefunguje na webu (zatím). Browser nezná žádnou funkci `require()`.

Neumí synchronně stahovat `.js` zdrojáky a pak ještě pouštět. Na webu se to tedy musí dělat zcela jinak.

A proto zvnikl nástroj Browserify. Neboli `zprohlížovačení`. Browserify prostě udělá to, že staticky zanalyzuje daný javascriptový soubor, najde v něm `require()` volání.
A tyhle volání pak ve zdrojáku přepíše tak, že zkopíruje obsaho requirovaného .js zdrojáku a nahradí jím volání `require()` - tohle všechno samozřejmě naprosto staticky.
Browserify pak vyplivne nějaký `bundle.js` ve kterém jsou zabalené všechny závislosti přes `require()` jako by byly všechny ve stejném souboru. No a posléze je už možné tenhle `bundle.js`.
Použít v prohlížeči.

Je to tak jasné?

Takže. Webpack je konkurence pro Browserify, jeho pole působnosti nemůže obsáhnout hřiště Gruntu nebo Gulpu, které jsou obecné task runnery, ale může je zcela zastoupit v jiných věcech.

### Co všechno umí
Webpack umí:
- konfigurace přes "json"
- zabalit .js soubory stejně jako Browserify
- zabalit i jakékoli jiné druhy souborů, pokud k nim existuje `loader` (`.css, .jpg, .woff, .elm...`)
- rozdělit výsledný .js balíček do více částí (chunků) = code splitting
- zaručit, aby se části kódu, které jsou v jiných soubor chovaly jako volání asynchronního kódu
- má `webpack-dev-server` který dokáže vyměňovat změněné balíčky kódu za běhu přes reloadnutí browseru (to platí i pro .js)
- může být spuštěn jako gulp/grunt task

Webpack neumí:
- spouštět obecné úkoly (kopírování souborů, volání externích skriptů)

## Jak se to nastavuje
Vycházím z [dokumentace](https://webpack.github.io/docs/configuration.html) na [ofiko stránkách Webpacku](https://webpack.github.io/docs/configuration.html).

Webpack sám o sobě toho moc nedělá, když si ho nainstalujete, tak mu musíte napsat konfigurák, který se jmenuje `webpack.config.js`.
Když pak napíšete `node_modules/.bin/webpack` tak se tento konfigurák automaticky vezme podle jména a aplikuje se.

Konfigurace vypadá tak, že se ze souboru exportuje konfigurační objekt, základní nastavení je třeba tenhle soubor [webpack-basic.config.js](configs/webpack-basic.config.js).

Můžeme si ho tady z repozitáře spustit příkazem `node_modules/.bin/webpack --config ./configs/webpack-basic.config.js`

A co se stalo? Měl by se vygenerovat JSkový balíček pro web v souboru `./dist/bundle.js`.

Hrozná magie, teď se mrkneme pořádně na celou konfiguračku v souboru [webpack-basic.config.js](configs/webpack-basic.config.js).

Za zmínku stojí klíč `devtool`. Devtool nastavuje to, jak má být výsledný kód generovaný webpackem čitelný.

Můžeme použít jenom `eval` a to znamená, že se kód bude spouštět přes `eval`, děje se tam nějaká magie, ale buildovaný a přebuildování je nejrychlejší.

Eval jako devtool stačí v projektech, kde pracujeme s čistým JS a kód je čitelný i když je prohnaný přes webpack. Většinou ale máme nějaký preprocessor třeba `babel` 
a proto je zvykem používat source mapy, které dokáží ukázat kde se co v kódu děje v jeho nezkompilované části.
Pro source mapy můžeme nastavit `eval-source-map` pro dev mód a pro produkci pak klasickou `source-map`, která se vygeneruje vedle výsledku. 
Vytvářní source map samozřejmě trvá déle než prosté spouštění, tak na na to bacha.

Celá dokumentace pro `devtool` je [zde](https://webpack.github.io/docs/configuration.html#devtool).


### Loadery
Tak to není tak wow. Každopádně webpack je schopný requirovat **všechny typy souborů 
ke kterým existuje loader**. 

[Loader](https://webpack.github.io/docs/configuration.html#module-loaders) je npm modul, který se instaluje zvlášť a když pak takový loader aplikujeme, 
můžeme například vesele importovat `.css, .sass, .jsx, .es6.js, .jpg, .png, .gif, .webm, .woff, .eot, .html...`

Na tohle všechno existují loadery nebo prostě si nastavíme jakoukoli příponu souboru chceme, aby byla zpracovávána loaderem.

První jednoduchý loader pro CSS si můžeme prohlédnout v souboru [webpack-css.config.js](configs/webpack-css.config.js).

Loadery mají všelijaké nastavení, které se aplikuje přes query stringy `wtf`? Je to vidět u nastavení css loaderu.

Krom toho se dá specifikovat pro každý loader, v jakých složkách a souborech se může aplikovat nebo na které se má vykašlat. To jsou klíče `exluce a include`.

Všimněte si, že v [webpack-css.config.js](configs/webpack-css.config.js) je už halda jiných loaderů - přidal jsem loadery pro obrázky a fonty. Můžete si schválně zkusit, jaký je výsledek.


#### Vyplivnutí .css
Všimněte si, že Webpack nám pořád generuje jenom `.js` soubor a to není moc fajn, když potřebujeme i `.css`, ne?

Na to slouží jeden z pluginů `extract-text-webpack-plugin`, který takovou krkolomnou cestou vyzobe z buildu `.css` a nacpe vám je kam chcete.

Každopádně funguje jak byste čekali. (nezapomeňte na přepínač `-p`, který jsem tam vlastnoručně nastavil).

V css příkladu si všimněte, že sass kód není vygenerován do výsledných css protože tam není explicitně použit `extract-text-webpack-plugin`.


#### Babel loader
Jak víte, s `babel` se ten boilerplate trošku zvětšuje a je třeba nastavit si i `.babelrc`, který říká, jak se má babel kompilovat.

V tomhle projektu je nastavený snad nejvíc cutting-edge babel, co můžete mít společně s `Reactem` a `stage-0 preset`, takže můžete používat i `async a await`.

S async a await se pojí problém `babel-polyfill`, který je třeba přidat jako entrypoint. Pokud nevíte, co je polyfill - [můj článek vám to vysvětlí](https://medium.com/@vojta/slovn%C3%AD%C4%8Dek-pro-weba%C5%99%C5%AF-v-roce-2015-4edac369d3a3#.dpozlpfja).

Nicméně si můžeme ten kód vyzkoušet! A víte co? Rovnou si ho zkusíme s `webpack-dev-server`.

### Webpack dev server
To je asi ta nejvíc wow věc na Webpacku. Tedy - Webpack má zabudovaný server, který dokáže sám kontrolovat změny `watch` v requirovaných souborech a pak je dokáže aplikovat.

Dokáže je aplikovat dokonce tak, že není potřeba reloadnout stránku. Tohle funguje hrozně fajn s css - není třeba rvát žádný další JS kód do stránky a všehcno prostě funguej.

Můžeme si to vyzkoušet pro začátek jenom s css: `./node_modules/.bin/webpack-dev-server --hot --config configs/webpack-css.config.js --content-base example/`

Spustí server tak, že:
- `--hot` - bude se pokoušet o hot reload stránky (né celkový refresh), bude-li to možné
- `--config configs/webpack-css.config.js` - použije námi specifikovaný config (nikoli default `./webpack.config.js`)
- `--content-base example/` - root server bude nastavený na `./example`

Můžeme přidat:
- `--port 3333` změna portu
- `--progress` zobrazí progres buildu

V tomhle projektu je zkratka přes npm script: `npm run server:css`

Výsledkem tohodle příkazu je, že v browseru můžete přejít na [http://localhost:8080](http://localhost:8080), kam webpack servíruje soubor `example/index.html`,
ve kterém je nalikovaný Webpackem generovaný bundle z `http://localhost:8080/bundle.js` a k tomu vidíme nějaké sprostosti v konzoli.

Jakože `[HMR] Waiting for update signal from WDS...` a `[WDS] Hot Module Replacement enabled.`. To znamená, že se browser připojil na Webpackový socket a poslouchá změny.

Jen si zkuste udělat změnu v souboru `src/styles/style.css`. Samozřejmě hot funguje i pro `sass`, tedy změny v souboru `src/styles/style.sass` též běží.

No to je paráda. Bohužel, tohle nemůže funguje pro Javascript, minimálně tedy ve velice limitované formě, [ale dá se to nastavit](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html).

Nicméně si můžeme zkusit spustit i `webpack-dev-server` s config s `babel-loader` nastaveným: `webpack-dev-server --hot --config configs/webpack-babel.config.js --content-base example/`.

V [webpack-babel.config.js](./configs/webpack-babel.config.js) jsem nastavil i `devtool` na `eval-source-map`, tudíž při chybě bude vidět i přesně zdroják, kde se cyhba vyskytla.

Nezapomeňme tohle vypnout pro produkci!!

Nicméně tady fungují i legrace jako async a await, takže tohle nastavení můžeme vesele použít.

No a teď si můžeme všichni zkusit nastavit nějaký hezký skoro produkční `webpack.config.js`, směle do toho!

Příště si (snad) ukážeme HMR s reactem a zoptimalizujeme si build, aby nebyl tak velký.
