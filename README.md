# A nascent text template processor with Deno  

Basically, a three-liner:

```JavaScript
const templateText = await Deno.readTextFile(Deno.args[0]);
const render = new Function("return `" + templateText + "`").bind(templateParams);
console.log(render());
```

It uses interpolated JavaScript template strings (aka [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)) to process a generic text template file. For example:  

```YAML
# example of a YAML template
request:
  ip: ${ this.dateTime.client_ip }
  ip_time_zone: ${ this.dateTime.abbreviation }
  server_utc_time: ${ this.dateTime.utc_datetime }
  local_time: ${ new Date() }
```

Here, *`this`* refers to the `templateParams` object we passed from the above Deno script. This text file is in fact just a multi-line template strings, with all the corresponding syntax rules you'd follow inside a JavaScript "backtick" string. Hey, it's even [possible to use `await`](https://dev.to/noseratio/await-inside-javascript-template-strings-3kbj) inside `` `${...}` ``!  

## What is this useful for?

I believe it can be useful for build automation, including certain CI/CD-related tasks. 

[Deno](https://deno.land/) itself is a very self-cointained JavaScript/TypeScript runtime engine. It comes as a single executable file which can be used without any external dependencies. Yet it offers an extensive [built-in API](https://doc.deno.land/builtin/stable) to deal with files, networking etc. 

More so, any specific Deno version can be easily installed into a local folder without admin rights. E.g., to install Deno v1.10.3 on Windows with PowerShell:

```powershell
# install Deno v1.10.3 into ./bin
$env:DENO_INSTALL = "$pwd"
$v="1.10.3"
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

Personally, I've never been comfortably fluent with Bash, PowerShell etc., so I find Deno very handy for quick, shell-like scripting with JavaScript. Of course, Deno is much more capable than that, but that's outside the scope of this article.

## Example

This example is a bit contrived, but it illustrates the purpose. Here we make a simple `fetch` request to https://worldtimeapi.org/api/ip and save the results, using the above YAML template:

```javascript
// deno run --allow-read --allow-net nascentTextGen.js sample.yaml.template 

const templateParams = {
  dateTime: await fetch("https://worldtimeapi.org/api/ip").then(r => r.json()),
  args: Deno.args
};

const templateText = await Deno.readTextFile(Deno.args[0]);
const render = new Function("return `" + templateText + "`").bind(templateParams);
console.log(render());
```

Output: 

```YAML
# example of a YAML template
request:
  ip: a.b.c.d
  ip_time_zone: AEST
  server_utc_time: 2021-06-04T01:32:56.595373+00:00
  local_time: Fri Jun 04 2021 11:32:55 GMT+1000 (Australian Eastern Standard Time)
```

## Code

Clone or fork [this simpe demo project](https://github.com/noseratio/nascentTextGen). Then: 
- to install Deno (PowerShell):
```text
pwsh -f _installDeno.ps1
```
- to run the sample:
```text
pwsh -f _demo.ps1
``` 

## Some more advanced general-purpose templating tools

This little project was inspired by [a search for a JavaScript-based general-purpose text templating tool](https://twitter.com/noseratio/status/1399682377446690819?s=20). 

Of course, this approach may only be useful for simple, "logic-less" templates. If you need branching and looping constructs like `if`, `for`, `while` or `function`, there are a lot more powerful and actively maintained alternatives out there:

- Nunjucks: https://github.com/mozilla/nunjucks<br>
  (there's even [a VSCode extension](https://github.com/ronnidc/vscode-nunjucks) for Nunjucks)
- Mustache: https://github.com/janl/mustache.js
- EJS: https://github.com/mde/ejs
- T4 (C#/.NET): https://github.com/mono/t4
- and [more...](https://medium.com/@wavded/template-systems-in-node-7f2787d12dbf)
