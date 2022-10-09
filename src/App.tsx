import React from 'react';
import {BrowserRouter} from "react-router-dom";
import logo from './logo.svg';
import './App.css';

// /* s01-types */
// import DrawerTypes from "./components/s01-types/example01";

// /* s02-dynamicItems */
// import DrawerItemState from "./components/s02-dynamicItems/example01";

// /* s03-spa */
// import DrawerNavigationApp from "./components/s03-spa/example01";

// /* s04-subheader */
// import DrawerSectionApp from "./components/s04-subheader/example01";

/* s05-withAppBar */
import AppBarInteraction from "./components/s05-withAppBar/example01";

function App() {
  // /* s01-types */
  // return (
  //   <>
  //     <DrawerTypes drawerVariant="persistent" />
  //   </>
  // );

  // /* s02-dynamicItems */
  // return (
  //     <>
  //       <DrawerItemState />
  //     </>
  // );

  // /* s03-spa */
  //   return (
  //     <BrowserRouter>
  //         {/*@ts-ignore*/}
  //         <DrawerNavigationApp />
  //     </BrowserRouter>
  // );

  // /* s04-subheader */
  // return (
  //     <BrowserRouter>
  //         {/*@ts-ignore*/}
  //         <DrawerSectionApp />
  //     </BrowserRouter>
  // );

  /* s05-withAppBar */
  return (
      <BrowserRouter>
          {/*@ts-ignore*/}
          <AppBarInteraction drawerVariant="persistent" />
      </BrowserRouter>
  );
}

export default App;
