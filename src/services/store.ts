import NodeCache from 'node-cache';

export const Store = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
