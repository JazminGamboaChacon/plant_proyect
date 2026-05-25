export function summarizeSunlight(raw: string): string {
  if (!raw || raw === 'No disponible') return 'No disponible';
  const l = raw.toLowerCase();
  if (l.includes('full sun') || l.includes('direct') || l.includes('pleno')) return 'Pleno sol';
  if (l.includes('partial') || l.includes('indirect') || l.includes('indirect') || l.includes('parcial')) return 'Indirecta';
  if (l.includes('shade') || l.includes('low light') || l.includes('sombra')) return 'Sombra';
  if (l.includes('bright')) return 'Luz brillante';
  return raw.split(/[,.\-;]/)[0].trim().substring(0, 18) || raw;
}

export function summarizeSoil(raw: string): string {
  if (!raw || raw === 'No disponible') return 'No disponible';
  const l = raw.toLowerCase();
  if (l.includes('drain') || l.includes('sandy') || l.includes('arenoso') || l.includes('drenante')) return 'Drenante';
  if (l.includes('moist') || l.includes('humid') || l.includes('húmedo') || l.includes('humedo')) return 'Húmedo';
  if (l.includes('clay') || l.includes('arcillo')) return 'Arcilloso';
  if (l.includes('loam') || l.includes('franco')) return 'Franco';
  if (l.includes('peat') || l.includes('turbo')) return 'Turboso';
  if (l.includes('rich') || l.includes('fértil') || l.includes('fertil')) return 'Fértil';
  return raw.split(/[,.\-;]/)[0].trim().substring(0, 18) || raw;
}

export function summarizeWatering(raw: string): string {
  if (!raw || raw === 'No disponible') return 'No disponible';
  const l = raw.toLowerCase();
  if (l.includes('frequent') || l.includes('often') || l.includes('daily') || l.includes('frecuente')) return 'Frecuente';
  if (l.includes('moderate') || l.includes('regular') || l.includes('weekly') || l.includes('moderado')) return 'Moderado';
  if (l.includes('infreq') || l.includes('sparse') || l.includes('little') || l.includes('dry') || l.includes('escaso') || l.includes('poco')) return 'Escaso';
  // "X–Y veces por semana" format from formatWatering()
  if (l.includes('veces')) return raw.substring(0, 20);
  return raw.split(/[,.\-;]/)[0].trim().substring(0, 18) || raw;
}
