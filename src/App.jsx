import { useState, useEffect, useCallback, useMemo } from "react";

// ================================================================
// DADOS BASE
// ================================================================
const NOME_BOLAO = "Bolão Craque do Pitaco (Família Débora e Marcus)";
const PRAZO = new Date('2026-06-10T23:59:00-03:00');
const VALOR_APOSTA = 50;
const SENHA_ADMIN_PADRAO = "Copa2026@DM";

// Códigos de bandeira para flagcdn.com
const FLAG_CODES = {
  Mexico:'mx',Africa_Sul:'za',Coreia:'kr',Tchequia:'cz',Canada:'ca',Bosnia:'ba',Qatar:'qa',Suica:'ch',
  Brasil:'br',Marrocos:'ma',Haiti:'ht',Escocia:'gb-sct',EUA:'us',Paraguai:'py',Australia:'au',Turquia:'tr',
  Alemanha:'de',Curacao:'cw',Costa_Marfim:'ci',Equador:'ec',Holanda:'nl',Japao:'jp',Suecia:'se',Tunisia:'tn',
  Belgica:'be',Egito:'eg',Ira:'ir',Nova_Zelandia:'nz',Espanha:'es',Cabo_Verde:'cv',Arabia_Saudita:'sa',Uruguai:'uy',
  Franca:'fr',Senegal:'sn',Iraque:'iq',Noruega:'no',Argentina:'ar',Algeria:'dz',Austria:'at',Jordania:'jo',
  Portugal:'pt',Congo:'cd',Uzbequistao:'uz',Colombia:'co',Inglaterra:'gb-eng',Croacia:'hr',Gana:'gh',Panama:'pa',
};

const TIMES = {
  Mexico:{flag:'🇲🇽',nome:'México'},Africa_Sul:{flag:'🇿🇦',nome:'África do Sul'},Coreia:{flag:'🇰🇷',nome:'Coreia do Sul'},Tchequia:{flag:'🇨🇿',nome:'Tchéquia'},
  Canada:{flag:'🇨🇦',nome:'Canadá'},Bosnia:{flag:'🇧🇦',nome:'Bósnia-Herz.'},Qatar:{flag:'🇶🇦',nome:'Qatar'},Suica:{flag:'🇨🇭',nome:'Suíça'},
  Brasil:{flag:'🇧🇷',nome:'Brasil'},Marrocos:{flag:'🇲🇦',nome:'Marrocos'},Haiti:{flag:'🇭🇹',nome:'Haiti'},Escocia:{flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',nome:'Escócia'},
  EUA:{flag:'🇺🇸',nome:'EUA'},Paraguai:{flag:'🇵🇾',nome:'Paraguai'},Australia:{flag:'🇦🇺',nome:'Austrália'},Turquia:{flag:'🇹🇷',nome:'Turquia'},
  Alemanha:{flag:'🇩🇪',nome:'Alemanha'},Curacao:{flag:'🇨🇼',nome:'Curaçao'},Costa_Marfim:{flag:'🇨🇮',nome:'Costa do Marfim'},Equador:{flag:'🇪🇨',nome:'Equador'},
  Holanda:{flag:'🇳🇱',nome:'Holanda'},Japao:{flag:'🇯🇵',nome:'Japão'},Suecia:{flag:'🇸🇪',nome:'Suécia'},Tunisia:{flag:'🇹🇳',nome:'Tunísia'},
  Belgica:{flag:'🇧🇪',nome:'Bélgica'},Egito:{flag:'🇪🇬',nome:'Egito'},Ira:{flag:'🇮🇷',nome:'Irã'},Nova_Zelandia:{flag:'🇳🇿',nome:'Nova Zelândia'},
  Espanha:{flag:'🇪🇸',nome:'Espanha'},Cabo_Verde:{flag:'🇨🇻',nome:'Cabo Verde'},Arabia_Saudita:{flag:'🇸🇦',nome:'Arábia Saudita'},Uruguai:{flag:'🇺🇾',nome:'Uruguai'},
  Franca:{flag:'🇫🇷',nome:'França'},Senegal:{flag:'🇸🇳',nome:'Senegal'},Iraque:{flag:'🇮🇶',nome:'Iraque'},Noruega:{flag:'🇳🇴',nome:'Noruega'},
  Argentina:{flag:'🇦🇷',nome:'Argentina'},Algeria:{flag:'🇩🇿',nome:'Argélia'},Austria:{flag:'🇦🇹',nome:'Áustria'},Jordania:{flag:'🇯🇴',nome:'Jordânia'},
  Portugal:{flag:'🇵🇹',nome:'Portugal'},Congo:{flag:'🇨🇩',nome:'Congo DR'},Uzbequistao:{flag:'🇺🇿',nome:'Uzbequistão'},Colombia:{flag:'🇨🇴',nome:'Colômbia'},
  Inglaterra:{flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',nome:'Inglaterra'},Croacia:{flag:'🇭🇷',nome:'Croácia'},Gana:{flag:'🇬🇭',nome:'Gana'},Panama:{flag:'🇵🇦',nome:'Panamá'},
};

const GRUPOS = {
  A:['Mexico','Africa_Sul','Coreia','Tchequia'],B:['Canada','Bosnia','Qatar','Suica'],
  C:['Brasil','Marrocos','Haiti','Escocia'],D:['EUA','Paraguai','Australia','Turquia'],
  E:['Alemanha','Curacao','Costa_Marfim','Equador'],F:['Holanda','Japao','Suecia','Tunisia'],
  G:['Belgica','Egito','Ira','Nova_Zelandia'],H:['Espanha','Cabo_Verde','Arabia_Saudita','Uruguai'],
  I:['Franca','Senegal','Iraque','Noruega'],J:['Argentina','Algeria','Austria','Jordania'],
  K:['Portugal','Congo','Uzbequistao','Colombia'],L:['Inglaterra','Croacia','Gana','Panama'],
};

const JOGOS = (() => {
  const lista=[],d1=['11/06','12/06','13/06','14/06'],d2=['18/06','19/06','20/06','21/06'],d3=['24/06','25/06','26/06','27/06'];
  Object.keys(GRUPOS).forEach((g,gi)=>{
    const [t1,t2,t3,t4]=GRUPOS[g],di=gi%4;
    lista.push({id:`${g}R1A`,grupo:g,rodada:1,casa:t1,fora:t2,data:d1[di]});lista.push({id:`${g}R1B`,grupo:g,rodada:1,casa:t3,fora:t4,data:d1[(di+1)%4]});
    lista.push({id:`${g}R2A`,grupo:g,rodada:2,casa:t1,fora:t3,data:d2[di]});lista.push({id:`${g}R2B`,grupo:g,rodada:2,casa:t2,fora:t4,data:d2[(di+1)%4]});
    lista.push({id:`${g}R3A`,grupo:g,rodada:3,casa:t1,fora:t4,data:d3[di]});lista.push({id:`${g}R3B`,grupo:g,rodada:3,casa:t2,fora:t3,data:d3[(di+1)%4]});
  });
  return lista;
})();

// ================================================================
// INFORMAÇÕES DOS PAÍSES (Fonte: FIFA.com, CIA World Factbook, WorldBank)
// ================================================================
const PAISES_INFO = {
  Mexico:       {oficial:'Estados Unidos Mexicanos',capital:'Cidade do México',regiao:'América do Norte',pop:'130M',copas:17,titulos:0,melhor:'Quartas de final (1970, 1986)',curiosidade:'Único país não-anfitrião a sediar o jogo inaugural da Copa 2026. Participou de todas as edições desde 1930 (exceto 1934).'},
  Africa_Sul:   {oficial:'República da África do Sul',capital:'Pretória',regiao:'África Austral',pop:'62M',copas:4,titulos:0,melhor:'Fase de grupos (nunca avançou)',curiosidade:'Único país africano a sediar uma Copa (2010). Possui 3 capitais: executiva (Pretória), legislativa (Cidade do Cabo) e judicial (Bloemfontein).'},
  Coreia:       {oficial:'República da Coreia',capital:'Seul',regiao:'Ásia Oriental',pop:'52M',copas:11,titulos:0,melhor:'4º lugar (2002)',curiosidade:'Melhor campanha asiática da história. Em 2002, co-anfitrião com Japão, chegou ao 4º lugar eliminando Espanha e Itália.'},
  Tchequia:     {oficial:'República Tcheca',capital:'Praga',regiao:'Europa Central',pop:'10,9M',copas:3,titulos:0,melhor:'2º lugar como Tchecoslováquia (1934, 1962)',curiosidade:'O país possui mais cervejarias per capita que qualquer outro. Praga é considerada uma das cidades mais belas da Europa.'},
  Canada:       {oficial:'Canadá',capital:'Ottawa',regiao:'América do Norte',pop:'38M',copas:3,titulos:0,melhor:'Fase de grupos',curiosidade:'Co-anfitrião de 2026. O hóquei no gelo é o esporte nacional, mas o futebol cresce rapidamente entre os imigrantes.'},
  Bosnia:       {oficial:'Bósnia e Herzegovina',capital:'Sarajevo',regiao:'Europa (Bálcãs)',pop:'3,3M',copas:3,titulos:0,melhor:'Fase de grupos (2014)',curiosidade:'Eliminaram a Itália (4× campeã) nas eliminatórias europeias para 2026. Sarajevo sediou os Jogos Olímpicos de Inverno em 1984.'},
  Qatar:        {oficial:'Estado do Qatar',capital:'Doha',regiao:'Oriente Médio',pop:'2,9M',copas:2,titulos:0,melhor:'Fase de grupos',curiosidade:'Menor país a sediar uma Copa (2022). Único anfitrião eliminado na fase de grupos. O país possui a maior renda per capita do mundo.'},
  Suica:        {oficial:'Confederação Suíça',capital:'Berna',regiao:'Europa Central',pop:'8,8M',copas:12,titulos:0,melhor:'Quartas de final (1934, 1938, 1954)',curiosidade:'Sede da FIFA (Zurique) e do Comitê Olímpico Internacional. País famoso por relógios, chocolates e neutralidade histórica.'},
  Brasil:       {oficial:'República Federativa do Brasil',capital:'Brasília',regiao:'América do Sul',pop:'215M',copas:23,titulos:5,melhor:'🏆 Campeão (1958, 1962, 1970, 1994, 2002)',curiosidade:'ÚNICO país a disputar TODAS as edições da Copa. Maior vencedor da história com 5 títulos. O Brasil não ganhou em casa: perdeu a final de 1950 para o Uruguai no Maracanã.'},
  Marrocos:     {oficial:'Reino do Marrocos',capital:'Rabat',regiao:'África do Norte',pop:'37M',copas:7,titulos:0,melhor:'4º lugar (2022) — melhor da África!',curiosidade:'Primeira seleção africana e árabe a alcançar uma semifinal de Copa (2022). Em 2026, buscará superar essa marca histórica.'},
  Haiti:        {oficial:'República do Haiti',capital:'Porto Príncipe',regiao:'Caribe',pop:'11,5M',copas:2,titulos:0,melhor:'Fase de grupos (1974)',curiosidade:'Primeiro país caribenho a marcar um gol em Copa do Mundo (1974 vs. Itália). País mais pobre das Américas, com rica cultura musical e artística.'},
  Escocia:      {oficial:'Escócia (Reino Unido)',capital:'Edimburgo',regiao:'Europa (Ilhas Britânicas)',pop:'5,5M',copas:9,titulos:0,melhor:'Fase de grupos (nunca avançou)',curiosidade:'Uma das federações mais antigas do mundo (1873). O rugby é igualmente popular. A Escócia inventou o golf e o tênis moderno.'},
  EUA:          {oficial:'Estados Unidos da América',capital:'Washington D.C.',regiao:'América do Norte',pop:'335M',copas:12,titulos:0,melhor:'3º lugar (1930)',curiosidade:'Anfitrião de 2026 com 60 dos 104 jogos. Sediou a Copa de 1994, a mais lucrativa da história até então. O futebol (soccer) cresce exponencialmente no país.'},
  Paraguai:     {oficial:'República do Paraguai',capital:'Assunção',regiao:'América do Sul',pop:'7,5M',copas:9,titulos:0,melhor:'Quartas de final (2010)',curiosidade:'País sem saída para o mar localizado no coração da América do Sul. O guarani é co-idioma oficial ao lado do espanhol.'},
  Australia:    {oficial:'Comunidade da Austrália',capital:'Camberra',regiao:'Oceania',pop:'26M',copas:6,titulos:0,melhor:'Quartas de final (2006)',curiosidade:'Os "Socceroos" perderam para a Itália (campeã) nas quartas de 2006 num pênalti nos acréscimos. País com fauna única: cangurus, coalas e ornitorrincos.'},
  Turquia:      {oficial:'República da Türkiye',capital:'Ancara',regiao:'Europa e Ásia',pop:'85M',copas:3,titulos:0,melhor:'3º lugar (2002)',curiosidade:'País transcontinental: 97% em Ásia, 3% na Europa. Em 2002, com Hakan Şükür marcando o gol mais rápido da história de Copas (11 segundos), alcançou o 3º lugar.'},
  Alemanha:     {oficial:'República Federal da Alemanha',capital:'Berlim',regiao:'Europa Central',pop:'84M',copas:20,titulos:4,melhor:'🏆 Campeã (1954, 1974, 1990, 2014)',curiosidade:'Única seleção a disputar finais em quatro décadas consecutivas (1960-2000s). Também é a equipe europeia com mais participações na história.'},
  Curacao:      {oficial:'País de Curaçao (Países Baixos)',capital:'Willemstad',regiao:'Caribe',pop:'153 mil',copas:1,titulos:0,melhor:'Estreia em 2026',curiosidade:'🌟 MENOR PAÍS da história da Copa do Mundo! Com apenas 153.000 habitantes, é uma ilha autônoma dos Países Baixos. Muitos jogadores atuam na Holanda.'},
  Costa_Marfim: {oficial:'República da Costa do Marfim',capital:'Yamoussoukro',regiao:'África Ocidental',pop:'27M',copas:4,titulos:0,melhor:'Fase de grupos',curiosidade:'País de Didier Drogba, que ajudou a unificar a nação durante a guerra civil ao pedir cessar-fogo durante uma Copa Africana. Maior produtor mundial de cacau.'},
  Equador:      {oficial:'República do Equador',capital:'Quito',regiao:'América do Sul',pop:'18M',copas:4,titulos:0,melhor:'Fase de grupos (avançou em 2006)',curiosidade:'Único país cujo nome é o próprio equador geográfico. Quito é a capital mais alta do mundo (2.850m). As Ilhas Galápagos inspiraram Darwin.'},
  Holanda:      {oficial:'Reino dos Países Baixos',capital:'Amsterdã',regiao:'Europa Ocidental',pop:'17,9M',copas:12,titulos:0,melhor:'Vice-campeã (1974, 1978, 2010) — 3 finais!',curiosidade:'A "Laranja Mecânica" é a maior potência sem título. Johan Cruyff revolucionou o futebol com o "futebol total". O país fica parcialmente abaixo do nível do mar.'},
  Japao:        {oficial:'Japão',capital:'Tóquio',regiao:'Ásia Oriental',pop:'125M',copas:8,titulos:0,melhor:'Oitavas (4 vezes, mais recente 2022)',curiosidade:'Principal potência do futebol asiático. A J-League atraiu estrelas como Zico, Lineker e Dunga. O torcedor japonês é famoso por limpar as arquibancadas após os jogos.'},
  Suecia:       {oficial:'Reino da Suécia',capital:'Estocolmo',regiao:'Europa do Norte',pop:'10,6M',copas:13,titulos:0,melhor:'2º lugar (1958) · 3º lugar (1950, 1994)',curiosidade:'Erling Haaland e Zlatan Ibrahimović (sueco de origem bósnia) são os maiores nomes escandinavos recentes. A Suécia sediou a Copa de 1958, quando o Brasil conquistou seu 1º título.'},
  Tunisia:      {oficial:'República da Tunísia',capital:'Túnis',regiao:'África do Norte',pop:'12M',copas:6,titulos:0,melhor:'Fase de grupos',curiosidade:'Primeiro país africano a vencer um jogo de Copa do Mundo (1978 vs. México, 3-1). País com mais sítios arqueológicos da África: ruínas de Cartago ficam perto da capital.'},
  Belgica:      {oficial:'Reino da Bélgica',capital:'Bruxelas',regiao:'Europa Ocidental',pop:'11,6M',copas:14,titulos:0,melhor:'3º lugar (2018)',curiosidade:'A "geração de ouro" (De Bruyne, Hazard, Lukaku, Courtois) foi classificada como a melhor de todos os tempos pelo ranking FIFA. Bruxelas é sede da União Europeia e da OTAN.'},
  Egito:        {oficial:'República Árabe do Egito',capital:'Cairo',regiao:'África do Norte',pop:'104M',copas:4,titulos:0,melhor:'Fase de grupos',curiosidade:'País mais populoso da África (104M). Ausente por 36 anos (1990-2026). Mo Salah é o jogador mais famoso da história egípcia moderna. As pirâmides de Gizé têm 4.500 anos.'},
  Ira:          {oficial:'República Islâmica do Irã',capital:'Teerã',regiao:'Oriente Médio',pop:'87M',copas:7,titulos:0,melhor:'Fase de grupos',curiosidade:'2ª maior seleção do Oriente Médio em número de participações. A Liga de Futebol do Irã é a mais seguida do Oriente Médio, com mais de 20 clubes profissionais.'},
  Nova_Zelandia:{oficial:'Nova Zelândia',capital:'Wellington',regiao:'Oceania',pop:'5,1M',copas:4,titulos:0,melhor:'Fase de grupos (invicta em 2010!)',curiosidade:'Em 2010, foi a ÚNICA seleção não eliminada na fase de grupos (3 empates, 0 derrotas). O rugby é o esporte nacional; os All Blacks são os maiores campeões do mundo no rugby.'},
  Espanha:      {oficial:'Reino da Espanha',capital:'Madri',regiao:'Europa Ocidental',pop:'47,4M',copas:16,titulos:1,melhor:'🏆 Campeã (2010)',curiosidade:'Conquistou Euro 2008 + Copa 2010 + Euro 2012 — tríplice coroa histórica. O tiki-taka revolucionou o futebol mundial. Atual favorita com La Roja de Pedri, Yamal e Morata.'},
  Cabo_Verde:   {oficial:'República de Cabo Verde',capital:'Praia',regiao:'África Ocidental (arquipélago)',pop:'570 mil',copas:1,titulos:0,melhor:'Estreia em 2026',curiosidade:'2ª menor nação do Mundial 2026. Arquipélago de 10 ilhas no Atlântico. Muitos jogadores atuam na Europa (principalmente Portugal). País famoso pela música Morna (Cesária Évora).'},
  Arabia_Saudita:{oficial:'Reino da Arábia Saudita',capital:'Riade',regiao:'Oriente Médio',pop:'35M',copas:7,titulos:0,melhor:'Oitavas de final (1994)',curiosidade:'Em 2022 surpreendeu a Argentina 2-1 — um dos maiores upsets de Copas. O país possui as maiores reservas de petróleo do mundo e sedia o futebol com astros como Cristiano Ronaldo.'},
  Uruguai:      {oficial:'República Oriental do Uruguai',capital:'Montevidéu',regiao:'América do Sul',pop:'3,5M',copas:14,titulos:2,melhor:'🏆 Campeã (1930, 1950)',curiosidade:'Menor população entre os bicampeões. Em 1950, 200 mil torcedores no Maracanã choraram com a derrota do Brasil diante do Uruguai — o "Maracanazo".'},
  Franca:       {oficial:'República Francesa',capital:'Paris',regiao:'Europa Ocidental',pop:'68M',copas:16,titulos:2,melhor:'🏆 Campeã (1998, 2018) · 2º lugar (2022)',curiosidade:'Zinedine Zidane e Kylian Mbappé são os maiores ícones. A França de 2022 foi vice-campeã após uma final épica (3-3) com a Argentina. Mbappé é o artilheiro mais jovem da história da Copa.'},
  Senegal:      {oficial:'República do Senegal',capital:'Dacar',regiao:'África Ocidental',pop:'17M',copas:4,titulos:0,melhor:'Quartas de final (2002)',curiosidade:'Campeã africana em 2021 e 2023. Sadio Mané e Kalidou Koulibaly são os maiores ícones. O Senegal foi a 1ª seleção africana a vencer uma Copa Africana por pênaltis.'},
  Iraque:       {oficial:'República do Iraque',capital:'Bagdá',regiao:'Oriente Médio',pop:'42M',copas:2,titulos:0,melhor:'Fase de grupos',curiosidade:'Retorna às Copas após 40 anos (última em 1986). Campeão asiático em 2007 — maior conquista do futebol iraquiano. O Iraque fica na Mesopotâmia, berço da civilização.'},
  Noruega:      {oficial:'Reino da Noruega',capital:'Oslo',regiao:'Europa do Norte',pop:'5,5M',copas:4,titulos:0,melhor:'Oitavas de final (1938)',curiosidade:'Erling Haaland é o maior fenômeno atual: artilheiro da Premier League com a camisa do Manchester City. A Noruega tem o maior IDH do mundo e 95% de sua eletricidade é hidrelétrica.'},
  Argentina:    {oficial:'República Argentina',capital:'Buenos Aires',regiao:'América do Sul',pop:'46M',copas:19,titulos:3,melhor:'🏆 Campeã (1978, 1986, 2022)',curiosidade:'Lionel Messi, 8x melhor do mundo, conquistou o tão esperado título em 2022. Diego Maradona (1986) marcou o "Gol do Século" e o "Gol de Deus" na mesma partida vs. Inglaterra.'},
  Algeria:      {oficial:'República Democrática Popular da Argélia',capital:'Argel',regiao:'África do Norte',pop:'45M',copas:5,titulos:0,melhor:'Oitavas de final (2014)',curiosidade:'Em 1982, surpreendeu a Alemanha Ocidental 2-1 — um dos maiores upsets da história. Maior país da África em extensão territorial. A desertificação atinge 85% do seu território.'},
  Austria:      {oficial:'República da Áustria',capital:'Viena',regiao:'Europa Central',pop:'9,1M',copas:9,titulos:0,melhor:'3º lugar (1954)',curiosidade:'Nos anos 30, o "Wunderteam" austríaco era considerado o melhor da Europa. Viena é a "cidade da música": Beethoven, Mozart e Brahms viveram aqui. Berço do psicoterapeuta Sigmund Freud.'},
  Jordania:     {oficial:'Reino Hachemita da Jordânia',capital:'Amã',regiao:'Oriente Médio',pop:'10,2M',copas:1,titulos:0,melhor:'🌟 Estreia em 2026',curiosidade:'Primeira Copa do Mundo da Jordânia! País lar de Petra, uma das 7 Maravilhas do Mundo Moderno. O Mar Morto (fronteira com Israel) é o ponto mais baixo da Terra (430m abaixo do nível do mar).'},
  Portugal:     {oficial:'República Portuguesa',capital:'Lisboa',regiao:'Europa Ocidental',pop:'10,3M',copas:9,titulos:0,melhor:'3º lugar (1966) · 4º lugar (2006)',curiosidade:'Cristiano Ronaldo, com mais de 130 gols internacionais, é o maior artilheiro de seleções da história. Portugal é a porta de entrada histórica para a América: descobriu o Brasil em 1500.'},
  Congo:        {oficial:'República Democrática do Congo',capital:'Kinshasa',regiao:'África Central',pop:'100M',copas:3,titulos:0,melhor:'Fase de grupos (como Zaire, 1974)',curiosidade:'Disputou a Copa de 1974 como Zaire. 2ª maior floresta tropical do mundo. O rio Congo é o 2º maior do mundo em volume d\'água. País com mais de 200 grupos étnicos.'},
  Uzbequistao:  {oficial:'República do Uzbequistão',capital:'Tashkent',regiao:'Ásia Central',pop:'36M',copas:1,titulos:0,melhor:'🌟 Estreia em 2026',curiosidade:'Uma das raras nações duplamente bloqueadas: sem saída para o mar, rodeado apenas por países sem mar. Samarcanda (Silk Road) foi uma das cidades mais importantes da história da Ásia.'},
  Colombia:     {oficial:'República da Colômbia',capital:'Bogotá',regiao:'América do Sul',pop:'52M',copas:7,titulos:0,melhor:'Quartas de final (2014)',curiosidade:'James Rodríguez foi o artilheiro e melhor jogador da Copa de 2014. Carlos Valderrama é o maior ícone histórico. A Colômbia tem a maior biodiversidade do mundo em pássaros.'},
  Inglaterra:   {oficial:'Inglaterra (Reino Unido)',capital:'Londres',regiao:'Europa (Ilhas Britânicas)',pop:'56M',copas:17,titulos:1,melhor:'🏆 Campeã (1966)',curiosidade:'País que inventou o futebol moderno (regras em 1863). Aguarda seu 2º título há 60 anos — a maior "seca" entre os campeões. O estádio de Wembley recebeu a final de 1966.'},
  Croacia:      {oficial:'República da Croácia',capital:'Zagreb',regiao:'Europa (Bálcãs)',pop:'3,9M',copas:9,titulos:0,melhor:'2º lugar (2018) · 3º lugar (1998, 2022)',curiosidade:'Um dos menores países entre os mais bem-sucedidos: 4M de habitantes e 2 finais de Copa. Luka Modrić, Ballon d\'Or 2018, é o maior nome. O xadrez moderno foi reinventado na Croácia.'},
  Gana:         {oficial:'República do Gana',capital:'Acra',regiao:'África Ocidental',pop:'33M',copas:4,titulos:0,melhor:'Quartas de final (2010)',curiosidade:'Em 2010, Luis Suárez defendeu com a mão no fim do jogo vs. Gana (pênalti perdido). Primeiro país da África Subsaariana a se tornar independente (1957). Os Black Stars são referência africana.'},
  Panama:       {oficial:'República do Panamá',capital:'Cidade do Panamá',regiao:'América Central',pop:'4,4M',copas:3,titulos:0,melhor:'Fase de grupos',curiosidade:'O Canal do Panamá (1914) é uma das maiores obras de engenharia da história — liga Atlântico ao Pacífico. O país conecta as Américas do Norte e do Sul geograficamente.'},
};

// ================================================================
// PONTUAÇÃO
// ================================================================
function calcPontos(prog, res) {
  if(!res||res.casa===''||res.casa==null||res.fora===''||res.fora==null) return null;
  const pH=parseInt(prog?.casa??''),pA=parseInt(prog?.fora??''),aH=parseInt(res.casa),aA=parseInt(res.fora);
  if([pH,pA,aH,aA].some(isNaN)) return null;
  if(pH===aH&&pA===aA){if(aH===aA) return aH===0?2:4; return 5;}
  const isDraw=aH===aA,predDraw=pH===pA;
  if(isDraw) return predDraw?1:0;
  const homeW=aH>aA,predHomeW=pH>pA;
  if(predDraw||homeW!==predHomeW) return 0;
  const wS=homeW?aH:aA,lS=homeW?aA:aH,pW=homeW?pH:pA,pL=homeW?pA:pH;
  if(pW===wS) return 3; if(pL===lS) return 2; return 1;
}
function calcTotal(progs,res){return JOGOS.reduce((a,j)=>{const p=progs?.[j.id],r=res?.[j.id];if(!p||!r)return a;return a+(calcPontos(p,r)??0);},0);}

const COR={verde:'#009c3b',amarelo:'#FFDF00',azul:'#002776',vermelho:'#EF4444',verde_claro:'#22c55e',laranja:'#f97316'};

// ================================================================
// SUPABASE CLIENT
// ================================================================
function createSB(url,key){
  const H={'apikey':key,'Authorization':`Bearer ${key}`,'Content-Type':'application/json'};
  const run=async(m,p,b,pr)=>{const r=await fetch(`${url}/rest/v1/${p}`,{method:m,headers:{...H,...(pr?{'Prefer':pr}:{})},body:b?JSON.stringify(b):undefined});if(!r.ok){const t=await r.text();throw new Error(t||r.statusText);}const t=await r.text();return t?JSON.parse(t):null;};
  return{
    get:(t,q='')=>run('GET',`${t}${q?'?'+q:''}`),
    post:(t,d,pr='return=representation')=>run('POST',t,d,pr),
    patch:(t,f,d)=>run('PATCH',`${t}?${f}`,d,'return=representation'),
    upsert:(t,d)=>run('POST',t,d,'resolution=merge-duplicates,return=representation'),
  };
}

// Storage pessoal (session)
const Sess={
  async get(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}},
  async set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
  async del(k){try{localStorage.removeItem(k);}catch{}},
};

// Utils
function djb2(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i),h=h>>>0;return h.toString(16);}
function gerarId(){return Date.now().toString(36)+Math.random().toString(36).substr(2,8);}
function gerarPin(){return Math.random().toString(36).substr(2,6).toUpperCase();}
function prazoPassou(){return new Date()>PRAZO;}
function formatarTel(t){return t.replace(/\D/g,'').replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3');}

// ================================================================
// CSS + DESIGN SISTEMA
// ================================================================
const CSS_GLOBAL=`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
input[type=number]{-moz-appearance:textfield;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:rgba(0,0,0,.2);}::-webkit-scrollbar-thumb{background:#009c3b;border-radius:3px;}
.btn{transition:all .18s;}.btn:hover:not(:disabled){filter:brightness(1.12);transform:translateY(-1px);}
.btn:active:not(:disabled){transform:translateY(0);}
.btn:disabled{opacity:.5;cursor:not-allowed;}
.card-h{transition:transform .2s,box-shadow .2s;}.card-h:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3);}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.fade{animation:fadeIn .3s ease;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}.pulse{animation:pulse 1.5s infinite;}
@keyframes shine{0%{background-position:-200%}100%{background-position:200%}}
`;

// Variáveis de estilo
const S={
  card:(x={})=>({background:'rgba(0,0,0,0.35)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'18px 22px',backdropFilter:'blur(10px)',...x}),
  inp:{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.18)',borderRadius:9,color:'#f3f4f6',padding:'9px 13px',fontFamily:'Barlow,sans-serif',fontSize:'0.93em',outline:'none',width:'100%'},
  sInp:{width:46,background:'rgba(0,0,0,0.45)',border:'2px solid rgba(255,215,0,0.45)',borderRadius:8,color:'#fff',textAlign:'center',fontSize:'1.1em',fontWeight:700,padding:'6px 0',outline:'none'},
  btn:(c=COR.verde,x={})=>({background:c,color:'#fff',border:'none',borderRadius:10,padding:'10px 22px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'1em',cursor:'pointer',...x}),
};

// Bandeira via CDN
function Bandeira({code,size=20}){
  const url=`https://flagcdn.com/w40/${code}.png`;
  return <img src={url} alt={code} style={{width:Math.round(size*1.5),height:size,objectFit:'cover',borderRadius:3,verticalAlign:'middle',border:'1px solid rgba(255,255,255,0.15)'}} onError={e=>{e.target.style.display='none';}} />;
}

function Tag({children,cor=COR.verde}){return <span style={{background:cor,color:'#fff',borderRadius:6,padding:'2px 9px',fontSize:'0.75em',fontWeight:700,whiteSpace:'nowrap'}}>{children}</span>;}
function Inp({value,onChange,placeholder,type='text',style={},disabled}){return <input value={value} onChange={onChange} placeholder={placeholder} type={type} disabled={disabled} style={{...S.inp,...style}} />;}
function Btn({children,onClick,cor=COR.verde,disabled,style={}}){return <button className="btn" onClick={onClick} disabled={disabled} style={{...S.btn(cor),opacity:disabled?.5:1,...style}}>{children}</button>;}

function Countdown(){
  const[t,setT]=useState('');
  useEffect(()=>{
    const tk=()=>{const d=PRAZO-new Date();if(d<=0){setT('⛔ ENCERRADO');return;}
    const dy=Math.floor(d/86400000),h=Math.floor((d%86400000)/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);
    setT(`${dy}d ${h}h ${m}m ${s}s`);};tk();const i=setInterval(tk,1000);return()=>clearInterval(i);
  },[]);
  return <span style={{fontFamily:'monospace',fontSize:'1.05em',color:prazoPassou()?COR.vermelho:COR.verde_claro}}>{t}</span>;
}

// ================================================================
// TELA: CONFIGURAÇÃO SUPABASE
// ================================================================
function TelaConfig({onSalvar}){
  const[url,setUrl]=useState('');
  const[key,setKey]=useState('');
  const[err,setErr]=useState('');
  const[load,setL]=useState(false);
  const testar=async()=>{
    if(!url.trim()||!key.trim()){setErr('Preencha URL e chave.');return;}
    setL(true);setErr('');
    try{const sb=createSB(url.trim(),key.trim());await sb.get('configuracoes','limit=1');onSalvar(url.trim(),key.trim());}
    catch(e){setErr('Não foi possível conectar. Verifique os dados.\n'+e.message);}
    setL(false);
  };
  return(
    <div style={{minHeight:'100vh',background:`linear-gradient(135deg,#002776,#009c3b 60%,#002776)`,display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:'Barlow,sans-serif',color:'#f3f4f6'}}>
      <style>{CSS_GLOBAL}</style>
      <div className="fade" style={{...S.card({maxWidth:500,width:'100%',border:'2px solid rgba(255,223,0,0.3)'})}}>
        <div style={{textAlign:'center',marginBottom:22}}>
          <div style={{fontSize:'3em'}}>⚙️⚽</div>
          <h2 style={{margin:'8px 0 4px',fontFamily:'Barlow Condensed',fontSize:'1.7em',color:COR.amarelo}}>{NOME_BOLAO}</h2>
          <p style={{color:'#9ca3af',fontSize:'0.88em',margin:0}}>Configuração inicial do banco de dados</p>
        </div>
        <div style={{background:'rgba(0,156,59,0.12)',border:'1px solid rgba(0,156,59,0.3)',borderRadius:10,padding:'14px 16px',marginBottom:18,fontSize:'0.83em',lineHeight:1.8}}>
          <strong style={{color:COR.amarelo}}>Passo a passo:</strong>
          <ol style={{margin:'8px 0 0',paddingLeft:20,color:'#d1d5db'}}>
            <li>Acesse <a href="https://supabase.com" target="_blank" style={{color:COR.verde_claro}}>supabase.com</a> → crie conta e projeto</li>
            <li>Execute o arquivo <code style={{color:COR.amarelo}}>schema_bolao_2026_v2.sql</code> no SQL Editor</li>
            <li>Vá em <strong>Settings › API</strong> → copie <em>Project URL</em> e <em>anon public key</em></li>
            <li>Cole abaixo e clique em Conectar</li>
          </ol>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:'0.83em',color:'#9ca3af',marginBottom:4}}>Project URL</label>
          <Inp value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://xxxx.supabase.co" />
        </div>
        <div style={{marginBottom:18}}>
          <label style={{display:'block',fontSize:'0.83em',color:'#9ca3af',marginBottom:4}}>Anon Public Key</label>
          <Inp value={key} onChange={e=>setKey(e.target.value)} placeholder="eyJhbGci..." type="password" />
        </div>
        {err&&<div style={{background:'rgba(239,68,68,0.15)',border:'1px solid #ef4444',borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:'0.83em',color:'#fca5a5',whiteSpace:'pre-wrap'}}>{err}</div>}
        <Btn onClick={testar} disabled={load} style={{width:'100%',fontSize:'1.05em',padding:'13px'}}>
          {load?'⏳ Testando...':'🔗 Conectar ao Supabase'}
        </Btn>
      </div>
    </div>
  );
}

// ================================================================
// HEADER + NAVEGAÇÃO
// ================================================================
function Header({tela,setTela,sessao,onSair,travado}){
  const navs=[
    {id:'inicio',ic:'🏠',l:'Início'},{id:'classificacao',ic:'🏆',l:'Classificação'},
    {id:'todos',ic:'👁️',l:'Prognósticos'},{id:'paises',ic:'🌍',l:'Seleções'},
    ...(sessao?[{id:'meus',ic:'📋',l:'Meus'}]:[]),
    {id:'admin',ic:'🔐',l:'Admin'},
  ];
  return(
    <div style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(14px)',borderBottom:`2px solid ${COR.amarelo}22`,position:'sticky',top:0,zIndex:100}}>
      <div style={{maxWidth:980,margin:'0 auto',padding:'0 12px',display:'flex',alignItems:'center',gap:6,height:52,flexWrap:'wrap'}}>
        <span style={{fontFamily:'Barlow Condensed',fontWeight:900,fontSize:'1.05em',color:COR.amarelo,marginRight:8,whiteSpace:'nowrap'}}>
          ⚽ Bolão Família D/M {travado&&<Tag cor='#ef4444'>🔒 TRAVADO</Tag>}
        </span>
        <div style={{display:'flex',gap:3,flexWrap:'wrap',flex:1}}>
          {navs.map(n=>(
            <button key={n.id} className="btn" onClick={()=>setTela(n.id)}
              style={{background:tela===n.id?`${COR.verde}88`:'transparent',border:tela===n.id?`1px solid ${COR.verde}`:'1px solid transparent',borderRadius:8,color:'#fff',padding:'4px 10px',cursor:'pointer',fontSize:'0.8em',fontFamily:'Barlow'}}>
              {n.ic} {n.l}
            </button>
          ))}
        </div>
        {sessao&&(
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:'0.75em',color:'#9ca3af'}}>{sessao.nome}</span>
            <Btn onClick={onSair} cor='#374151' style={{fontSize:'0.75em',padding:'4px 10px'}}>Sair</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// TELA: INÍCIO
// ================================================================
function TelaInicio({onCadastrar,onLogin,sessao,participantes,pixInfo}){
  const prazo=prazoPassou();
  const pagos=participantes.filter(p=>p.pago);
  const totalArrecadado=pagos.length*VALOR_APOSTA;
  return(
    <div style={{maxWidth:740,margin:'0 auto',display:'flex',flexDirection:'column',gap:18}}>
      {/* Hero */}
      <div className="fade" style={{...S.card({background:`linear-gradient(135deg,rgba(0,39,118,0.6),rgba(0,156,59,0.4))`,textAlign:'center',border:`2px solid ${COR.amarelo}44`})}}>
        <div style={{fontSize:'3.2em',marginBottom:6}}>⚽🇧🇷🏆</div>
        <h1 style={{margin:'0 0 4px',fontFamily:'Barlow Condensed',fontSize:'2.1em',color:COR.amarelo,letterSpacing:1}}>{NOME_BOLAO}</h1>
        <p style={{color:'#9ca3af',margin:'0 0 16px',fontSize:'0.88em'}}>Copa do Mundo FIFA 2026 · EUA · Canadá · México · 1ª Fase (72 jogos)</p>
        <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',marginBottom:16}}>
          <div style={{background:'rgba(0,0,0,0.4)',borderRadius:12,padding:'12px 20px',minWidth:160}}>
            <div style={{fontSize:'0.75em',color:'#9ca3af'}}>⏰ Prazo das apostas</div>
            <div style={{fontSize:'1.2em',marginTop:2}}><Countdown /></div>
            <div style={{fontSize:'0.7em',color:'#6b7280'}}>10/06/2026 às 23h59</div>
          </div>
          <div style={{background:'rgba(0,0,0,0.4)',borderRadius:12,padding:'12px 20px',minWidth:160}}>
            <div style={{fontSize:'0.75em',color:'#9ca3af'}}>👥 Apostadores confirmados</div>
            <div style={{fontSize:'1.8em',fontWeight:800,color:COR.amarelo,fontFamily:'Barlow Condensed'}}>{pagos.length}</div>
            <div style={{fontSize:'0.75em',color:COR.verde_claro,fontWeight:700}}>💰 R$ {totalArrecadado.toLocaleString('pt-BR',{minimumFractionDigits:2})} arrecadados</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
          {!prazo&&!sessao&&<Btn onClick={onCadastrar} style={{fontSize:'1.05em',padding:'12px 32px',background:'linear-gradient(135deg,#009c3b,#007a2f)'}}>🎯 Fazer Minha Aposta</Btn>}
          {!prazo&&!sessao&&<div style={{marginTop:8,fontSize:'0.78em',color:'#6b7280'}}>Já se cadastrou? <span style={{color:'#22c55e',cursor:'pointer',textDecoration:'underline'}} onClick={onLogin}>Entrar com meu PIN</span></div>}
          {sessao&&<Tag cor={COR.verde}>✅ Olá, {sessao.nome}! Veja seus prognósticos no menu.</Tag>}
          {prazo&&!sessao&&<Tag cor={COR.vermelho}>❌ Período de inscrições encerrado.</Tag>}
        </div>
      </div>

      {/* PIX */}
      {pixInfo?.chave&&(
        <div style={{...S.card({background:'rgba(0,156,59,0.15)',border:`2px solid ${COR.verde}`})}}>
          <h3 style={{margin:'0 0 10px',fontFamily:'Barlow Condensed',color:COR.amarelo,fontSize:'1.2em'}}>💳 Pagamento via PIX — R$ {VALOR_APOSTA},00 por aposta</h3>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            <div><div style={{fontSize:'0.75em',color:'#9ca3af'}}>Tipo de chave</div><div style={{fontWeight:700}}>{pixInfo.tipo}</div></div>
            <div><div style={{fontSize:'0.75em',color:'#9ca3af'}}>Chave PIX</div><div style={{fontWeight:700,color:COR.amarelo,fontFamily:'monospace',fontSize:'1.05em'}}>{pixInfo.chave}</div></div>
            <div><div style={{fontSize:'0.75em',color:'#9ca3af'}}>Titular</div><div style={{fontWeight:700}}>{pixInfo.titular}</div></div>
            {pixInfo.banco&&<div><div style={{fontSize:'0.75em',color:'#9ca3af'}}>Banco</div><div style={{fontWeight:700}}>{pixInfo.banco}</div></div>}
          </div>
          <p style={{fontSize:'0.8em',color:'#f97316',margin:'10px 0 0'}}>⚠️ Após fazer o PIX, aguarde a confirmação do administrador. Somente após a confirmação sua aposta estará válida.</p>
        </div>
      )}

      {/* Regulamento */}
      <div style={S.card()}>
        <h2 style={{margin:'0 0 12px',fontFamily:'Barlow Condensed',fontSize:'1.3em',color:COR.amarelo}}>📋 Regulamento Oficial</h2>
        <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:'0.88em',color:'#d1d5db',lineHeight:1.8}}>
          {[
            ['🏆','1ª FASE APENAS','72 partidas da Fase de Grupos. O bolão encerra com o último jogo da fase de grupos.'],
            ['⏱️','TEMPO DE JOGO','Apenas 90 minutos + acréscimos oficiais. Sem prorrogação ou pênaltis.'],
            ['⚽','RESULTADOS','Somente resultados oficiais reconhecidos pela FIFA são válidos.'],
            ['⏰','PRAZO','Apostas encerram em 10/06/2026 às 23h59 (Brasília). Após isso, nenhuma alteração.'],
            ['👁️','TRANSPARÊNCIA','Todos os prognósticos ficam visíveis a todos após o encerramento das apostas.'],
            ['💰','SEM TAXA','NÃO há cobrança de taxa de administração. 100% do valor arrecadado vai ao(s) vencedor(es).'],
            ['🎉','CARÁTER','Este bolão é um passatempo familiar e de entretenimento entre amigos e família.'],
            ['👶','MENORES','A participação de menores de 18 anos deve estar registrada em nome do responsável.'],
            ['🤝','EMPATE','Em caso de empate na pontuação final, o prêmio é dividido igualmente.'],
            ['🔒','NÃO REEMBOLSO','Não há devolução após o início da 1ª partida (11/06/2026).'],
            ['🚨','SUSPENSÃO','Em caso de suspensão DEFINITIVA dos jogos por qualquer razão, o valor é devolvido integralmente.'],
            ['📱','MÚLTIPLAS APOSTAS','Uma mesma pessoa pode realizar mais de uma aposta. Cada aposta deve ter o mesmo nome seguido de (Aposta 1), (Aposta 2), etc.'],
            ['👨‍👩‍👧','AMIGOS','Amigos da família podem participar. Devem indicar o nome do membro da família que os convidou.'],
          ].map(([ic,titulo,desc],i)=>(
            <div key={i} style={{display:'flex',gap:10,padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <span style={{fontSize:'1.1em',minWidth:24}}>{ic}</span>
              <div><strong style={{color:'#fff'}}>{titulo}:</strong> {desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de pontuação */}
      <div style={S.card()}>
        <h2 style={{margin:'0 0 14px',fontFamily:'Barlow Condensed',fontSize:'1.25em',color:COR.amarelo}}>🏅 Tabela de Pontuação</h2>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85em'}}>
            <thead><tr style={{borderBottom:`2px solid ${COR.verde}44`}}>
              <th style={{textAlign:'left',padding:'7px 8px',color:'#9ca3af'}}>Situação</th>
              <th style={{textAlign:'center',padding:'7px',color:'#9ca3af'}}>Prog.</th>
              <th style={{textAlign:'center',padding:'7px',color:'#9ca3af'}}>Real</th>
              <th style={{textAlign:'center',padding:'7px 8px',color:COR.amarelo}}>Pts</th>
            </tr></thead>
            <tbody>
              {[['Placar exato (decisivo)','2×1','2×1',5,'#22c55e'],['Empate exato com gols','2×2','2×2',4,'#16a34a'],
                ['Só placar do vencedor','2×1','2×0',3,'#84cc16'],['Só placar do vencido','3×1','2×1',2,'#eab308'],
                ['Empate exato 0×0','0×0','0×0',2,'#eab308'],['Vencedor certo, ambos errados','3×2','2×1',1,'#f97316'],
                ['Empate certo, placar errado','0×0','1×1',1,'#f97316'],['Errou completamente','2×1','0×1',0,'#ef4444'],
              ['⚠️ Jogo cancelado (sem resultado oficial FIFA)','–','–','–','#6b7280'],
            ].map(([s,p,r,pt,c],i)=>(
                <tr key={i} style={{background:i%2?'transparent':'rgba(255,255,255,0.02)',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'6px 8px',color:'#e5e7eb'}}>{s}</td>
                  <td style={{padding:'6px',textAlign:'center',fontFamily:'monospace',color:'#9ca3af'}}>{p}</td>
                  <td style={{padding:'6px',textAlign:'center',fontFamily:'monospace',color:'#9ca3af'}}>{r}</td>
                  <td style={{padding:'6px 8px',textAlign:'center',fontWeight:800,fontSize:'1.05em',color:c}}>{pt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{background:'rgba(255,160,0,0.08)',border:'1px solid rgba(255,160,0,0.25)',borderRadius:8,padding:'9px 13px',marginTop:10,fontSize:'0.8em',color:'#fbbf24',lineHeight:1.7}}>
            <strong>⚠️ Suspensão temporária:</strong> o placar só vale após encerramento oficial pela FIFA. Jogo cancelado sem resultado FIFA = sem pontuação nessa partida.
          </div>
        </div>
      </div>

      {/* Grupos */}
      <div style={S.card()}>
        <h2 style={{margin:'0 0 14px',fontFamily:'Barlow Condensed',fontSize:'1.25em',color:COR.amarelo}}>🌍 12 Grupos — Copa do Mundo 2026</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))',gap:10}}>
          {Object.entries(GRUPOS).map(([g,ts])=>(
            <div key={g} style={{background:'rgba(0,0,0,0.25)',borderRadius:10,padding:'10px 14px',border:`1px solid rgba(255,223,0,0.12)`}}>
              <div style={{fontWeight:900,color:COR.amarelo,fontFamily:'Barlow Condensed',fontSize:'1.05em',marginBottom:7,borderBottom:`1px solid ${COR.amarelo}33`,paddingBottom:4}}>Grupo {g}</div>
              {ts.map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:'0.83em',color:'#d1d5db',padding:'2px 0'}}>
                  <Bandeira code={FLAG_CODES[t]} size={14} />
                  <span>{TIMES[t].flag}</span>
                  <span>{TIMES[t].nome}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================================================================
// TELA: ACESSO
// ================================================================
function TelaAcesso({modo,sb,onSucesso,onVoltar,travado}){
  const[nome,setNome]=useState('');
  const[pinVal,setPin]=useState('');
  const[tel,setTel]=useState('');
  const[naVal,setNA]=useState(1);
  const[indicado,setIndicado]=useState('');
  const[pinGerado,setPG]=useState('');
  const[load,setL]=useState(false);
  const[err,setErr]=useState('');
  const[passoV,setPasso]=useState(1);
  const prazo=prazoPassou();

  const nomeFinal=naVal>1?`${nome.trim()} (Aposta ${naVal})`:nome.trim();

  const cadastrar=async()=>{
    if(!nome.trim()||nome.trim().length<2){setErr('Digite seu nome completo.');return;}
    if(!tel.trim()||tel.replace(/\D/g,'').length<10){setErr('Digite um telefone válido com DDD.');return;}
    if(prazo||travado){setErr('Período de apostas encerrado.');return;}
    setL(true);setErr('');
    try{
      const p=gerarPin(),id=gerarId();
      await sb.post('participantes',{id,nome:nomeFinal,telefone:tel.trim(),num_aposta:naVal,indicado_por:indicado.trim()||null,codigo_hash:djb2(p),pago:false,pronosticos:{}});
      await Sess.set('bolao:sessao',{id,nome:nomeFinal});
      setPG(p);setPasso(2);
    }catch(e){
      const msg=e.message.includes('SISTEMA_TRAVADO')?'Sistema travado. Apostas encerradas.':'Erro ao cadastrar: '+e.message;
      setErr(msg);
    }
    setL(false);
  };

  const entrar=async()=>{
    if(!nome.trim()||!pinVal.trim()){setErr('Preencha nome e PIN.');return;}
    setL(true);setErr('');
    try{
      const todos=await sb.get('participantes',`nome=ilike.${encodeURIComponent(nome.trim())}&select=*`);
      if(!todos||todos.length===0){setErr('Nome não encontrado. Verifique a grafia exata ou cadastre-se.');setL(false);return;}
      const part=todos.find(p=>p.codigo_hash===djb2(pinVal.trim().toUpperCase()));
      if(!part){setErr('PIN incorreto. Verifique o código gerado no cadastro.');setL(false);return;}
      await Sess.set('bolao:sessao',{id:part.id,nome:part.nome});
      onSucesso(part.id,part.nome);
    }catch(e){setErr('Erro: '+e.message);}
    setL(false);
  };

  if(passoV===2) return(
    <div className="fade" style={{...S.card({maxWidth:460,margin:'40px auto',textAlign:'center',border:`2px solid ${COR.amarelo}66`})}}>
      <div style={{fontSize:'2.8em',marginBottom:8}}>🎉</div>
      <h3 style={{fontFamily:'Barlow Condensed',margin:'0 0 8px',fontSize:'1.6em',color:COR.amarelo}}>Cadastro realizado!</h3>
      <p style={{color:'#9ca3af',fontSize:'0.9em'}}>Bem-vindo(a), <strong style={{color:'#fff'}}>{nomeFinal}</strong>!</p>
      <div style={{background:`rgba(0,39,118,0.4)`,border:`2px solid ${COR.amarelo}`,borderRadius:14,padding:'18px 24px',margin:'16px 0'}}>
        <div style={{fontSize:'0.78em',color:'#9ca3af',marginBottom:6}}>🔑 SEU PIN DE ACESSO ÚNICO</div>
        <div style={{fontSize:'3em',fontFamily:'Barlow Condensed',fontWeight:900,letterSpacing:8,color:COR.amarelo}}>{pinGerado}</div>
        <div style={{fontSize:'0.78em',color:COR.vermelho,marginTop:8,fontWeight:700}}>⚠️ ANOTE AGORA! Esse PIN não poderá ser recuperado.<br/>Você precisará dele para acessar de outros dispositivos.</div>
      </div>
      <p style={{fontSize:'0.82em',color:'#9ca3af',margin:'0 0 14px'}}>Agora realize o PIX de <strong style={{color:COR.amarelo}}>R$ {VALOR_APOSTA},00</strong> e aguarde a confirmação do administrador.</p>
      <Btn onClick={()=>onSucesso(null,nomeFinal)} style={{width:'100%',fontSize:'1.05em',padding:'13px'}}>📝 Preencher Meus 72 Prognósticos →</Btn>
    </div>
  );

  return(
    <div className="fade" style={{...S.card({maxWidth:460,margin:'40px auto'})}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <Btn onClick={onVoltar} cor='#374151' style={{padding:'6px 12px',fontSize:'0.85em'}}>← Voltar</Btn>
        <h2 style={{margin:0,fontFamily:'Barlow Condensed',fontSize:'1.45em'}}>{modo==='cadastro'?'🎯 Nova Aposta':'🔑 Acessar Prognósticos'}</h2>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{display:'block',fontSize:'0.82em',color:'#9ca3af',marginBottom:4}}>Nome completo *</label>
        <Inp value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome completo" />
      </div>
      {modo==='cadastro'&&(
        <>
          <div style={{marginBottom:12}}>
            <label style={{display:'block',fontSize:'0.82em',color:'#9ca3af',marginBottom:4}}>WhatsApp / Telefone * (com DDD)</label>
            <Inp value={tel} onChange={e=>setTel(e.target.value)} placeholder="(11) 99999-9999" type="tel" />
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:'block',fontSize:'0.82em',color:'#9ca3af',marginBottom:4}}>Número da aposta (para quem faz mais de uma)</label>
            <select value={naVal} onChange={e=>setNA(Number(e.target.value))} style={{...S.inp,width:'auto'}}>
              {[1,2,3,4,5].map(n=><option key={n} value={n}>{n===1?'1ª Aposta (padrão)':`${n}ª Aposta`}</option>)}
            </select>
            {naVal>1&&<div style={{fontSize:'0.75em',color:COR.amarelo,marginTop:4}}>Será registrado como: <strong>"{nomeFinal}"</strong></div>}
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:'0.82em',color:'#9ca3af',marginBottom:4}}>Indicado por (membro da família) — apenas para amigos externos</label>
            <Inp value={indicado} onChange={e=>setIndicado(e.target.value)} placeholder="Nome do familiar que te convidou (opcional)" />
          </div>
        </>
      )}
      {modo==='login'&&(
        <div style={{marginBottom:16}}>
          <label style={{display:'block',fontSize:'0.82em',color:'#9ca3af',marginBottom:4}}>PIN de acesso (6 caracteres)</label>
          <Inp value={pinVal} onChange={e=>setPin(e.target.value.toUpperCase())} placeholder="Ex: A7B2C9" style={{letterSpacing:6,fontWeight:700,textTransform:'uppercase',fontSize:'1.1em'}} maxLength={6} />
        </div>
      )}
      {err&&<div style={{background:'rgba(239,68,68,0.15)',border:'1px solid #ef4444',borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:'0.83em',color:'#fca5a5'}}>{err}</div>}
      <Btn onClick={modo==='cadastro'?cadastrar:entrar} disabled={load||(prazo&&modo==='cadastro')} style={{width:'100%',padding:'13px',fontSize:'1.05em'}}>
        {load?'⏳ Aguarde...':modo==='cadastro'?'Cadastrar e Gerar PIN':'Entrar com PIN'}
      </Btn>
      {modo==='cadastro'&&<p style={{fontSize:'0.75em',color:'#6b7280',textAlign:'center',marginTop:10}}>Um PIN único será gerado. Use-o para acessar de qualquer dispositivo.</p>}
    </div>
  );
}

// ================================================================
// FORM PROGNÓSTICOS (72 JOGOS)
// ================================================================
function FormPronosticos({sb,participanteId,initProgs,bloqueado}){
  const[progs,setProgs]=useState(()=>{const o={};JOGOS.forEach(j=>o[j.id]={casa:'',fora:''});Object.assign(o,initProgs??{});return o;});
  const[grupo,setGrupo]=useState('A');
  const[sv,setSaving]=useState(false);
  const[msg,setMsg]=useState('');
  const total=useMemo(()=>JOGOS.filter(j=>progs[j.id]?.casa!==''&&progs[j.id]?.fora!=='').length,[progs]);

  const set=(id,lado,v)=>{const val=v===''?'':String(Math.max(0,Math.min(30,parseInt(v)||0)));setProgs(p=>({...p,[id]:{...p[id],[lado]:val}}));};
  const salvar=async()=>{
    if(total<72){const ok=window.confirm(`${total}/72 preenchidos. Salvar assim mesmo? Pode completar antes do prazo.`);if(!ok)return;}
    setSaving(true);setMsg('');
    try{await sb.patch('participantes',`id=eq.${participanteId}`,{pronosticos:progs,atualizado_em:new Date().toISOString()});setMsg('✅ Prognósticos salvos!');}
    catch(e){const m=e.message.includes('SISTEMA_TRAVADO')?'Sistema travado — prognósticos não podem ser alterados.':'Erro ao salvar: '+e.message;setMsg('❌ '+m);}
    setSaving(false);
  };

  return(
    <div>
      <div style={{...S.card({marginBottom:12,background:'rgba(0,156,59,0.1)',border:`1px solid ${COR.verde}44`})}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:8}}>
          <span style={{fontWeight:700}}>📊 Progresso: <span style={{color:COR.amarelo}}>{total}/72</span> jogos preenchidos</span>
          {bloqueado&&<Tag cor={COR.vermelho}>🔒 ENCERRADO</Tag>}
        </div>
        <div style={{height:10,background:'rgba(255,255,255,0.08)',borderRadius:5,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(total/72)*100}%`,background:`linear-gradient(90deg,${COR.verde},${total===72?COR.amarelo:COR.verde_claro})`,borderRadius:5,transition:'width .3s'}} />
        </div>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:12}}>
        {Object.keys(GRUPOS).map(g=>{
          const pr=JOGOS.filter(j=>j.grupo===g).filter(j=>progs[j.id]?.casa!==''&&progs[j.id]?.fora!=='').length;
          return<button key={g} className="btn" onClick={()=>setGrupo(g===grupo?'':g)} style={{background:grupo===g?COR.verde:'rgba(255,255,255,0.07)',border:`1.5px solid ${pr===6?COR.verde_claro:grupo===g?COR.verde:'rgba(255,255,255,0.1)'}`,borderRadius:8,color:'#fff',padding:'5px 12px',cursor:'pointer',fontWeight:700,fontSize:'0.85em',fontFamily:'Barlow Condensed',position:'relative'}}>
            Grupo {g}<span style={{display:'block',fontSize:'0.62em',color:pr===6?COR.verde_claro:'#9ca3af'}}>{pr}/6 ✓</span>
          </button>;
        })}
      </div>
      {grupo&&(
        <div style={{...S.card({marginBottom:12})}}>
          <h3 style={{margin:'0 0 10px',fontFamily:'Barlow Condensed',color:COR.amarelo,fontSize:'1.1em'}}>
            Grupo {grupo} — {GRUPOS[grupo].map(t=>`${TIMES[t].flag} ${TIMES[t].nome}`).join(' · ')}
          </h3>
          {[1,2,3].map(r=>(
            <div key={r}>
              <div style={{fontSize:'0.72em',color:'#6b7280',padding:'5px 2px 2px',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>▸ Rodada {r}</div>
              {JOGOS.filter(j=>j.grupo===grupo&&j.rodada===r).map(j=>{
                const tc=TIMES[j.casa],tf=TIMES[j.fora],c=progs[j.id]?.casa??'',f=progs[j.id]?.fora??'';
                return(
                  <div key={j.id} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 2px',borderBottom:'1px solid rgba(255,255,255,0.04)',flexWrap:'wrap'}}>
                    <span style={{fontSize:'0.66em',color:'#6b7280',minWidth:36,textAlign:'right'}}>{j.data}</span>
                    <span style={{flex:'1 1 100px',textAlign:'right',display:'flex',alignItems:'center',gap:5,justifyContent:'flex-end'}}>
                      <span style={{fontSize:'0.82em',color:'#e5e7eb'}}>{tc.nome}</span>
                      <Bandeira code={FLAG_CODES[j.casa]} size={14} /><span style={{fontSize:'1.1em'}}>{tc.flag}</span>
                    </span>
                    <input type="number" min="0" max="30" value={c} onChange={e=>set(j.id,'casa',e.target.value)} disabled={bloqueado} style={S.sInp} />
                    <span style={{color:'#6b7280',fontWeight:700}}>×</span>
                    <input type="number" min="0" max="30" value={f} onChange={e=>set(j.id,'fora',e.target.value)} disabled={bloqueado} style={S.sInp} />
                    <span style={{flex:'1 1 100px',display:'flex',alignItems:'center',gap:5}}>
                      <span style={{fontSize:'1.1em'}}>{tf.flag}</span><Bandeira code={FLAG_CODES[j.fora]} size={14} />
                      <span style={{fontSize:'0.82em',color:'#e5e7eb'}}>{tf.nome}</span>
                    </span>
                    {c!==''&&f!==''&&<span style={{color:COR.verde_claro,fontSize:'0.85em'}}>✓</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {msg&&<div style={{background:msg.startsWith('✅')?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',border:`1px solid ${msg.startsWith('✅')?COR.verde_claro:COR.vermelho}`,borderRadius:10,padding:'10px 16px',marginBottom:12,fontSize:'0.88em'}}>{msg}</div>}
      {!bloqueado&&<Btn onClick={salvar} disabled={sv} style={{width:'100%',padding:'13px',fontSize:'1.05em'}}>{sv?'⏳ Salvando...':'💾 Salvar Prognósticos'}</Btn>}
    </div>
  );
}

// ================================================================
// TELA: CLASSIFICAÇÃO
// ================================================================
function TelaClassificacao({participantes,resultados,sessaoId,totalArrecadado}){
  const res=JOGOS.filter(j=>resultados[j.id]!=null).length;
  const ranking=useMemo(()=>participantes.filter(p=>p.pago).map(p=>({...p,pts:calcTotal(p.pronosticos,resultados)})).sort((a,b)=>b.pts-a.pts),[participantes,resultados]);
  const medals=['🥇','🥈','🥉'];
  return(
    <div style={{maxWidth:740,margin:'0 auto'}}>
      <div style={{...S.card({marginBottom:16,background:`linear-gradient(135deg,rgba(0,39,118,0.5),rgba(0,156,59,0.3))`,border:`2px solid ${COR.amarelo}44`})}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
          <div>
            <h2 style={{margin:0,fontFamily:'Barlow Condensed',fontSize:'1.5em'}}>🏆 Classificação Geral</h2>
            <div style={{fontSize:'0.82em',color:'#9ca3af',marginTop:2}}>{res}/72 resultados · {ranking.length} apostadores</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'0.75em',color:'#9ca3af'}}>💰 Total arrecadado</div>
            <div style={{fontSize:'1.6em',fontWeight:900,fontFamily:'Barlow Condensed',color:COR.amarelo}}>R$ {totalArrecadado.toLocaleString('pt-BR',{minimumFractionDigits:2})}</div>
            <div style={{fontSize:'0.72em',color:COR.verde_claro}}>Prêmio ao(s) vencedor(es)</div>
          </div>
        </div>
      </div>
      {ranking.length===0&&<div style={{...S.card({textAlign:'center',color:'#9ca3af'})}}>
        <p>Nenhum apostador confirmado ainda.</p><p style={{fontSize:'0.85em'}}>A classificação aparecerá conforme os resultados forem lançados.</p>
      </div>}
      {ranking.map((p,i)=>(
        <div key={p.id} className="card-h" style={{...S.card({marginBottom:10,border:p.id===sessaoId?`2px solid ${COR.amarelo}`:`1px solid rgba(255,255,255,0.09)`,background:i===0?'rgba(255,215,0,0.07)':i===1?'rgba(192,192,192,0.05)':i===2?'rgba(205,127,50,0.04)':'rgba(255,255,255,0.03)'})}}>
          <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
            <span style={{fontSize:'1.5em',minWidth:36,textAlign:'center'}}>{medals[i]??`#${i+1}`}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:'1em'}}>{p.nome}{p.id===sessaoId&&<span style={{color:COR.amarelo,fontSize:'0.8em',marginLeft:6}}>(você)</span>}</div>
              {p.numero_registro&&<div style={{fontSize:'0.72em',color:'#9ca3af'}}>Reg. #{String(p.numero_registro).padStart(3,'0')}</div>}
              {p.indicado_por&&<div style={{fontSize:'0.72em',color:'#6b7280'}}>👤 Indicado por: {p.indicado_por}</div>}
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'2em',fontWeight:900,fontFamily:'Barlow Condensed',color:COR.amarelo,lineHeight:1}}>{p.pts}</div>
              <div style={{fontSize:'0.68em',color:'#9ca3af'}}>pontos</div>
            </div>
          </div>
          <div style={{marginTop:10,display:'flex',gap:2}}>
            {JOGOS.map(j=>{
              const prog=p.pronosticos?.[j.id],res=resultados?.[j.id];
              if(!prog||!res){return<div key={j.id} style={{flex:1,height:5,background:'rgba(255,255,255,0.06)',borderRadius:2}}/>;}
              const pts=calcPontos(prog,res);
              const c=pts===5||pts===4?COR.verde_claro:pts===3?'#84cc16':pts===2||pts===1?'#f97316':pts===0?COR.vermelho:'#374151';
              return<div key={j.id} style={{flex:1,height:5,background:c,borderRadius:2}} title={`G${j.grupo} R${j.rodada}: ${prog.casa}×${prog.fora} → ${pts}pts`}/>;
            })}
          </div>
          <div style={{fontSize:'0.66em',color:'#4b5563',marginTop:2}}>↑ 72 jogos · 🟢 acerto · 🟡🟠 parcial · 🔴 erro</div>
        </div>
      ))}
    </div>
  );
}

// ================================================================
// TELA: TODOS OS PROGNÓSTICOS
// ================================================================
function TelaTodos({participantes,resultados}){
  const[grupo,setGrupo]=useState('A');
  const pagos=participantes.filter(p=>p.pago);
  if(!prazoPassou()) return(
    <div style={{...S.card({maxWidth:500,margin:'40px auto',textAlign:'center'})}}>
      <div style={{fontSize:'2.5em',marginBottom:8}}>🔒</div>
      <h3 style={{fontFamily:'Barlow Condensed',color:COR.amarelo}}>Prognósticos Bloqueados</h3>
      <p style={{color:'#9ca3af',fontSize:'0.88em'}}>Para garantir total transparência e evitar cópias, os prognósticos de todos ficam visíveis somente após o encerramento das apostas (10/06 às 23h59).</p>
      <p style={{color:COR.amarelo}}>Prazo: <Countdown /></p>
    </div>
  );
  return(
    <div style={{maxWidth:960,margin:'0 auto'}}>
      <div style={{...S.card({marginBottom:14})}}>
        <h2 style={{margin:'0 0 4px',fontFamily:'Barlow Condensed',fontSize:'1.45em'}}>📊 Todos os Prognósticos</h2>
        <p style={{margin:0,fontSize:'0.82em',color:'#9ca3af'}}>{pagos.length} participantes confirmados · Visível após encerramento das apostas</p>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
        {Object.keys(GRUPOS).map(g=><button key={g} className="btn" onClick={()=>setGrupo(g)} style={{background:grupo===g?COR.azul:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',padding:'5px 13px',cursor:'pointer',fontWeight:700,fontSize:'0.85em'}}>Grupo {g}</button>)}
      </div>
      {JOGOS.filter(j=>j.grupo===grupo).map(jogo=>{
        const tc=TIMES[jogo.casa],tf=TIMES[jogo.fora],res=resultados[jogo.id];
        return(
          <div key={jogo.id} style={{...S.card({marginBottom:12})}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10,flexWrap:'wrap',gap:8}}>
              <span style={{fontWeight:700,fontSize:'0.95em'}}>
                <Bandeira code={FLAG_CODES[jogo.casa]} size={14}/> {tc.flag} {tc.nome} × {tf.nome} {tf.flag} <Bandeira code={FLAG_CODES[jogo.fora]} size={14}/>
                <span style={{fontSize:'0.72em',color:'#6b7280',marginLeft:8}}>· R{jogo.rodada} · {jogo.data}</span>
              </span>
              {res&&<Tag cor={COR.verde}>Resultado: {res.casa}×{res.fora}</Tag>}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {pagos.map(p=>{
                const prog=p.pronosticos?.[jogo.id],pts=prog&&res?calcPontos(prog,res):null;
                const c=pts===5||pts===4?COR.verde_claro:pts===3?'#84cc16':pts===2||pts===1?'#f97316':pts===0?COR.vermelho:'rgba(255,255,255,0.07)';
                return(
                  <div key={p.id} style={{background:'rgba(0,0,0,0.3)',border:`1.5px solid ${c}`,borderRadius:9,padding:'6px 11px',textAlign:'center',minWidth:80}}>
                    <div style={{fontSize:'0.68em',color:'#9ca3af',marginBottom:2,maxWidth:75,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.nome.split(' ')[0]}</div>
                    {prog?.casa!==''?<div style={{fontWeight:700,fontFamily:'monospace',fontSize:'1em'}}>{prog.casa}×{prog.fora}</div>:<div style={{color:'#4b5563'}}>–</div>}
                    {pts!=null&&<div style={{fontSize:'0.7em',color:c,fontWeight:700}}>{pts}pts</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ================================================================
// TELA: SELEÇÕES / PAÍSES
// ================================================================
function TelaPaises(){
  const[busca,setBusca]=useState('');
  const[grV,setGrupo]=useState('Todos');
  const[sel,setSel]=useState(null);
  const todos=Object.entries(TIMES);
  const filtrados=todos.filter(([k,t])=>{
    const matchB=t.nome.toLowerCase().includes(busca.toLowerCase());
    const matchG=grV==='Todos'||Object.entries(GRUPOS).find(([g,ts])=>g===grV&&ts.includes(k));
    return matchB&&matchG;
  });

  return(
    <div style={{maxWidth:980,margin:'0 auto'}}>
      <div style={{...S.card({marginBottom:16,background:`linear-gradient(135deg,rgba(0,39,118,0.5),rgba(0,156,59,0.3))`,border:`2px solid ${COR.amarelo}44`})}}>
        <h2 style={{margin:'0 0 4px',fontFamily:'Barlow Condensed',fontSize:'1.45em'}}>🌍 Seleções da Copa 2026</h2>
        <p style={{margin:'0 0 12px',fontSize:'0.82em',color:'#9ca3af'}}>Fonte: FIFA.com · CIA World Factbook · WorldBank (dados aproximados, 2024)</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar país..." style={{...S.inp,maxWidth:220}} />
          <select value={grV} onChange={e=>setGrupo(e.target.value)} style={{...S.inp,width:'auto'}}>
            <option>Todos</option>
            {Object.keys(GRUPOS).map(g=><option key={g} value={g}>Grupo {g}</option>)}
          </select>
        </div>
      </div>

      {sel&&(()=>{
        const info=PAISES_INFO[sel],t=TIMES[sel];
        return(
          <div className="fade" style={{...S.card({marginBottom:16,border:`2px solid ${COR.amarelo}66`,background:'rgba(0,39,118,0.3)'})}}>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16,flexWrap:'wrap'}}>
              <Bandeira code={FLAG_CODES[sel]} size={48} />
              <span style={{fontSize:'3.5em'}}>{t.flag}</span>
              <div>
                <h3 style={{margin:0,fontFamily:'Barlow Condensed',fontSize:'1.6em',color:COR.amarelo}}>{t.nome}</h3>
                <div style={{fontSize:'0.82em',color:'#9ca3af'}}>{info?.oficial}</div>
              </div>
              <Btn onClick={()=>setSel(null)} cor='#374151' style={{marginLeft:'auto',padding:'6px 12px',fontSize:'0.85em'}}>✕ Fechar</Btn>
            </div>
            {info&&(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
                {[['🏛️','Capital',info.capital],['🌎','Região',info.regiao],['👥','População',info.pop],
                  ['⚽','Copas (incluindo 2026)',info.copas],['🏆','Títulos',info.titulos||'Nenhum'],
                  ['🥇','Melhor resultado',info.melhor],
                ].map(([ic,label,val])=>(
                  <div key={label} style={{background:'rgba(0,0,0,0.25)',borderRadius:8,padding:'10px 14px'}}>
                    <div style={{fontSize:'0.72em',color:'#9ca3af'}}>{ic} {label}</div>
                    <div style={{fontWeight:700,fontSize:'0.95em',color:label==='Títulos'&&info.titulos>0?COR.amarelo:'#f3f4f6',marginTop:2}}>{val}</div>
                  </div>
                ))}
                <div style={{background:'rgba(0,0,0,0.25)',borderRadius:8,padding:'10px 14px',gridColumn:'1 / -1'}}>
                  <div style={{fontSize:'0.72em',color:'#9ca3af'}}>💡 Curiosidade</div>
                  <div style={{fontSize:'0.9em',color:'#d1d5db',marginTop:4,lineHeight:1.6}}>{info.curiosidade}</div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10}}>
        {filtrados.map(([k,t])=>{
          const info=PAISES_INFO[k];
          const grp=Object.entries(GRUPOS).find(([,ts])=>ts.includes(k));
          return(
            <div key={k} className="card-h" onClick={()=>setSel(k===sel?null:k)} style={{...S.card({cursor:'pointer',border:sel===k?`2px solid ${COR.amarelo}`:undefined,background:sel===k?'rgba(255,215,0,0.1)':'rgba(0,0,0,0.3)'})}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <Bandeira code={FLAG_CODES[k]} size={22} />
                <span style={{fontSize:'1.5em'}}>{t.flag}</span>
                {grp&&<Tag cor={COR.azul} style={{fontSize:'0.65em'}}>Gr.{grp[0]}</Tag>}
              </div>
              <div style={{fontWeight:700,fontSize:'0.88em',color:'#f3f4f6',marginBottom:2}}>{t.nome}</div>
              {info&&<>
                <div style={{fontSize:'0.7em',color:'#9ca3af'}}>{info.capital} · {info.pop}</div>
                <div style={{fontSize:'0.7em',marginTop:4}}>
                  {info.titulos>0?<Tag cor={COR.amarelo}>🏆 {info.titulos}× Campeã</Tag>:<span style={{color:'#6b7280'}}>⚽ {info.copas} Copas</span>}
                </div>
              </>}
            </div>
          );
        })}
      </div>
      <p style={{textAlign:'center',fontSize:'0.72em',color:'#4b5563',marginTop:16}}>
        Fonte: FIFA.com · CIA World Factbook · World Bank · dados aproximados de 2024.
      </p>
    </div>
  );
}


// ================================================================
// COMPONENTE: ResultRow (separado para respeitar Rules of Hooks)
// ================================================================
function ResultRow({jogo,resL,savId,onSalvar}){
  const tc=TIMES[jogo.casa],tf=TIMES[jogo.fora];
  const r=resL[jogo.id]??{casa:'',fora:''};
  const[c,setC]=useState(String(r.casa??''));
  const[f,setF]=useState(String(r.fora??''));
  useEffect(()=>{setC(String(r.casa??''));setF(String(r.fora??''));},[resL]);
  const temRes=r.casa!==''&&r.casa!=null;
  return(
    <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 2px',borderBottom:'1px solid rgba(255,255,255,0.05)',flexWrap:'wrap'}}>
      <span style={{fontSize:'0.66em',color:'#6b7280',minWidth:36,textAlign:'right'}}>{jogo.data}</span>
      <span style={{flex:'1 1 100px',textAlign:'right',fontSize:'0.82em',display:'flex',alignItems:'center',gap:4,justifyContent:'flex-end'}}>
        <Bandeira code={FLAG_CODES[jogo.casa]} size={13}/>{tc.flag} {tc.nome}
      </span>
      <input type="number" min="0" max="30" value={c} onChange={e=>setC(e.target.value)} style={{...S.sInp,border:'2px solid rgba(239,68,68,0.4)'}} />
      <span style={{color:'#6b7280',fontWeight:700}}>×</span>
      <input type="number" min="0" max="30" value={f} onChange={e=>setF(e.target.value)} style={{...S.sInp,border:'2px solid rgba(239,68,68,0.4)'}} />
      <span style={{flex:'1 1 100px',fontSize:'0.82em',display:'flex',alignItems:'center',gap:4}}>
        {tf.flag}<Bandeira code={FLAG_CODES[jogo.fora]} size={13}/> {tf.nome}
      </span>
      <Btn onClick={()=>onSalvar(jogo.id,c,f)} disabled={savId===jogo.id||c===''||f===''} cor={COR.verde} style={{fontSize:'0.76em',padding:'5px 11px'}}>
        {savId===jogo.id?'...':temRes?'🔄':'💾'}
      </Btn>
      {temRes&&<Tag cor={COR.verde_claro}>✓ {r.casa}×{r.fora}</Tag>}
    </div>
  );
}

// ================================================================
// TELA: ADMIN
// ================================================================
function TelaAdmin({sb,participantes,resultados,onRefresh,travado}){
  const[auth,setAuth]=useState(false);
  const[senhaIn,setSI]=useState('');
  const[errS,setErrS]=useState('');
  const[grV,setGrp]=useState('A');
  const[resL,setResL]=useState({...resultados});
  const[savId,setSavId]=useState('');
  const[novaSenha,setNS]=useState('');
  const[pixCV,setPIXC]=useState('326.986.235-00');
  const[pixT,setPIXT]=useState('CPF');
  const[pixTitVal,setPIXTIT]=useState('Reginaldo Ferreira da Silva Filho');
  const[pixBanco,setPIXB]=useState('Santander');
  const[msg,setMsg]=useState('');

  useEffect(()=>{setResL({...resultados});},[resultados]);

  const verificar=async()=>{
    try{const r=await sb.get('configuracoes','chave=eq.admin_hash&select=valor');const hash=r?.[0]?.valor??djb2(SENHA_ADMIN_PADRAO);if(djb2(senhaIn)===hash){setAuth(true);}else setErrS('❌ Senha incorreta.');}
    catch(e){setErrS('Erro: '+e.message);}
  };

  const salvarRes=async(jid,c,f)=>{if(c===''||f==='')return;setSavId(jid);try{await sb.upsert('resultados',{jogo_id:jid,casa:parseInt(c),fora:parseInt(f)});setResL(r=>({...r,[jid]:{casa:parseInt(c),fora:parseInt(f)}}));await onRefresh();}catch(e){alert('Erro: '+e.message);}setSavId('');};
  const togglePago=async p=>{try{await sb.patch('participantes',`id=eq.${p.id}`,{pago:!p.pago});await onRefresh();}catch(e){alert('Erro: '+e.message);}};
  const toggleTravado=async()=>{try{const nv=travado?'false':'true';await sb.upsert('configuracoes',{chave:'sistema_travado',valor:nv});await onRefresh();setMsg(nv==='true'?'🔒 Sistema TRAVADO! Apostas encerradas.':'🔓 Sistema DESBLOQUEADO.');}catch(e){setMsg('Erro: '+e.message);}};
  const salvarSenha=async()=>{if(!novaSenha)return;try{await sb.upsert('configuracoes',{chave:'admin_hash',valor:djb2(novaSenha)});setMsg('✅ Senha alterada!');setNS('');}catch(e){setMsg('Erro: '+e.message);}};
  const salvarPix=async()=>{
    try{
      await Promise.all([
        sb.upsert('configuracoes',{chave:'pix_chave',valor:pixCV}),
        sb.upsert('configuracoes',{chave:'pix_tipo',valor:pixT}),
        sb.upsert('configuracoes',{chave:'pix_titular',valor:pixTit[0]}),
        sb.upsert('configuracoes',{chave:'pix_banco',valor:pixBanco}),
      ]);
      setMsg('✅ PIX configurado!');await onRefresh();
    }catch(e){setMsg('Erro PIX: '+e.message);}
  };

  const pagos=participantes.filter(p=>p.pago);
  const nao=participantes.filter(p=>!p.pago);
  const totalArrecadado=pagos.length*VALOR_APOSTA;

  if(!auth) return(
    <div style={{...S.card({maxWidth:400,margin:'40px auto',textAlign:'center',border:`2px solid ${COR.vermelho}44`})}}>
      <div style={{fontSize:'2.5em',marginBottom:10}}>🔐</div>
      <h3 style={{fontFamily:'Barlow Condensed',margin:'0 0 16px',color:COR.amarelo}}>Painel Administrativo</h3>
      <Inp value={senhaIn} onChange={e=>setSI(e.target.value)} type="password" placeholder={`Senha (padrão: ${SENHA_ADMIN_PADRAO})`} style={{marginBottom:12}} />
      {errS&&<div style={{color:COR.vermelho,fontSize:'0.85em',marginBottom:10}}>{errS}</div>}
      <Btn onClick={verificar} cor={COR.azul} style={{width:'100%',padding:'12px'}}>Entrar</Btn>
      <p style={{fontSize:'0.72em',color:'#6b7280',marginTop:12}}>Senha padrão: <code style={{color:COR.amarelo}}>{SENHA_ADMIN_PADRAO}</code></p>
    </div>
  );

  return(
    <div style={{maxWidth:940,margin:'0 auto',display:'flex',flexDirection:'column',gap:16}}>
      {/* Status */}
      <div style={{...S.card({background:travado?'rgba(239,68,68,0.12)':'rgba(0,156,59,0.12)',border:`2px solid ${travado?COR.vermelho:COR.verde}44`})}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div>
            <h2 style={{margin:'0 0 4px',fontFamily:'Barlow Condensed',color:COR.amarelo,fontSize:'1.4em'}}>🔐 Painel Admin · {NOME_BOLAO}</h2>
            <p style={{margin:0,fontSize:'0.83em',color:'#9ca3af'}}>💰 <strong>{pagos.length}</strong> confirmados · R$ {totalArrecadado.toLocaleString('pt-BR',{minimumFractionDigits:2})} arrecadados · {nao.length} pendentes</p>
          </div>
          <Btn onClick={toggleTravado} cor={travado?COR.verde:COR.vermelho} style={{fontSize:'0.9em'}}>
            {travado?'🔓 Desbloquear Sistema':'🔒 TRAVAR Sistema (encerrar apostas)'}
          </Btn>
        </div>
        {travado&&<div style={{marginTop:10,fontSize:'0.82em',color:COR.vermelho,fontWeight:700}}>⚠️ Sistema TRAVADO: nenhuma aposta ou alteração de prognóstico é possível. O banco de dados está protegido por trigger.</div>}
        {msg&&<div style={{marginTop:10,fontSize:'0.88em',color:msg.startsWith('✅')?COR.verde_claro:COR.vermelho}}>{msg}</div>}
      </div>

      {/* Participantes confirmados */}
      <div style={S.card()}>
        <h3 style={{margin:'0 0 14px',fontFamily:'Barlow Condensed',color:COR.amarelo}}>✅ Apostadores Confirmados ({pagos.length})</h3>
        {pagos.length===0&&<p style={{color:'#6b7280'}}>Nenhum confirmado ainda.</p>}
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {pagos.sort((a,b)=>(a.numero_registro??999)-(b.numero_registro??999)).map(p=>(
            <div key={p.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',background:'rgba(0,0,0,0.2)',borderRadius:9,flexWrap:'wrap',border:`1px solid ${COR.verde}33`}}>
              <Tag cor={COR.azul}>#{String(p.numero_registro).padStart(3,'0')}</Tag>
              <div style={{flex:1}}>
                <span style={{fontWeight:700}}>{p.nome}</span>
                {p.indicado_por&&<span style={{fontSize:'0.75em',color:'#9ca3af',marginLeft:8}}>👤 {p.indicado_por}</span>}
                <div style={{fontSize:'0.72em',color:'#6b7280'}}>📱 {p.telefone} · {Object.values(p.pronosticos??{}).filter(x=>x.casa!=='').length}/72 prog.</div>
              </div>
              <Btn onClick={()=>togglePago(p)} cor='#374151' style={{fontSize:'0.78em',padding:'5px 12px'}}>Desconfirmar</Btn>
            </div>
          ))}
        </div>
      </div>

      {/* Apostas pendentes */}
      <div style={S.card()}>
        <h3 style={{margin:'0 0 14px',fontFamily:'Barlow Condensed',color:'#f97316'}}>⏳ Apostas Pendentes / Não Confirmadas ({nao.length})</h3>
        <p style={{fontSize:'0.82em',color:'#9ca3af',margin:'0 0 12px'}}>Essas apostas NÃO aparecem na classificação e NÃO têm número de registro.</p>
        {nao.length===0&&<p style={{color:'#6b7280'}}>Nenhuma pendente.</p>}
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {nao.map(p=>(
            <div key={p.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',background:'rgba(249,115,22,0.07)',borderRadius:9,flexWrap:'wrap',border:'1px solid rgba(249,115,22,0.2)'}}>
              <div style={{flex:1}}>
                <span style={{fontWeight:700}}>{p.nome}</span>
                {p.indicado_por&&<span style={{fontSize:'0.75em',color:'#9ca3af',marginLeft:8}}>👤 {p.indicado_por}</span>}
                <div style={{fontSize:'0.72em',color:'#6b7280'}}>📱 {p.telefone} · Cadastrado em {new Date(p.criado_em).toLocaleDateString('pt-BR')}</div>
              </div>
              <Btn onClick={()=>togglePago(p)} cor={COR.verde} style={{fontSize:'0.78em',padding:'5px 12px'}}>✅ Confirmar Pagamento</Btn>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div style={S.card()}>
        <h3 style={{margin:'0 0 12px',fontFamily:'Barlow Condensed',color:COR.amarelo}}>⚽ Lançar Resultados Oficiais</h3>
        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
          {Object.keys(GRUPOS).map(g=><button key={g} className="btn" onClick={()=>setGrp(g)} style={{background:grV===g?COR.verde:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',padding:'5px 12px',cursor:'pointer',fontWeight:700,fontSize:'0.85em'}}>Grupo {g}</button>)}
        </div>
        {JOGOS.filter(j=>j.grupo===grV).map(j=>(
          <ResultRow key={j.id} jogo={j} resL={resL} savId={savId} onSalvar={salvarRes} />
        ))}
      </div>

      {/* Config PIX */}
      <div style={S.card()}>
        <h3 style={{margin:'0 0 12px',fontFamily:'Barlow Condensed',color:COR.amarelo}}>💳 Configurar PIX</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10,marginBottom:14}}>
          <div><label style={{fontSize:'0.8em',color:'#9ca3af',display:'block',marginBottom:4}}>Tipo de Chave</label>
            <select value={pixT} onChange={e=>setPIXT(e.target.value)} style={{...S.inp,width:'100%'}}>
              {['CPF','CNPJ','Telefone','E-mail','Chave aleatória'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={{fontSize:'0.8em',color:'#9ca3af',display:'block',marginBottom:4}}>Chave PIX</label><Inp value={pixCV} onChange={e=>setPIXC(e.target.value)} placeholder="000.000.000-00" /></div>
          <div><label style={{fontSize:'0.8em',color:'#9ca3af',display:'block',marginBottom:4}}>Nome do Titular</label><Inp value={pixTitVal} onChange={e=>setPIXTIT(e.target.value)} placeholder="Nome completo" /></div>
          <div><label style={{fontSize:'0.8em',color:'#9ca3af',display:'block',marginBottom:4}}>Banco (opcional)</label><Inp value={pixBanco} onChange={e=>setPIXB(e.target.value)} placeholder="Ex: Nubank, Bradesco..." /></div>
        </div>
        <Btn onClick={salvarPix} cor={COR.azul}>💾 Salvar Configuração PIX</Btn>
      </div>

      {/* Alterar senha */}
      <div style={S.card()}>
        <h3 style={{margin:'0 0 12px',fontFamily:'Barlow Condensed',color:COR.amarelo}}>🔑 Alterar Senha Admin</h3>
        <div style={{display:'flex',gap:10}}>
          <Inp value={novaSenha} onChange={e=>setNS(e.target.value)} placeholder="Nova senha..." type="password" />
          <Btn onClick={salvarSenha} cor={COR.azul}>Salvar</Btn>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// APP PRINCIPAL
// ================================================================
export default function App(){
  // ── Credenciais fixas — conecta automaticamente, sem tela de config ──
  const SB_URL = 'https://jocgtlcmnjearfzjomib.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvY2d0bGNtbmplYXJmempvbWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjU3ODYsImV4cCI6MjA5NDQ0MTc4Nn0.4KX3bgzQPxwXUAABoDxUNEqDCnmibMharQtyc5nFcW0';
  const[sbCfg,setSbCfg]=useState({url:SB_URL,key:SB_KEY});
  const[sbV,setSb]=useState(null);
  const[sessao,setSessao]=useState(null);
  const[telaV,setTela]=useState('inicio');
  const[modoAcesso,setMA]=useState('cadastro');
  const[parts,setParts]=useState([]);
  const[resV,setRes]=useState({});
  const[pixInfo,setPixInfo]=useState({chave:'326.986.235-00',tipo:'CPF',titular:'Reginaldo Ferreira da Silva Filho',banco:'Santander'});
  const[travV,setTravado]=useState(false);
  const[loading,setLoading]=useState(true);
  const[atualizado,setAt]=useState(null);

  useEffect(()=>{(async()=>{
    // Credenciais fixas — conecta direto sem pedir ao usuário
    const url='https://jocgtlcmnjearfzjomib.supabase.co';
    const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvY2d0bGNtbmplYXJmempvbWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjU3ODYsImV4cCI6MjA5NDQ0MTc4Nn0.4KX3bgzQPxwXUAABoDxUNEqDCnmibMharQtyc5nFcW0';
    setSbCfg({url,key});
    setSb(createSB(url,key));
    const sess=await Sess.get('bolao:sessao');if(sess)setSessao(sess);
    setLoading(false);
  })();},[]);

  const loadData=useCallback(async()=>{
    if(!sbV) return;
    try{
      const[ps,rs,cfg]=await Promise.all([
        sbV.get('participantes','select=*&order=nome.asc'),
        sbV.get('resultados','select=*'),
        sbV.get('configuracoes','select=*'),
      ]);
      if(ps)setParts(ps);
      if(rs){const o={};rs.forEach(r=>o[r.jogo_id]=r);setRes(o);}
      if(cfg){
        const pix={chave:'',tipo:'CPF',titular:'',banco:''};
        cfg.forEach(c=>{
          if(c.chave==='pix_chave')pix.chave=c.valor;
          if(c.chave==='pix_tipo')pix.tipo=c.valor;
          if(c.chave==='pix_titular')pix.titular=c.valor;
          if(c.chave==='pix_banco')pix.banco=c.valor;
          if(c.chave==='sistema_travado')setTravado(c.valor==='true');
        });
        setPixInfo(pix);
      }
      setAt(new Date());
    }catch(e){console.error(e);}
  },[sbV]);

  useEffect(()=>{if(sbV)loadData();},[sbV,loadData]);
  useEffect(()=>{if(!sbV)return;const i=setInterval(loadData,60000);return()=>clearInterval(i);},[sbV,loadData]);

  const handleSbConfig=async(url,key)=>{await Sess.set('bolao:sbcfg',{url,key});const c=createSB(url,key);setSbCfg({url,key});setSb(c);};
  const handleLogin=async(id,nome)=>{
    if(id){setSessao({id,nome});}else{const s=await Sess.get('bolao:sessao');if(s)setSessao(s);}
    await loadData();setTela('meus');
  };
  const handleSair=async()=>{await Sess.del('bolao:sessao');setSessao(null);setTela('inicio');};

  const pagos=parts.filter(p=>p.pago);
  const totalArrecadado=pagos.length*VALOR_APOSTA;
  const meuPart=sessao?parts.find(p=>p.id===sessao.id):null;

  if(loading) return(
    <div style={{minHeight:'100vh',background:`linear-gradient(135deg,#002776,#009c3b)`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Barlow,sans-serif',color:'#f3f4f6'}}>
      <style>{CSS_GLOBAL}</style>
      <div style={{textAlign:'center'}}><div style={{fontSize:'4em',marginBottom:12}}>⚽</div><div className="pulse" style={{fontSize:'1.1em',color:COR.amarelo}}>Carregando bolão...</div></div>
    </div>
  );

  // Tela de configuração removida — credenciais fixas no código

  return(
    <div style={{minHeight:'100vh',background:`linear-gradient(160deg,#000d22 0%,#003015 40%,#001a08 70%,#000d22 100%)`,color:'#f3f4f6',fontFamily:'Barlow,sans-serif'}}>
      <style>{CSS_GLOBAL}</style>
      {/* Decoração */}
      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundImage:`radial-gradient(circle at 20% 20%,rgba(0,39,118,0.3) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(0,156,59,0.2) 0%,transparent 50%)`,pointerEvents:'none',zIndex:0}} />
      <div style={{position:'relative',zIndex:1}}>
        <Header tela={telaV} setTela={setTela} sessao={sessao} onSair={handleSair} travado={travV} />
        {/* Status bar */}
        {atualizado&&(
          <div style={{background:'rgba(0,0,0,0.5)',textAlign:'center',padding:'2px 0',fontSize:'0.7em',color:'#4b5563',borderBottom:`1px solid rgba(255,223,0,0.08)`}}>
            🕐 Atualizado: {atualizado.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
            · 👥 {pagos.length} confirmados · 💰 R$ {totalArrecadado.toLocaleString('pt-BR',{minimumFractionDigits:2})}
            · ⚽ {JOGOS.filter(j=>resV[j.id]!=null).length}/72 resultados
            <button className="btn" onClick={loadData} style={{background:'transparent',border:'none',color:'#9ca3af',cursor:'pointer',fontSize:'0.9em',marginLeft:6}}>🔄</button>
          </div>
        )}
        <div style={{padding:'22px 14px',maxWidth:1000,margin:'0 auto'}}>
          {telaV==='inicio'&&<TelaInicio onCadastrar={()=>{setMA('cadastro');setTela('acesso');}} onLogin={()=>{setMA('login');setTela('acesso');}} sessao={sessao} participantes={parts} pixInfo={pixInfo} />}
          {telaV==='acesso'&&<TelaAcesso modo={modoAcesso} sb={sbV} onSucesso={handleLogin} onVoltar={()=>setTela('inicio')} travado={travV} />}
          {telaV==='meus'&&sessao&&(
            <div style={{maxWidth:860,margin:'0 auto'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
                <Btn onClick={()=>setTela('inicio')} cor='#374151' style={{padding:'6px 12px',fontSize:'0.85em'}}>← Voltar</Btn>
                <h2 style={{margin:0,fontFamily:'Barlow Condensed',fontSize:'1.4em'}}>📋 Meus Prognósticos — {sessao.nome}</h2>
                {meuPart?.pago?<Tag cor={COR.verde}>✅ Confirmado · Reg. #{String(meuPart.numero_registro).padStart(3,'0')}</Tag>:<Tag cor={COR.laranja}>⏳ Aguardando confirmação de pagamento</Tag>}
              </div>
              {!meuPart?.pago&&<div style={{...S.card({marginBottom:14,background:'rgba(249,115,22,0.1)',border:'1px solid rgba(249,115,22,0.3)'})}}>
                <p style={{margin:0,fontSize:'0.88em',color:'#fed7aa'}}>⚠️ Realize o PIX de <strong>R$ {VALOR_APOSTA},00</strong> e aguarde a confirmação do administrador para que sua aposta seja validada. Seus prognósticos já estão salvos.</p>
              </div>}
              <FormPronosticos sb={sbV} participanteId={sessao.id} initProgs={meuPart?.pronosticos??{}} bloqueado={prazoPassou()||travV} />
            </div>
          )}
          {telaV==='classificacao'&&<TelaClassificacao participantes={parts} resultados={resV} sessaoId={sessao?.id} totalArrecadado={totalArrecadado} />}
          {telaV==='todos'&&<TelaTodos participantes={parts} resultados={resV} />}
          {telaV==='paises'&&<TelaPaises />}
          {telaV==='admin'&&<TelaAdmin sb={sbV} participantes={parts} resultados={resV} onRefresh={loadData} travado={travV} />}
        </div>
        <div style={{textAlign:'center',padding:'14px',color:'#374151',fontSize:'0.7em',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          {NOME_BOLAO} · Copa do Mundo FIFA 2026 · Apenas 90min + acréscimos · Resultados oficiais FIFA · Caráter recreativo familiar
        </div>
      </div>
    </div>
  );
}
