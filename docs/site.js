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
    if (config.endpoint) {
      const pt = document.documentElement.lang === "pt-br";
      const t = (en, br) => pt ? br : en;
      const form = document.createElement("form");
      form.innerHTML = `
        <label for="newsletter-email">${t("Email address","Seu e-mail")}</label>
        <input id="newsletter-email" name="email" type="email" maxlength="254" autocomplete="email" required>
        <label for="newsletter-language">${t("Edition language","Idioma da edição")}</label>
        <select id="newsletter-language" name="language">
          <option value="en">English</option><option value="pt-br">Português do Brasil</option>
          <option value="both">${t("Both","As duas")}</option>
        </select>
        <label class="consent"><input type="checkbox" name="consent" required>${t("I want to receive Major Bug by email.","Quero receber a Major Bug por e-mail.")}</label>
        <button type="submit">${t("Sign me up","Quero receber")}</button>`;
      form.elements.language.value = pt ? "pt-br" : "en";
      const status = document.querySelector("#status");
      status.setAttribute("role", "status");
      status.hidden = true;
      form.addEventListener("submit", async event => {
        event.preventDefault();
        const button = form.querySelector("button");
        button.disabled = true;
        try {
          const reply = await fetch(config.endpoint, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
            email:form.elements.email.value,language:form.elements.language.value,consent:form.elements.consent.checked
          })});
          const result = await reply.json();
          if (!reply.ok || !result.saved) throw Error();
          status.textContent = result.confirmationSent
            ? t("Check your inbox to confirm your subscription.","Confira sua caixa de entrada pra confirmar a inscrição.")
            : t("Request received. Confirmation email is not available right now.","Pedido recebido. O e-mail de confirmação não está disponível agora.");
          form.reset();
          form.elements.language.value = pt ? "pt-br" : "en";
        } catch {
          status.textContent=t("Could not save your request. Please try again.","Não deu pra salvar seu pedido. Tente de novo.");
        } finally {
          status.hidden=false;
          button.disabled=false;
        }
      });
      document.querySelector("#subscribe-links").append(form);
      return;
    }
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
