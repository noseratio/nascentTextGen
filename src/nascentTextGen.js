// deno run --allow-read --allow-net nascentTextGen.js sample.yaml.template 

const templateParams = {
  dateTime: await fetch("https://worldtimeapi.org/api/ip").then(r => r.json()),
  args: Deno.args
};

const templateText = await Deno.readTextFile(Deno.args[0]);
const render = new Function("return `" + templateText + "`").bind(templateParams);
console.log(render());
