# 🥚 Tamagotchi — Retro Pet

![Tamagotchi Retro Pet — gameplay](./public/screenshots/projeto-tamagochi.png)

**Lembra daquele bichinho virtual preso no chaveiro dos anos 90 que vivia
pedindo comida no meio da aula?** A gente trouxe ele de volta — com toda a
alma LCD verde-fosforescente, bipes 8-bit e a ansiedade gostosa de não saber
se o seu mascote vai passar da adolescência.

Cuide do ovo, veja ele chocar, escolha entre três espécies, brinque, alimente,
dê banho, remédio, limpe a bagunça, coloque pra dormir — e torça pra que
ele não morra de fome enquanto você "só deu uma olhadinha no celular".

É o jogo perfeito pra encaixar naquela hora morta do dia:

- 🚇 Fila do mercado, ponto de ônibus, elevador preso
- ☕ Cinco minutos entre reuniões
- 🎓 Aquela aula que ninguém presta atenção
- 🛌 Antes de dormir, quando o sono não vem
- 🕒 Qualquer pausa de 30 segundos que você quer matar com dignidade

## 🎮 Pra começar a jogar

```bash
npm install
npm run dev
```

Abra no navegador, dê um nome bonito (ou ridículo, a gente não julga), escolha
sua espécie favorita — **BLOB** (o clássico amorfo verde), **DINO** (o ciano
saudoso) ou **CAT** (o rosa fofo) — e não esqueça de aceitar o som **assim que
a música tocar**. Pixel art sem chiptune é só metade da experiência.

## ✨ O que tem dentro

### O bichinho
- **Ciclo de vida completo**: ovo → bebê → criança → adolescente → adulto → ancião, até 24h de vida natural
- **3 espécies** com sprites, paletas e sons próprios (BLOB / DINO / CAT)
- **Evoluções ramificadas secretas**: cuide muito bem e ele vira **MEGA ★**; abandone e ele vira **DARK ☠**
- **5 stats** (fome, felicidade, energia, higiene, saúde) que decaem mesmo com a aba fechada
- **Cemitério** com histórico de cada bichinho que partiu — nome, idade, variante e causa da morte

### Coisas pra fazer
- **3 minigames** pra farmar moedas: adivinhe 1-3, sequência estilo Simon, e um de reflexo (aperte na hora certa)
- **Loja de 9 cosméticos** (chapéus, óculos, fitas) que ficam no sprite do seu bicho — gastam moedas dos minigames
- **18 conquistas** desbloqueáveis (alguns bem escondidos)
- **Clique no bichinho pra fazer carinho** — ele pula feliz e ganha pontinhos de felicidade
- **Flash de evolução**: a tela inteira pisca quando ele muda de fase

### Bastidor que te deixa a vida mais fácil
- **Modo Creche**: toggle + regras configuráveis pra cuidar do bicho sozinho enquanto você dorme ou sai
- **Atalhos de teclado** pra não precisar mirar: setas, ENTER, 1-8, M (mudo), N (notif), L (idioma), ? (ajuda)
- **Notificações do navegador** avisam quando stats ficam críticos (opt-in)
- **Export/import do save** em JSON pra backup ou passar pra outro navegador
- **Histórico de stats** em sparklines — dá pra ver se você tá cuidando direito ou se a saúde tá caindo
- **Dia/noite automático**: a paleta LCD muda sozinha de acordo com o relógio real (verde no dia, azul à noite)
- **Tela cheia** com um clique
- **3 idiomas**: 🇧🇷 PT-BR, 🇵🇹 PT-PT e 🇺🇸 EN, troca ao vivo no header

### Áudio que importa
- **5 faixas de música** em loop embaralhado rodando durante a tela inicial e menus
- **Bipes 8-bit** gerados na hora via Web Audio API (sem arquivos de sample)
- **Sons ambiente** que variam pelo humor do bichinho — ele faz chirpinhos diferentes quando tá feliz, triste ou com sono
- **Choro proativo**: quando os stats ficam críticos, ele começa a choramingar em loop sutil (não só um bip aleatório)
- Mute persistido, pra você não ter que desligar toda vez

## 💾 Onde ficam os dados

Não tem login, cadastro, servidor, cookie. Tudo fica salvo **no seu próprio
navegador** — se você limpar o histórico, seu bichinho vai pro além. Dá pra
exportar o save como JSON pelo botão `?` e importar em outro navegador ou
passar pra um amigo. Sem tracking, sem terceiros, sem analytics.

## 🕹️ Dicas rápidas

- **Doce engorda a felicidade mas pode dar dor de barriga** — use com moderação
- **Sono cura quase tudo** — se ele tá de mau humor, coloca ele pra dormir
- **Cocô acumulado mata a higiene rápido** — passa o botão de limpar
- **Remédio só funciona quando ele tá doente** — não desperdice
- **Cuide MUITO bem nos primeiros 40 minutos** — aí é quando a variante **Mega ★** pode rolar
- **Deixou 30 minutos sem atenção?** Ativa o Modo Creche, configura os limiares e dorme tranquilo

## ❤️ Feito com carinho

Projeto pessoal feito pra matar saudade do que era simples e viciante.
Contribua, forqueie, suba o seu próprio bichinho — ou só jogue mesmo e
mande foto do recorde de idade no cemitério.

Boa sorte, cuidador. Seu bichinho tá te esperando. 🥚✨
