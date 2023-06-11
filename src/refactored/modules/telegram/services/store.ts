import NodeCache from 'node-cache';

export const Store = new NodeCache( { stdTTL: 2400, checkperiod: 120 } );
