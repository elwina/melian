import type { LenConfig } from "renderer/config.type";

export function parseRequire (req:Record<string, string>,lens:LenConfig[]){
  const result:Record<string,number> = {};
  Object.keys(req).forEach((key)=>{
    const str=req[key];
    const array=str.split(/\.|\{|\}|\[|\]/)
    // [ '', '5', '', 'distancemm' ]
    const id = parseInt(array[1], 10);
    const ifoption = str[0]==='{';

    if (ifoption){
      const indicate=array[3];
      if (indicate in lens[id].option){
      result[key]=lens[id].option[indicate]}
      else{
        throw new Error(`option ${indicate} not found in lens ${id}`)
      }
    }else {
      result[key]=lens[id].distancemm;
    }

  })
  return result;
}

