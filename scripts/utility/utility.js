const utility = {
  getByte : (i,m) => {return (m & (0x00ff<<i*8))>>>i*8;}
, hexToList : (e,j=4) => {var r = [];for(var i = 0; i < j; i ++){r.push(e&0xf);e>>>=4}return r;}
, byteToList : (e,j=4) => {var r = [];for(var i = 0; i < j; i ++){r.push(e&0xff);e>>>=8}return r;}
, setTextSize: (font, message, max, parameter) => {
              let s = max;
              textFont(font);
              textSize(s);
              while( textWidth(message) > parameter - 5){
                s-=.5;
                textSize(s);
              }
              return s;
            }
, naturalReduction: (n)=>{
              let toReturn = 0;
              switch(n){
              case 0: toReturn = 0; break;
              case 2: toReturn = 1; break;
              case 4: toReturn = 2; break;
              case 5: toReturn = 3; break;
              case 7: toReturn = 4; break;
              case 9: toReturn = 5; break;
              case 11: toReturn = 6; break;
              }
            return toReturn;
            }
  , arcAdjust: (w)=>{if(w<0)return w+=2;else {return w;}}
  , whosTurn: ()=>{
      if(me.isMyTurn)
        return me.userName;
      else
        return opponent.userName;
    }
  , whosWinning: ()=>{
      if(me.orb.score > opponent.orb.score)
        return me;
      else
        return opponent;
    }
  , getOtherPlayer: (player)=>{
      if(player == me)
        return opponent;
      if(player == opponent)
        return me;
      else
        return null;
    }
  , getRandomInt: (max)=> {
      return Math.floor(Math.random() * Math.floor(max));
    }
  , spellingAudit: ()=> {
          for(var i = 0; i < 24; i ++){
            var keyString = spelling.pitchChromaticToLetter[i] + ": "
            for(var p = 0; p < 12; p ++ ){
              var root = ""
              var spellingRule =  (spelling.spelling[i] >> (2*p)) & 0x00000003;
                switch(spellingRule){
                //natural
                  case 0:
                    root = spelling.pitchChromaticToLetter[p];
                    break;
                //sharp
                  case 1: root = spelling.pitchChromaticToLetter[ (p-1 + 12) %12 ]; break;
                //flat
                  case 2: root = spelling.pitchChromaticToLetter[ (p+1) %12 ]; break;
            }
            root += spelling.accents[spellingRule];
            root += " "
            keyString+=root
            }
            console.log(keyString);
          }
        }
  , keyCardinalToString: (k)=> {
            var q = k < 12 ? 'major' : 'minor'
            return spelling.pitchChromaticToLetter[k] + " " + q
  }
}
