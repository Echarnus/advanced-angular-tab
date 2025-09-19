# Advanced Angular Table

This is an Angular 19 implementation of the Advanced Data Table, recreating all features from the React version.

## Features

- **Sticky Headers**: Table headers remain visible while scrolling
- **Sorting**: Click column headers to sort data (ascending/descending/none)
- **Pagination**: Navigate through data with configurable page sizes (10/20/50)
- **Expandable Rows**: Click the + button to see detailed user information
- **Frozen Columns**: ID and Name columns stay fixed during horizontal scrolling
- **Theme Switching**: Toggle between light and dark modes
- **Configuration Panel**: JSON editor for dynamic column configuration
- **Loading States**: Smooth loading experience with skeleton states
- **Responsive Design**: Works on desktop and mobile devices

## Technologies

- **Angular 19**: Latest Angular with standalone components
- **TailwindCSS**: Utility-first CSS framework for styling
- **TypeScript**: Strongly typed JavaScript for better development experience
- **Phosphor Icons**: Beautiful icon set for UI elements

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Build for GitHub Pages
npm run build -- --configuration=github-pages
```

## Live Demo

Visit the live demo at: [https://echarnus.github.io/advanced-angular-tab/](https://echarnus.github.io/advanced-angular-tab/)

## Comparison with React Version

This Angular implementation provides 100% feature parity with the original React version:

- Identical UI/UX design
- Same data structure and sample content
- Equivalent functionality for all interactive features
- Matching theme system and color scheme
- Similar performance characteristics

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
