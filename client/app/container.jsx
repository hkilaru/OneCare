import React from 'react';
import Navigate from './navigate.jsx';

export const Container  = (props) => <div>
  <Navigate />
  {props.children}
</div>
