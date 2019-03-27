import React from 'react';

import makeText from './makeText';
import { fonts } from '../../const';

//@NOTE: unfortunately, styleguidist does not recognize multiple named imports
// in the same file so we need single files for each of these
// see https://github.com/styleguidist/react-styleguidist/blob/master/docs/Components.md#default-vs-named-exports
const H1 = props =>
  makeText({
    ariaLevel: '1',
    weight: 'bold',
    height: (props.size || fonts['h1']) * 0.75,
    ...props,
  });

export default H1;
