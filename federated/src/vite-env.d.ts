/// <reference types="vite/client" />

declare module 'reactApp/App' {
  const ReactApp: React.ComponentType;
  export default ReactApp;
}

declare module 'angularApp/Component' {
  const AngularComponent: any;
  export default AngularComponent;
}