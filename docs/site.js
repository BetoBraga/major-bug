async function load() {
  const archive = document.querySelector("#archive");
  try {
    const response = await fetch("./issues.json");
    if (!response.ok) return;
    const entries = await response.json();
    const items = entries.filter(e => /^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((a,b)=>b.date.localeCompare(a.date)).map(e=>{
      const item=document.createElement("li"), link=document.createElement("a");
      link.href="./issues/"+e.date+".pdf"; link.textContent=e.date+" · "+e.title;
      item.append(link); return item;
    });
    if (items.length) archive.replaceChildren(...items);
  } catch {}
  try {
    const response = await fetch("../newsletter.json");
    if (!response.ok) return;
    const config = await response.json();
    const options = [["en","Subscribe in English"],["pt-br","Assinar em português"]];
    for (const [lang,label] of options) {
      if (!config[lang]) continue;
      const url = new URL(config[lang]);
      if (url.protocol !== "https:") continue;
      const link = document.createElement("a");
      link.className="button"; link.href=url.href; link.textContent=label;
      document.querySelector("#subscribe-links").append(link);
    }
    if (document.querySelector("#subscribe-links a")) document.querySelector("#status").hidden=true;
  } catch {}
}
load();
