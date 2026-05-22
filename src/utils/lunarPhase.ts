export interface LunarDay {
  name: string;
  icon: string;
  recommendation: string;
}

export function getLunarPhase(date = new Date()): LunarDay {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const cycle = 29.53059;
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / 86_400_000;
  const phase = ((daysSince % cycle) + cycle) % cycle;

  if (phase < 1.85)  return { name: 'Luna Nueva',       icon: '🌑', recommendation: 'Prepara el suelo y planifica siembras' };
  if (phase < 7.38)  return { name: 'Luna Creciente',   icon: '🌒', recommendation: 'Ideal para sembrar y trasplantar' };
  if (phase < 14.77) return { name: 'Cuarto Creciente', icon: '🌓', recommendation: 'Estimula el crecimiento con abono' };
  if (phase < 16.61) return { name: 'Luna Llena',        icon: '🌕', recommendation: 'Buen día para regar abundantemente' };
  if (phase < 22.15) return { name: 'Luna Menguante',   icon: '🌖', recommendation: 'Poda ramas y controla plagas' };
  if (phase < 23.99) return { name: 'Cuarto Menguante', icon: '🌗', recommendation: 'Fertiliza y limpia las raíces' };
  return               { name: 'Luna Nueva',             icon: '🌑', recommendation: 'Descansa el suelo y planifica' };
}

const DAILY_TIPS = [
  'Riega en la mañana temprano para que las hojas se sequen durante el día y evitar hongos.',
  'Limpia el polvo de las hojas grandes con un paño húmedo para mejorar la fotosíntesis.',
  'Revisa la parte inferior de las hojas: ahí suelen esconderse plagas como ácaros y cochinillas.',
  'Si la tierra está muy compacta, aflójala con un palito antes de regar para mejorar la absorción.',
  'Las plantas en maceta necesitan drenaje; asegúrate de que el agua salga libremente por los agujeros.',
  'Rota las plantas cada semana para que todos los lados reciban luz por igual y crezcan derechas.',
  'El agua de lluvia recolectada es mejor que la del grifo: no tiene cloro y está a temperatura ambiente.',
  'Poda las flores marchitas para que la planta dirija su energía hacia nuevos brotes.',
  'Agrupa las plantas para crear un microclima más húmedo, beneficioso para especies tropicales.',
  'Un clavo oxidado enterrado cerca de la raíz aporta hierro y mejora el color verde de las hojas.',
  'Si las puntas de las hojas se secan, puede ser exceso de fluoruro en el agua; deja reposar el agua un día antes de regar.',
  'Las macetas de barro son ideales en climas húmedos porque transpiran y evitan el encharcamiento.',
  'Añade cáscara de huevo triturada al sustrato para aportar calcio y mejorar el drenaje.',
  'Observa tus plantas en distintos momentos del día para entender cuánta luz reciben realmente.',
  'En invierno, aleja las plantas de ventanas con corriente de aire frío aunque tengan buena luz.',
  'El poso de café mezclado con el sustrato es un excelente abono para plantas que prefieren suelos ácidos.',
  'Hablarle a tus plantas no es mito: el CO₂ que exhalas estimula levemente su fotosíntesis.',
  'Las raíces que salen por los agujeros de drenaje indican que la planta necesita una maceta más grande.',
  'Evita cambiar de sitio las plantas frecuentemente; cada traslado genera estrés en las hojas.',
  'El musgo en la superficie del sustrato indica exceso de humedad; reduce la frecuencia de riego.',
  'Las hojas amarillas en la base suelen ser naturales; preocúpate si amarillean las hojas jóvenes.',
  'El bicarbonato de sodio diluido en agua actúa como fungicida natural contra el oídio.',
  'Pon una capa de grava sobre el sustrato para retener la humedad y evitar que las moscas de la tierra pongan huevos.',
  'Si vas de viaje, una botella de plástico invertida en el sustrato funciona como riego automático.',
  'Las tijeras de poda deben desinfectarse con alcohol entre plantas para no propagar enfermedades.',
  'El sustrato universal sirve para la mayoría de plantas, pero cactus y suculentas necesitan mezcla arenosa.',
  'Cuando trasplantes, no compactes demasiado la tierra; las raíces necesitan espacio para respirar.',
  'La humedad del ambiente importa tanto como el riego; un humidificador mejora mucho las plantas tropicales.',
  'Las hojas que caen sin razón aparente pueden indicar estrés por cambios bruscos de temperatura.',
  'Fertiliza solo en época de crecimiento (primavera y verano); en invierno la planta descansa.',
  'Una planta bien adaptada a su entorno necesita menos cuidados que una luchando contra sus condiciones.',
];

export function getDailyTip(date = new Date()): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}
