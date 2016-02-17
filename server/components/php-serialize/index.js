'use strict';

class Serialize {
  static serialize(Item) {
    if (Item === null) {
      return 'N;';
    } else if (typeof Item === 'number') {
      if (Item % 1 === 0) return `i:${Item};`;
      return `d:${Item};`;
    } else if (typeof Item === 'string') {
      return `s:${Item.length}:"${Item}";`;
    } else if (typeof Item === 'boolean') {
      return `b:${Item ? '1' : '0'};`;
    } else if (typeof Item === 'object') {
      let ToReturn;
      if (Item instanceof Array) {
        ToReturn = [`a:${Item.length}:{`];
        Item.forEach(function serializeArray(Value, Key) {
          ToReturn.push(Serialize.serialize(Key));
          ToReturn.push(Serialize.serialize(Value));
        });

        ToReturn.push('}');
        return ToReturn.join('');
      } else if (typeof Item.serialize === 'function') {
        const S = Item.serialize();
        const C = Item.constructor;
        return `C:${C.name.length}:"${C.name}":${S.length}:{${S}}`;
      }

      ToReturn = [];
      for (const Key in Item) {
        if (Item.hasOwnProperty(Key)) {
          ToReturn.push(Serialize.serialize(Key));
          ToReturn.push(Serialize.serialize(Item[Key]));
        }
      }

      return `a:${ToReturn.length / 2}:{${ToReturn.join('')}}`;
    }

    return new TypeError();
  }
}

module.exports = Serialize;
