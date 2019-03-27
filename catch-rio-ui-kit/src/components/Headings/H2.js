import React from 'react';

import makeText from './makeText';

const H2 = props => makeText({ ariaLevel: '2', weight: 'bold', ...props });

export default H2;
