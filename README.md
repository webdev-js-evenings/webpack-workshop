[![Workshop logo](https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/v/t1.0-9/14462927_898177223660398_5621353142294193663_n.jpg?_nc_eui2=v1%3AAeFhqtQn8lYPBHXdBgc-zmRX4SyxuOWbrzHGfER6mzIu2LLpRxQEr6SxGfUaBcUvtkJ_JQMqPzqzcCW-iSBG6SptwUiT_5562xs6uCEV7Y4duQ&oh=fb322963b80d25c8da2466bea0b8f5aa&oe=586C3C50&__gda__=1483427980_b474f06db25908a006e970a2f56269a7)](Workshop logo)

# Webpack - zabal web workshop

## Co se naučíte?
Zařadíme si webpack mezi vývojové nástroje, aby nedošlo k dalším mýlkám. Ukážeme si proč není konkurentem Gulpu nebo Gruntu.

Zkusíme si základní konfiguraci a vysvětlíme si základní pojmy.


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
