//copy to lvl 3: levelCopy(a, 3)
const levelCopy = function(p, lvl, copy){
      let c = copy || (p instanceof Array?[]:{});
      if(lvl === 0){
          return c
      }
      if(Object.prototype.toString.call(p)!=='[object Object]' && Object.prototype.toString.call(p)!=='[object Array]') {
          return p
      }
      for (let i in p) {
          if(!p.hasOwnProperty(i)){ //只对本身属性和方法进行copy
              continue;
          }
          if (p[i] && typeof p[i] === 'object') {  //Object or Array except null
              c[i] = (p[i].constructor === Array) ? [] : {};
              levelCopy(p[i], (Number.isInteger(lvl) && lvl>0) ? lvl-1 : undefined, c[i]);
          } else {
              c[i] = p[i];
          }
      }
      return c;
}

// extend(a, b, c)
const extend = Object.assign != null ? Object.assign.bind( Object ) : function( tgt ){
    let args = arguments

    for( let i = 1; i < args.length; i++ ){
        let obj = args[ i ]

        if( obj == null ){ continue }

        let keys = Object.keys( obj )

        for( let j = 0; j < keys.length; j++ ){
            let k = keys[j]

            tgt[ k ] = obj[ k ]
        }
    }
    return tgt
}
