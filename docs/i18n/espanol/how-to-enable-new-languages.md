# Implementando nuevos idiomas en `/learn`

To enable a new language on `/learn` (curriculum), you need to complete the following steps:

- Complete translating and approving the first 3 certifications on Crowdin. (New Responsive Web Design, JavaScript Algorithms and Data Structures, and Front End Development Libraries)
- Complete translating and approving all strings in Learn UI project on Crowdin.
- Update Crowdin settings to add a custom language code for the new language.
- Open the 1st PR to configure GitHub Actions. You need to update 2 files:
  - `crowdin-download.client-ui.yml`
  - `crowdin-download.curriculum.yml`
- Open the 2nd PR to add other configurations. You need to update/add the following files:
  - Update `i18n.ts`
  - Update `superblocks.ts`
  - Update `algolia-locale-setup.ts`
  - Add `links.json`
  - Add `meta-tags.json`
  - Add `motivation.json`
- Ask infrastructure team to spin up the VM for the new language.
- Once the VM is ready, open the 3rd PR to show the new language in the navigation menu.

We will explain each step in the following sections.

## Actualizando los ajustes de Crowdin

Antes de poder publicar un nuevo idioma, tendrás que permitir que los idiomas se descarguen de Crowdin. To configure that, you need to add a custom language code for your language.

In the `Curriculum` and `Learn UI` projects on Crowdin, you will need to select `Settings` > `Languages` from the sidebar. Luego, busca la opción `Language Mapping`, donde encontrarás la opción de añadir códigos personalizados para los idiomas. Añade una nueva entrada para el idioma que publicarás: seleccionando `language` como el valor de `Placeholder` e ingresando el nombre del idioma en minúsculas para el valor de `Custom code`. If you aren't sure what to use, or you don't have an admin role and can't see the settings, reach out in our contributor chat and we will assist you.

## Updating Workflows for GitHub Actions

Then you need to configure the syncing between Crowdin and GitHub.

You will need to add a step to the [`crowdin-download.client-ui.yml`](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/.github/workflows/crowdin-download.client-ui.yml) and [`crowdin-download.curriculum.yml`](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/.github/workflows/crowdin-download.curriculum.yml). Los pasos a seguir en los dos casos son iguales. Por ejemplo, si quisieras habilitar las descargas de Dothraki, la instrucción a añadir en los dos documentos sería:

```yml
##### Download Dothraki #####
- name: Crowdin Download Dothraki Translations
  uses: crowdin/github-action@master
  # options: https://github.com/crowdin/github-action/blob/master/action.yml
  with:
    # uploads
    upload_sources: false
    upload_translations: false
    auto_approve_imported: false
    import_eq_suggestions: false

    # downloads
    download_translations: true
    download_language: mis
    skip_untranslated_files: false
    export_only_approved: true

    push_translations: false

    # pull-request
    create_pull_request: false

    # global options
    config: './crowdin-config.yml'
    base_url: ${{ secrets.CROWDIN_BASE_URL_FCC }}

    # Uncomment below to debug
    # dryrun_action: true
```

Ten en cuenta que la opción `download_language` deberá corresponder al código del idioma que aparece en Crowdin.

## Habilitando un idioma

> [!NOTA] La sección anterior con la actualización de los flujos de trabajo debería estar completos antes de continuar, estos deben hacerse en pasos separados o las compilaciones fallarán.

Hay algunos pasos a seguir para permitirle a la base de código compilarse a tu idioma de preferencia.

First, visit the [`shared/config/i18n.ts`](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/config/i18n.ts) file to add the language to the list of available languages and configure the values. Aquí hay varios objetos.

- `Languages`: Add the new language to `Languages` enum, similar to the others. The string value here will be used in the `.env` file to set a build language later.
- `availableLangs`: Add the new property from the `Languages` enum to both the `client` and `curriculum` arrays.
- `i18nextCodes`: Estos son los códigos de idioma ISO para cada lenguaje. Necesitarás añadir el código ISO correspondiente para el idioma que estás activando. Estos deben ser únicos para cada lenguaje.
- `LangNames`: Estos son los nombres mostrados para el selector de idiomas en el menú de navegación.
- `LangCodes`: Estos son los códigos de idiomas usados para formatear fechas y números. Estos deben ser códigos Unicode CLDR en vez de los códigos ISO.
- `hiddenLangs`: Estos idiomas no se mostrarán en el menú de navegación. Esto es usado para los idiomas que todavía no están listos para su lanzamiento. Include your language in this array in the first PR and ask staff team to prepare the VM instance for your language. When the VM is ready, make another PR to remove it from the array.
- `rtlLangs`: These are languages that read from right to left.

As an example, if you wanted to enable Dothraki as a language, your `i18n.ts` objects should look like this:

```js
export enum Languages {
  English = 'english',
  Espanol = 'espanol',
  Chinese = 'chinese',
  ChineseTraditional = 'chinese-traditional',
  Dothraki = 'dothraki'
}

export const availableLangs = {
  client: [
    Languages.English,
    Languages.Espanol,
    Languages.Chinese,
    Languages.ChineseTraditional,
    Languages.Dothraki
  ],
  curriculum: [
    Languages.English,
    Languages.Espanol,
    Languages.Chinese,
    Languages.ChineseTraditional,
    Languages.Dothraki
  ]
};

export const i18nextCodes = {
  [Languages.English]: 'en',
  [Languages.Espanol]: 'es',
  [Languages.Chinese]: 'zh',
  [Languages.ChineseTraditional]: 'zh-Hant',
  [Languages.Dothraki]: 'mis'
};

export enum LangNames = {
  [Languages.English]: 'English',
  [Languages.Espanol]: 'Español',
  [Languages.Chinese]: '中文（简体字）',
  [Languages.ChineseTraditional]: '中文（繁體字）',
  [Languages.Dothraki]: 'Dothraki'
};

export enum LangCodes = {
  [Languages.English]: 'en-US',
  [Languages.Espanol]: 'es-419',
  [Languages.Chinese]: 'zh',
  [Languages.ChineseTraditional]: 'zh-Hant',
  [Languages.Dothraki]: 'mis'
};

export const hiddenLangs = ['dothraki'];

export const rtlLangs = [''];
```

> [!NOTE] When a language has been set up in the deployment pipeline AND has a public `/learn` instance live, it can be removed from the `hiddenLangs` array and be made available to the public.

### Set Translated SuperBlocks

In the [shared/config/superblocks.ts](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/shared/config/superblocks.ts) file, add the new language to the `notAuditedSuperBlocks` object. This lists all the superblocks which are not fully translated. Add an array of superblocks which have not been fully translated to it. For example:

```js
export const notAuditedSuperBlocks: NotAuditedSuperBlocks = {
  ...
  [Languages.Dothraki]: [
    SuperBlocks.DataVis,
    SuperBlocks.RelationalDb,
    SuperBlocks.BackEndDevApis,
    SuperBlocks.QualityAssurance,
    SuperBlocks.SciCompPy,
    SuperBlocks.DataAnalysisPy,
    SuperBlocks.InfoSec,
    SuperBlocks.MachineLearningPy,
    SuperBlocks.CollegeAlgebraPy,
    SuperBlocks.FoundationalCSharp,
    SuperBlocks.CodingInterviewPrep,
    SuperBlocks.ProjectEuler,
    SuperBlocks.JsAlgoDataStructNew,
    SuperBlocks.TheOdinProject
  ]
}
```

Be sure to only add the superblocks which are **not** fully translated and approved. The translated superblocks will be calculated from this object. When a new superblock is finished being fully translated, remove it from the array for that language.

See the `SuperBlocks` enum at the beginning of the same file for the full list of superblocks.

### Configure Search

Next, open the [`client/src/utils/algolia-locale-setup.ts`](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/client/src/utils/algolia-locale-setup.ts) file. Estos datos son utilizados por la barra de búsqueda que carga artículos de `/news`. Si bien es poco probable que vayas a probar esta funcionalidad, lea falta de datos para tu lenguaje puede llevarle a errores al intentar construir el código base localmente.

Agrega un objeto para al objeto `algoliaIndices`. Deberñias usar los mismos valores del objeto `english` para pruebas locales, remplazando la clave `english` con el valor `avalaibleLangs` para tu idioma.

> [!NOTE] Si ya hemos desplegado una instancia de noticias en tu destino de idioma, puedes actualizar los valores para reflejar la instancia real. De lo contracio, use los valores del inglés.

Si tuvieras que añadir el idioma Dothraki:

```js
const algoliaIndices = {
  english: {
    name: 'news',
    searchPage: 'https://www.freecodecamp.org/news/search/'
  },
  espanol: {
    name: 'news-es',
    searchPage: 'https://www.freecodecamp.org/espanol/news/search/'
  },
  chinese: {
    name: 'news-zh',
    searchPage: 'https://chinese.freecodecamp.org/news/search/'
  },
  'chinese-traditional': {
    name: 'news-zh',
    searchPage: 'https://chinese.freecodecamp.org/news/search'
  },
  dothraki: {
    name: 'news',
    searchPage: 'https://www.freecodecamp.org/news/search/'
  }

  // If we already have /news in the target language up and running, you can update the values like this:
  // dothraki: {
  //   name: 'news-mis',
  //   searchPage: 'https://www.freecodecamp.org/dothraki/news/search/'
  // }
};
```

### Client UI

Necesitará dar un paso adicional para manejar las traducciones de la interfaz de usuario del cliente.

Los flujos de trabajo de Crowdin bajarán automáticamente  _algunas_ traducciones de la interfaz de usuario, pero hay un par de ficheros que necesitan ser movidos manualmente.

You will want to copy the following files from [`/client/i18n/locales/english`](https://github.com/freeCodeCamp/freeCodeCamp/tree/main/client/i18n/locales/english) to `/client/i18n/locales/<your-language>`, and apply translations as needed:

- `links.json`
- `meta-tags.json`
- `motivation.json`

You don't have to have everything in these 3 files translated at first. It's possible to translate only the relevant parts and make adjustments later.

#### `links.json`

You can replace any URLs that you have corresponding pages ready in your language.

For example, if you have the publication in your language, you can replace the URL for `"news"`. If you want to translate articles listed in the footer links, see [How to Translate Articles in the Footer Links](language-lead-handbook.md#how-to-translate-articles-in-the-footer-links).

#### `meta-tags.json`

This file contains metadata for the web page of `/learn` in your language. You can translate the values for `"title"`, `"description"`, and `"social-description"`. The value for `"youre-unsubscribed"` is used when someone unsubscribes from Quincy's weekly email.

Also, you can translate or add relevant keywords in your language to the `"keywords"` array.

#### `motivation.json`

This file contains the compliments that will be displayed to campers when they complete a challenge, and motivational quotes that are displayed on the top page of `/learn`.

You can translate them, or even replace them with relevant compliments/quotes of your choice in your language.

### Enabling Localized Videos

This section is applicable only if you have localized videos in the challenges. Otherwise, you can skip this section.

Para los desafìos de video, debe cambiar algunas cosas. First, add the new locale to the GraphQL query in the [`client/src/templates/Challenges/video/Show.tsx`](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/client/src/templates/Challenges/video/show.tsx) file. Por ejemplo, agregando a Dothraki para la consulta:

```tsx
  query VideoChallenge($slug: String!) {
    challengeNode(fields: { slug: { eq: $slug } }) {
      videoId
      videoLocaleIds {
        espanol
        italian
        portuguese
        dothraki
      }
      ...
```

Luego agregue un ID para el nuevo idioma a cualquier desafío de video en un bloque auditado. For example, if `auditedCerts` in `i18n.ts` includes `scientific-computing-with-python` for `dothraki`, then you must add a `dothraki` entry in `videoLocaleIds`. La parte delantera debería verse así:

```yml
videoLocaleIds:
  espanol: 3muQV-Im3Z0
  italian: hiRTRAqNlpE
  portuguese: AelGAcoMXbI
  dothraki: new-id-here
dashedName: introduction-why-program
---
```

Actualice la interfaz  `VideoLocaleIds` en  `client/src/redux/prop-types` para incluir el nuevo idioma.

```ts
export interface VideoLocaleIds {
  espanol?: string;
  italian?: string;
  portuguese?: string;
  dothraki?: string;
}
```

And finally, update the challenge schema in `curriculum/schema/challengeSchema.js`.

```js
videoLocaleIds: Joi.when('challengeType', {
  is: challengeTypes.video,
  then: Joi.object().keys({
    espanol: Joi.string(),
    italian: Joi.string(),
    portuguese: Joi.string(),
    dothraki: Joi.string()
  })
}),
```

## Testing Translations Locally

Si desea probar las traducciones localmente, antes de añadirlas a nuestro repositorio principal, salte los cambios del flujo de trabajo de Crowdin. Siga los pasos para activar un idioma, luego descargue las traducciones de Crowdin y cargue las traducciones en su código local.

Como el lenguaje no ha sido aprovado para producción, nuestros scripts aún no descargan las traducciones de manera automática. Sólo el personal tiene acceso a la descarga directa de traducciones. Eres bienvenido a comunicarte con nosotros en nuestra [contributors chat room](https://discord.gg/PRyKn3Vbay), o puedes traducir los archivos markdown localmente con razones de testeo.

Una vez que poseas los archivos, necesitarás colocarlos en el directorio correcto. Para los desafíos de currículum, deberías colocar las carpetas de certificación (i.e. `01-responsive-web-design`) dentro del directorio `curriculum/challenges/{lang}`. Para nuestras traducciones al Dothraki, deberia ser `curriculum/challenges/dothraki`. La traducción del cliente `.json` archivos irá al directorio `client/i18n/locales/{lang}`.

Actualice su archivo `.env` para usar su nuevo idioma para `CLIENT_LOCALE` y `CURRICULUM_LOCALE`.

Once these are in place, you should be able to run `pnpm run develop` to view your translated version of freeCodeCamp.

> [!TIP] If you build the client in one language and then want to build it in a different language, you will need to use the command `pnpm run clean-and-develop` after changing the `.env` file, as Gatsby will cache the first language.

> [!ATTENTION] Si bien puedes realizar traducciones localmente con motivos de prueba, le recordamos a todos que las traducciones _no_ deben ser enviadas a través de GitHub, estas deben ser enviadas únicamente a traves de Crowdin. Asegúrate de reestablecer tu base de código local despues de que hayas finalizado con las pruebas.

## Show the language in the navigation menu

When your prior PR is merged and the VM for your language is ready, make another PR to show your language in the navigation menu.

In [`shared/config/i18n.ts`](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/config/i18n.ts) file, you have included your language in `hiddenLangs` array in the prior PR. Remove it from the array now.

```js
export const hiddenLangs = []; // Remove your language from the array
```

When this PR is merged and gets deployed, the curriculum in your language will be live.

# Deploying New Languages on `/news`

To deploy News for a new language, you'll need to create two PRs. One PR will be to the [CDN repo](https://github.com/freeCodeCamp/cdn), and the other will be to the [News repo](https://github.com/freeCodeCamp/news).

## Prep the CDN Repo for the New Language

News sources trending links and article titles from our CDN during the build and adds them to the footer. News also fetches Day.js files from the CDN during the build to localize dates and times for each language.

### Add a YAML File for Trending Articles

Clone the [CDN repo](https://github.com/freeCodeCamp/cdn) and create a new branch.

In the [`build/universal/trending`](https://github.com/freeCodeCamp/cdn/tree/main/build/universal/trending) directory, create a new file and name it `language.yaml`. For example, if you are launching Dothraki News, name the file `dothraki.yaml`.

Then copy the contents of the [`english.yaml`](https://github.com/freeCodeCamp/cdn/blob/main/build/universal/trending/english.yaml) trending file and paste it into the new YAML file you just created.

The contents will look something like this:

```yaml
article0title: 'Learn JavaScript'
article0link: 'https://www.freecodecamp.org/news/learn-javascript-free-js-courses-for-beginners/'
article1title: 'Linux ln Example'
article1link: 'https://www.freecodecamp.org/news/linux-ln-how-to-create-a-symbolic-link-in-linux-example-bash-command'
article2title: 'JS document.ready()'
article2link: 'https://www.freecodecamp.org/news/javascript-document-ready-jquery-example/'
article3title: ...
article3link: ...
  ...
```

### Add a Day.js Locale File for the New Language

By default, Day.js only includes English as a locale. To enable it to work with other languages, you need to add a new Day.js locale file to the CDN.

In the [`build/news-assets/dayjs/<version>/locale`](https://github.com/freeCodeCamp/cdn/tree/main/build/news-assets/dayjs/1.10.4/locale) directory, create a new file and name it `isocode.min.js`. For example, if you are launching Dothraki News, name the file `mis.min.js`.

> [!NOTE] The version number will change as the dependencies are updated.

Then, visit [this page on cdnjs](https://cdnjs.com/libraries/dayjs/1.10.4) with all available Day.js files for the version we're using, find the `https://cdnjs.cloudflare.com/ajax/libs/dayjs/<version>/locale/isocode.min.js` link for the new language, and open it in a new tab.

> [!NOTE] You only need to add the .../dayjs/\<version\>/_locale_/isocode.min.js locale file. You do not need to add any other Day.js files.

Copy the Day.js locale code from the new tab into the new file you created. For example, here is an un-minified version of the English locale code for Day.js:

```js
!(function (e, n) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = n())
    : 'function' == typeof define && define.amd
    ? define(n)
    : (e.dayjs_locale_en = n());
})(this, function () {
  'use strict';
  return {
    name: 'en',
    weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
      '_'
    ),
    months:
      'January_February_March_April_May_June_July_August_September_October_November_December'.split(
        '_'
      )
  };
});
```

Then open a PR to the CDN repo to add both the YAML and Day.js files for review.

## Prep the News Repo for the New Language

The [News repo](https://github.com/freeCodeCamp/news) pulls data from a Ghost instance, the files you added to the CDN, builds News, and deploys it.

> [!WARN] Pull requests to the News repo _must_ come from the same repo. You should not work off of a fork for this step.

### Modify the Main Config File

Clone the News repo and create a new branch.

Open the `config/index.js` file to add the new language and configure the necessary values. There are a few objects and arrays to modify:

- `locales`: This array contains the active and upcoming News languages. These are the values that are used in the `.env` file to choose the Ghost instance and UI to use for each build. Add the text name of the new language in lowercase to this array.
- `localeCodes`: This object is a map of ISO codes for each language, and is used to configure i18next before building the UI. To add a new language, use the lowercase language name as the _key_ and the ISO 639-1 language code as the _value_.
- `algoliaIndices`: This object is a map of Algolia indices for each language. To add a new language, use the lowercase language name as the _key_, and `news-` followed by the lowercase ISO 639-1 language code as the _value_.

> [!NOTE] If you are unsure about the string to use while setting `algoliaIndices`, send a message to Kris (@scissorsneedfoodtoo), or someone else with access to Algolia, and ask them to check.

For example, if you are launching Dothraki News, here are what the objects / arrays above should look like:

```js
const locales = ['arabic', 'bengali', 'chinese', 'english', 'dothraki'];

const localeCodes = {
  arabic: 'ar',
  bengali: 'bn',
  chinese: 'zh',
  english: 'en',
  dothraki: 'mis'
};

const algoliaIndices = {
  arabic: 'news-ar',
  bengali: 'news-bn',
  chinese: 'news-zh',
  english: 'news',
  dothraki: 'news-mis'
};
```

### Add the i18next JSON Files for the New Language

Next, go to the `shared/config/i18n/locales` directory, create a new folder, and give it the name of the new language you're adding. For example, if you're launching Dothraki News, create a new folder named `dothraki`.

Then copy the JSON files from the `english` directory to your new folder.

In your new folder, open the `redirects.json` file and replace its contents with an empty array:

```json
[]
```

Then commit and push your branch directly to the News repo.

> [!NOTE] You need to be on one of the teams with access to the News repo to push branches directly to News. Currently, only the dev, i18n, and staff teams are allowed to do this.

Finally, open a PR for review.

Once both your PRs to the CDN and News repo have been approved, they can be merged.

> [!NOTE] Deployment will be handled subsequently by the staff. Here is a sample PR: [freeCodeCamp/news#485](https://github.com/freeCodeCamp/news/pull/485) of how they do it and more details are available in the [staff-wiki](https://staff-wiki.freecodecamp.org/docs/flight-manuals/news-instances#jamstack---news--assets).
