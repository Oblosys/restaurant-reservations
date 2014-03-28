// Type definitions for oblo-util 0.2.0
// Definitions by: Martijn Schrage <https://github.com/Oblosys/>


interface ObloUtilStatic {
  debug : boolean;
  
  log(msg : any) : void;
  clip(min : number, max : number) : number;
  square(x : number) : number;
  replicate<X>(n : number, x : X) : X[];
  padZero(l : number, n : number) : string;
  showJSON(json : string, indent : number, depth : number) : string;
  showTime(date : Date) : string;
  showDate(date : Date) : string;
  readDate(dateStr : string) : Date;
  setAttr($elt, attrName : string, isSet : boolean) : void; // TODO: type JQuery parameter
}

declare var util: ObloUtilStatic;

declare module "oblo-util" {
	export = util;
}