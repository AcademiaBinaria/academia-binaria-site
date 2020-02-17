# A look at major features in the Angular Ivy version 9 release


[post editor](https://admin.indepth.dev/ghost/#/editor/post/5e2f4cae430b1e0c3681c749)

[Lars Gyrup Brink Nielsen](https://indepth.dev/author/layzee/)06 February, 20209 min read

![A look at major features in the Angular Ivy version 9 release](./A%20look%20at%20major%20features%20in%20the%20Angular%20Ivy%20version%209%C2%A0release%20-%20Angular%20INDEPTH_files/light-new-year-s-eve-fireworks-sylvester-40663.jpg)

Cover photo by [Pixabay](https://www.pexels.com/photo/light-new-year-s-eve-fireworks-sylvester-40663/) on Pexels.

AOT everywhere, dynamic globalisation, strict mode, Bazel, and much more.

*(Yes, Angular Ivy version 9 is now released!)*

## Ivy is enabled by default[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#ivy-is-enabled-by-default)


In previous versions of Angular, we had to opt-in to Ivy. In version 9, we instead have to opt-out of Ivy if we want to fall back to View Engine. This is possible in both versions 9 and 10 to ensure a smoother transition from View Engine to Ivy.

Libraries *can* be AOT-compiled, but this is not recommended. The Angular team has a View Engine-to-Ivy migration plan which recommends only publishing JIT-compiled View Engine-compatible libraries for Angular version 9. The Angular compatibility compiler will upgrade View Engine-compatible libraries to Ivy when installed in an Angular Ivy application project.

[Learn about library compatibility and the View Engine-to-Ivy transition plan in “The Angular Ivy guide for library authors”](https://indepth.dev/the-angular-ivy-guide-for-library-authors/).

``` {.language-json}
// tsconfig.json
{
  "angularCompilerOptions": {
    "enableIvy": false
  }
}
```

``` {.language-typescript}
// polyfills.ts
// Only used in multilingual Ivy applications
// import '@angular/localize/init';
```

*Listing 1. Opting out of Ivy to fall back to View Engine.*

If you experience problems with Ivy in your application or any of the libraries you depend on, you can opt out of Ivy and fall back to View Engine by clearing the `enableIvy` Angular compiler option and disabling `@angular/localize` as seen in Listing 1.

Opting out of Ivy in a server environment is a bit trickier. [Follow the official guide to opt out of Ivy when using server-side rendering](https://angular.io/guide/ivy#using-ssr-without-ivy).

## The principle of locality[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#the-principle-of-locality)


To compile a component in View Engine, Angular needs information about all its declarable dependencies, their declarable dependencies, and so on. This means that Angular libraries cannot be AOT-compiled using View Engine.

To compile a component in Ivy, Angular only needs information about the component itself, except for the name and package name of its declarable dependencies. Most notably, Ivy doesn’t need metadata of any declarable dependencies to compile a component.

The principle of locality means that in general we will see faster build times.

### Lazy-loaded components[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#lazy-loaded-components)

`entryComponents` declarations are deprecated as they are no longer needed. Any Ivy component can be lazy loaded and dynamically rendered.

This means that we can now lazy load and render a component without routing or Angular modules. However, in practice we have to use component render modules or feature render modules to link a component’s template to its declarable dependencies.

Libraries that are only used by a lazy loaded component are even bundled in lazy-loaded chunks.

## Improvements to differential loading[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#improvements-to-differential-loading)

When differential loading was introduced in Angular version 8, the build process was run once for the ES5 bundle and once for the ES2015+ bundle.

In Angular version 9, an ES2015+ bundle is output first. That bundle is then transpiled to a separate ES5 bundle. This way, we don’t have to go through a full build process twice.

## AOT compilation everywhere[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#aot-compilation-everywhere)


AOT is enabled by default in builds, the development server and even in tests. Previously, AOT compilation was significantly slower than JIT compilation so JIT was used for development and testing. With the build and rebuild time improvements in Ivy, AOT-compilation now has a great developer experience.

When we used JIT compilation in some phases of our process and only AOT compilation in the final build, errors were detected only when doing production builds or worse, at runtime.

## Bundle sizes[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#bundle-sizes)

Ivy can enable smaller bundles because it uses the Ivy Instruction Set which is a set of tree-shakable runtime rendering instructions. Our bundles will only include the rendering instructions we use in our projects.

This is great for use cases such as microfrontends, Angular Elements and web apps where Angular is not controlling the entire document.

However, the difference in our bundle sizes between View Engine and Ivy will vary based on the size of our application and the 3rd party libraries we use. In general:

-   Small and simple applications will see a considerable bundle size decrease.
-   Complex applications will see an increase in the main bundle, but a decrease in lazy loaded bundle sizes.

This means a considerable combined bundle size decrease for big applications, but could mean an overall increase in bundle size for medium-sized applications. In both cases, the main bundle’s size will probably increase which is bad for the initial page load time.

## Globalisation[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#globalisation)

Locales (number formatting, date formatting, and other regional settings) can be dynamically loaded at runtime instead of having to be registered at compile time.

``` {.language-typescript}
// main.ts
import '@angular/localize/init';

import { loadTranslations } from '@angular/localize';

loadTranslations({
  '8374172394781134519': 'Hello, {$username}! Welcome to {$appName}.',
});
```

*Listing 2. Dynamically loading translations.*

As seen in Listing 2, translated texts can also be dynamically loaded at runtime instead of being part of our bundles.

The translated texts could be loaded from a database or a file.

### Multiple languages from a single application bundle[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#multiple-languages-from-a-single-application-bundle)

To change language, we have to restart the application, but we don’t have to serve a different application bundle.

This means that we can — with some setup — support multiple languages with a single application bundle on a single hostname.

### Compile time inlining[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#compile-time-inlining)

A localised application will now only be compiled once. Instead of multiple builds to produce a bundle per language, a bundle per language is produced by replacing `$localize` placeholders with translated texts.

We now need to add the package `@angular/localize` to support localisation (multiple languages). The good news is that we no longer have to include Angular’s localisation code in our bundles if we only have a single language.

If we don’t use localised templates, the `i18n*` Ivy instructions are tree shaked from our bundle.

### Localisable texts in component models and services[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#localisable-texts-in-component-models-and-services)

``` {.language-typescript}
// app.component.ts
@Component({
  template: '{{ title }}'
})
export class AppComponent {
  title = $localize`Welcome to MyApp`;
}
```

*Listing 3. A translation text placeholder in a component model.*

A new internationalisation feature is that we can also include placeholders for translated texts in our component models as seen in Listing 3. Previously, this was only possible in templates.

## Additional provider scopes[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#additional-provider-scopes)

We have always had Angular module scope for providers. Angular version 6 introduced the `'root'` provider scope and tree-shakable providers both for root and Angular module scope providers.

Angular version 9 introduces the `'platform'` and `'any'` provider scopes. Platform-scoped providers can be shared between multiple Angular applications in the same document. The `'any'` provider scope will share a provider per module injector. For example one service instance for the eagerly loaded main bundle and one service instance for each lazy loaded Angular module.

## Improved developer experience[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#improved-developer-experience)

Ivy enables the Angular Language Service to support additional checks while developing. This is a big improvement to the developer experience.

### File path checks[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#file-path-checks)

The Angular Language Service continuously verifies component stylesheet and template paths.

### Template type checks[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#template-type-checks)

Templates are type checked, according to the template type checking mode as described in the “Strict mode” section. Member names and types are verified, even in embedded views. What previously resulted in runtime errors are now detected while developing and building.

## New debugging API in development mode[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#new-debugging-api-in-development-mode)

`ng.probe` has been replaced with a new debugging API in development mode. The most notable functions are `ng.applyChanges` and `ng.getComponent`.

## Strict mode[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#strict-mode)

### Strict workspace schematic[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#strict-workspace-schematic)

The `ng new` workspace schematic now supports the `--strict` flag which defaults to off (`false`).

``` {.language-bash}
ng new my-app --strict
```

When enabled, this parameter adds a few strict TypeScript compiler checks as seen in Listing 4.

``` {.language-json}
// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noFallthroughCasesInSwitch": true,
    "strictNullChecks": true
  }
}
```

*Listing 4. TypeScript compiler options enabled in a strict Angular workspace.*

Curiously enough, this doesn’t add the same options as if we would simply set `"strict": true` in the `compilerOptions` object. Let’s compare the Angular workspace strict option to the TypeScript compiler strict option.

Both have these options in common:

-   `noImplicitAny`
-   `noImplicitThis`
-   `strictNullChecks`

The strict Angular workspace option additionally sets these options:

-   `noImplicitReturns`
-   `noFallthroughCasesInSwitch`

while the strict TypeScript compiler option additionally sets these options:

-   `alwaysStrict`
-   `strictBindCallApply`
-   `strictFunctionTypes`
-   `strictPropertyInitialization`

What’s more, the strict Angular workspace option doesn’t set template type checking to the new strict mode, only the previous full mode.

### Strict template type checking[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#strict-template-type-checking)

We have had the option to enable template type checking since Angular version 5 by setting `"fullTemplateTypeCheck": true` in the `angularCompilerOptions` object.

Ivy introduces strict template type checking as seen in Listing 5. When this new Angular compiler option is set, the value of`fullTemplateTypeCheck` is ignored.

``` {.language-typescript}
// tsconfig.json
{
  "angularCompilerOptions": {
    "strictTemplates": true
  }
}
```

*Listing 5. Enable strict template type checking.*

The strict template type checking verifies the types of property bindings and respects the `strictNullChecks` option. It also checks the types of template references to directives and components, including generic types. Template context variables’ types are also checked which is great for `NgFor` loops. The `$event` type is checked for event bindings and animations. Even the type of native DOM elements is verified with strict template type checking.

These extra checks can lead to errors and false positives under certain circumstance, for eaxmple when using libraries that are not compiled with `strictNullChecks`. To address this, strict template type checking has options to opt-out and tweak the checks. For example, `strictTemplates` is actually a shorthand for 8 different Angular compiler options.

## Improved component and directive class inheritance[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#improved-component-and-directive-class-inheritance)

Selectorless base classes are now supported for directives and components. Some metadata is now inherited from base component and directive classes. This makes it easier to extend for example Angular Components and Angular Router directives.

## Latest TypeScript versions[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#latest-typescript-versions)

TypeScript versions 3.6 and 3.7 are supported in Angular version 9. Previous TypeScript versions are no longer supported. Refer to Table 1 to compare TypeScript compatibility between all Angular versions.

[view raw](https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3/raw/ad300b4d2bdbc51b4dd8092c059a68cb22d3774d/angular-cli-node-js-typescript-support.csv) [angular-cli-node-js-typescript-support.csv](https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3#file-angular-cli-node-js-typescript-support-csv) hosted with ❤ by [GitHub](https://github.com/)

*Table 1. Angular CLI, Angular, Node.js and TypeScript compatibility table.*[*Open in new tab*](https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3)*.*

TypeScript version 3.6 introduces these and other features:

-   Unicode support for identifiers in modern targets
-   Improved developer experience for promises
-   Stricter type checking of generators

TypeScript version 3.7 introduces these and other features that we can use with Angular version 9:

-   Optional chaining operator (`?.`) similar to the safe navigation operator for Angular templates
-   Nullish coalescing operator (`??`)
-   Assertion functions (`assert parameterName is typeName` and `asserts parameterName`)
-   Top-level `await`
-   Improved recursive type aliases
-   Improved developer experience for functions such as function truthy checks

## Improved server-side rendering with Angular Universal[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#improved-server-side-rendering-with-angular-universal)

Angular Universal version 9 is released with a Node.js Express development server to provide a realistic environment during development.

Also part of this release is an Angular CLI builder to prerender static routes using `guess-parser`, inspired by `angular-prerender`. We can pass a routes file to prerender dynamic routes (routes with parameters).

### How do I get started?[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#how-do-i-get-started)

We can add Angular Universal using the command `ng add @nguniversal/express-engine`. We can then use the builder command `ng run myapp:serve-ssr` to start the server-side rendering development server with live reload. Similarly, we can use `ng run myapp:prerender` to detect static and dynamic routes and prerender them.

## Improved styling experience[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#improved-styling-experience)

Styling in Angular Ivy has been reworked. Combining static HTML classes with `NgStyle` and `NgClass` directives is now fully supported and easier to reason about.

### CSS Custom Properties support[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#css-custom-properties-support)

As part of the Ivy styling rewrite, binding CSS Custom Properties is now supported.

An example binding looks like this:

    <div [style.--my-var]="myProperty || 'any value'"></div>

CSS Custom Properties have scope, so this CSS property would be scoped to the component’s DOM.

## Stable Bazel release as opt-in option[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#stable-bazel-release-as-opt-in-option)

Bazel version 2.1 is an opt-in build automation tool for Angular version 9.

### How do I get started?[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#how-do-i-get-started-1)

To enable Bazel, use `ng add @angular/bazel` or use the `@angular/bazel` schematics collection when generating an Angular workspace.

Make sure to follow [the Bazel installation guide](https://docs.bazel.build/versions/2.0.0/install.html) for your operating system.

## Angular Components[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#angular-components)

Angular version 9 comes with official components for YouTube and Google Maps. A clipboard directive and service are added to the Angular CDK.

## Testing[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#testing)

The biggest surprise of the Angular version 9 release is the many improvements to testing. Long-standing performance issues are resolved, types are improved and new concepts are introduced.

[Learn about major features and improvements for testing in "Next-level testing in Angular Ivy version 9"](https://indepth.dev/next-level-testing-in-angular-ivy-version-9/).

>>>>>>>>>>>>> translated

## Conclusion[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#conclusion)

One of the most important goals has been to keep backwards compatibility between Ivy and View Engine as much as possible.

Of course, Angular version 9 also includes bugfixes, deprecations, and breaking changes. Ivy also addresses some long-standing issues that we did not cover in this article.

Angular Ivy is an enabler for features to come. As we have discussed in this article, Ivy has already given us benefits for different use cases. However, the best features are to come in future versions of Angular. Which of the possible features that will be delivered in Angular versions 10 and 11, that is still to be decided.

We only discussed what is part of the public, stable Angular version 9 APIs. A few experimental APIs are part of this release, such as `renderComponent`, `markDirty`, and `detectChanges`. However, they are still subject to change.

With the deprecation of entry component declarations and lazy loaded components using render modules, we are one step closer to [tree-shakable components and optional Angular modules](https://indepth.dev/angular-revisited-tree-shakable-components-and-optional-ngmodules/).

[Component features](https://indepth.dev/component-features-with-angular-ivy/) are also part of this release, but only exposed for internal use by Ivy.

The Angular Ivy version 9 release gives us improvements for bundling, testing, the developer experience, tooling, debugging, and type checking. Quite a good collection of features.

## Related resources[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#related-resources)

### Lazy loaded components[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#lazy-loaded-components-1)

[Learn about render modules in my talk “Angular revisited: Tree-shakable components and optional NgModules”](https://youtu.be/DA3efofhpq4).

[Learn how to lazy load components in “Lazy load components in Angular” by Kevin Kreuzer](https://medium.com/angular-in-depth/lazy-load-components-in-angular-596357ab05d8).

### Template type checking[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#template-type-checking)

[Read the official guide on Angular template type checking to learn the details of troubleshooting and configuration](https://angular.io/guide/template-typecheck#troubleshooting-template-errors).

### Globalisation[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#globalisation-1)

[Manfred Steyer discusses lazy-loading locales in "Lazy Loading Locales with Angular"](https://www.softwarearchitekt.at/aktuelles/lazy-loading-locals-with-angular/).

[Cédric Exbrayat discusses Ivy globalisation in "Internationalization with @angular/localize"](https://blog.ninja-squad.com/2019/12/10/angular-localize/).

### Additional provider scopes[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#additional-provider-scopes-1)

Learn about the `'any'` and `'platform'` provider scopes in [“Improved Dependeny Injection with the new providedIn scopes ‘any’ and ‘platform’” by Christian Kohler](https://dev.to/christiankohler/improved-dependeny-injection-with-the-new-providedin-scopes-any-and-platform-30bb).

### New debugging API[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#new-debugging-api)

[Read about the full debugging API in the official documentation](https://angular.io/api/core/global).

### Angular Universal version 9[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#angular-universal-version-9)

These two articles goes into the details of Angular Universal version 9:

-   [“Angular Universal v9: What’s New ?” by Mark Pieszak](https://trilon.io/blog/angular-universal-v9-whats-new)
-   [“Angular v9 & Universal: SSR and prerendering out of the box!” by Sam Vloeberghs](https://dev.to/angular/angular-v9-universal-ssr-and-prerendering-out-of-the-box-33b1)

Learn about `angular-prerender`, the library that inspired these new Angular Universal features in [“Prerender Angular Apps with a single Command” by Christoph Guttandin](https://media-codings.com/articles/prerender-angular-apps-with-a-single-command).

### CSS Custom Properties binding[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#css-custom-properties-binding)

[See this tweet and demo by Alexey Zuev to see CSS Custom Properties bindings in action](https://twitter.com/yurzui/status/1221159415820275717).

## Peer reviewers[\#](https://indepth.dev/a-look-at-major-features-in-the-angular-ivy-version-9-release/#peer-reviewers)

It’s always helpful to have a second opinion on our work or even just catch silly errors. For this article I had the pleasure of being reviewed by:

-   [Christoph Guttandin](https://twitter.com/chrisguttandin)
-   [Evgeny Fedorenko](https://indepth.dev/author/evgeny/)
-   [Santosh Yadav](https://dev.to/santoshyadav198613)

Lars Gyrup Brink Nielsen

