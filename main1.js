const dat2=obj.map((resu,index1)=>{return(resu.results.map((result,index2)=>{return(result.lexicalEntries.map((lexi,index3)=>{if("entries" in lexi){return(lexi.entries.map((entry,index4)=>{if("senses" in entry){return(entry.senses.map((sense,index5)=>{if(("definitions" in sense) && ("examples" in sense) ){return(<div>{sense.definitions[0]
  
}
{sense.examples.map((example,index6)=>{return(<div>{example.text}</div>)})}

</div>
  )}}))}}))}}))}))})