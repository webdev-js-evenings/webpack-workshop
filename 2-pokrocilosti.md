# 2. část - Pokročilosti

## Produkční build
V produkčním buildu je třeba dávat pozor na tyhle záludnosti v konfiguraci Webpacku:

- `dev` - `boolean`, v produkci vždy `false`.
- `devTool` - nastavit na `source-map` vygeneruje plnou source mapu, v `dev` mód to tak nikdy nemějte,
generování source mapy je příšerně pomalé, radši použijte `eval-source-map`

### Pluginy
Tipy výše jsou naprostý základ, který musí mít produkční build nastavené správně. Ovšem to,
co vám build může opravdu zmenšit a zoptimalizovat jsou pluginy. 

Pluginy nefungují jako loadery, aplikují se na celý výsledný balíček a mohou s ním dělat psí kusy:
- vytáhnout z něj css do vlastního soubur `ExtractTextWebpackPlugin`
- projít použitý kód a vymazat duplicity `DedupePlugin`
- nastavit globální proměnné podle kterých se dá "vyifovat" nechtěný kód v produkci
- minifikovat build
- najít nepoužívané soubory
- vytvořit společný `chunk` pro kusy kódu použivané v různých `chunks`
- vyhodit notifikaci, že se při buildu vyskytla chyba - hodí se, když nemáte otevřenou konzoli

A spousta dalších je [v dokumentaci](https://webpack.github.io/docs/list-of-plugins.html).

Samozřejmě si musíme ukázat minifikovací plugin. K jeho použití stačí jen přidat `plugins` klíč
do konfigurace, který je pole:

```js
module.exports = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true
        warnings: false
      }
    })
  ]
}
```
Tady není moc co vyprávět - plugin, který spustí `UglifyJS` na výsledné `chunks`. Must have!
Jen poznámka - `UglifyJsPlugin` nefunguje, pokud máte nastavený `devTool` na `eval` nebo tomu něco podobného.
Musíte tam mít nastavený nějaký produčkní dev tool, typicky `source-map`.

Daleko zajímavější je `DefinePlugin`
```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(if args.production then 'production' else 'development')
      }
      '__DEVTOOLS__': not args.production
      '__DEV__': not args.production
    })
  ]
}
```
Define plugin přidá do běžícího Javascriptu v prohlížeči globání proměnné. Na tom není nic světoborného,
ale Webpack dokáže pochopit, že pokud je část kódu v ifu, kde je použitá taková proměnná, tak tenhle kus
kódu dokáže z výsledného buildu smazat - diky `UglifyJsPlugin`!

Takže pokud máte třeba nějaké dlouhé warningové hlášky v konzoli, Webpack je pro produkci prostě vymaže z buildu,
aniž byste museli něco řešit. Tuhle techniku používá i React, proto někdy v Reactovém kódu vidíte něco jako:
`Minified exception...`.

```js
if (__DEVTOOLS__) {
  // Pokud bude ___DEVTOOLS__ true, tenhle kód se prostě vymaže
  loadDeveloperTools()
}
```
Samozřejmě se dají definovat i klasický `env` proměnné. To se hodí pro ifování produkčního módu v aplikaci.
Nastavení je možné si prohlédnout v [webpack-plugins.config.js](./config/webpack-plugins.config.js).

A vyzkoušet:
```
// dev mód
node_modules/.bin/webpack --config configs/webpack-plugins.config.js
// produční mód
npm run build:plugins
```

## Code splitting
Asi nejvíc cool věc.

Snad jsme všichni zažili to štěstí, kdy naše aplikace začala být velice úspěšná a
jak jsme tam přidávali fanaticky nové fíčury tak najednou celý výsledný javascriptový
kód čítal několik stovek kilobytů i v gzipnuté podobě.

Nebo jsme si řekli - proč by chudák uživatel na stránce "o nás" měj stahovat do svého
počítače javascript, který se stará o výpis produktů a tudíž se používá na zcela jiné stránce?

Na obě tyto situace tvůrci Webpacku mysleli a proto do něj zabudovali možnost rozdělování
kódu na části `chunks` - tedy umožnili techniku `code splitting`. 

Jak název napovídá jde o rozdělené Javascriptového kódu né podle názvu souborů, jak se to dělalo dřív,
ale podle sématiky kódu.

Tudíž jak jsem psal výše. S Webpackem jde snadno docílit toho, že si řeknete "OK, tuhle část kódu stejně
potřebuju jenom na homepega, tak kód pro ní nechám stahovat jenom pro uživatele, kteří jdou sem, ostatním
se tahle část kódu nebude vůbec stahovat."

Tohle je docela wow technologie, ne? Navíc to jde opravdu snadno.

Ano jistě, je tu standard AMD, který je od definice asynchronní. Nicméně Webpack hezky spojuje synchronní načítání
kódu s asynchronním a skoro tak dobře, že to ani není poznat.

Jdeme se mrknout na příklad v souboru [src/prod/index.js](./src/prod/index.js).

Zajímavá je pak tahle část: 
```js
  _loadPage(url) {
    if (url === 'druha-stranka') {
      require.ensure([], (require) => {
        const page = React.createFactory(require('./druha-stranka'))
        this.setState({ page, url })
      })

      return
    }

    if (url === '/') {
      require.ensure([], (require) => {
        const page = React.createFactory(require('./prvni-stranka'))
        this.setState({ page, url })
      })
      
      return
    }

  }

```
Tenhle kód říká Webpacku: "Kromě tohodle souboru mi vytvoř dva zvláštní javascriptové balíčky,
ve kterém bude pouze kód, který používají moduly `./druha-stranka` a `./prvni-stranka`. Tento kód
stáhni pouze v případě, jsou-li splněny podmínky podle proměnné `url`."

Ano, takhle je to jednoduché. Však si spusttě tenhle příklad příkazem:
```
npm run server:prod
``` 
Otevřete si `Network` v `DevTools` a klikejte na odkaz. Vidíte, jak se další části kódu stahují?

Paráda, ne?

Jen pro informaci - v příkladu je React, pře je hezky vidět, že se nějaký kód používá na nějaké stránky a jiný na jiné.
Tohle je právě nejvíc vidět u šablon - proč stahovat šablonu, která se na dané stránce nevykresluje, že?
Jinak ale tahle technologie je zcela nezávislá na Reactu, však si to můžete sami zkusit!

## React Hot Module Replacement



## Demo time
A teď si vytvoříme pořádné nastavení pro Webpack!
