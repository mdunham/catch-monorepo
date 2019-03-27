import React from 'react';

import makeText from './makeText';

const H3 = props => makeText({ ariaLevel: '3', weight: 'bold', ...props });

export default H3;
