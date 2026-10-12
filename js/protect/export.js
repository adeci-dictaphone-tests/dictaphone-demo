// Préparation du texte à copier vers une IA externe (ChatGPT ou autre) : instructions de rédaction + trame + transcription PROTÉGÉE.
// Le texte produit ne contient jamais de table de correspondance, ni les termes originaux masqués, ni le titre de la fiche.
// Rien n'est envoyé par l'application : c'est vous qui collez le texte, après avoir lu l'avertissement.

export const AVERTISSEMENT_COPIE = [
  'Ce texte est pseudonymisé, pas anonyme : montants, produits, situation familiale ou professionnelle peuvent encore permettre de reconnaître une personne.',
  'Relisez-le en entier avant de le coller. L\'application ne peut pas garantir qu\'aucune information identifiante n\'a échappé à la détection.',
  'Vérifiez que votre compte ChatGPT ou l\'outil utilisé n\'entraîne pas ses modèles sur vos conversations (réglages de données, chat temporaire) et que votre entreprise autorise cet usage.',
  'Rien n\'est envoyé par l\'application : le texte est seulement copié dans le presse-papiers. Sur iPhone et Mac, le presse-papiers peut être partagé avec vos autres appareils.',
];

export function instructionsBlock({ dateLabel = '' } = {}) {
  return [
    'Tu es l\'assistant d\'un conseiller en gestion de patrimoine (Family Office). Ci-dessous : la transcription brute d\'un entretien, déjà pseudonymisée, et la trame de la fiche de suivi patrimonial à produire. Ton rôle : extraire les informations utiles et les ranger dans les rubriques patrimoniales de la trame, de façon synthétique, factuelle et professionnelle.',
    '',
    'FORME',
    '- Écris en français, en puces courtes (« - »), une idée par puce, style de notes professionnelles de conseiller : phrases nominales, abréviations courantes acceptées (AV, PEA, PER, PEE, PERCOL, SCPI, CTO, TMI).',
    '- Pas de tableau, pas de gras, pas de longs paragraphes : uniquement des titres et des listes à puces, faciles à recopier.',
    `- Écris chaque titre de rubrique seul sur sa ligne, exactement comme dans la trame, suivi de deux-points (« Patrimoine : », « Financier : »…), sans numéro ni symbole Markdown. Place les sous-rubriques sous leur rubrique, dans l'ordre de la trame.${dateLabel ? ` Commence la fiche par la ligne « Maj du ${dateLabel} ».` : ''}`,
    '- Adapte-toi au contenu réel : n\'écris que les rubriques et sous-rubriques pour lesquelles la transcription apporte une information. N\'écris pas de longues listes « Non évoqué » ; une rubrique sans information peut être omise ou laissée vide.',
    '- Sois synthétique : pas de répétitions, pas de récit chronologique de l\'entretien, pas de formules de politesse, pas de détails sans intérêt patrimonial.',
    '',
    'FIDÉLITÉ',
    '- N\'utilise que ce qui figure dans la transcription. N\'invente aucun montant, date, taux, valorisation, nom, produit, décision, conseil ni recommandation.',
    '- Conserve exactement les montants, dates, taux, valorisations, échéances et noms de produits ou de sociétés financières cités (PEA, assurance-vie, fonds, SCPI, etc.).',
    '- Conserve les nuances d\'incertitude (environ, à confirmer, envisagé, prévu, en attente). Signale brièvement par « à confirmer » les seuls points importants qui paraissent incertains, contradictoires ou incomplets.',
    '- Distingue clairement : les besoins exprimés, les intérêts ou pistes évoquées (non décidées), les décisions prises et les actions à réaliser (avec responsable et échéance seulement s\'ils sont dits). Ne transforme jamais une piste ou une idée en décision, ni une information descriptive en action.',
    '',
    'TRANSCRIPTION SANS IDENTIFICATION DES INTERVENANTS',
    '- La transcription est brute (dictée automatique) : ponctuation imparfaite, erreurs de dictée, phrases incomplètes, interlocuteurs non identifiés. N\'invente pas qui parle.',
    '- Quand l\'attribution est incertaine, utilise une formulation neutre (« Il est indiqué que… », « Un placement de… », « Le foyer détient… ») plutôt que d\'attribuer arbitrairement un placement, un revenu ou une décision à une personne.',
    '- Garde les faits certains même si leur auteur est incertain. Si l\'incertitude est importante, ajoute « à confirmer ».',
    '',
    'PSEUDONYMES',
    '- Les étiquettes comme « Client A », « Personne B », « Entreprise A » ou « Ville A » remplacent des informations masquées. Ne cherche jamais à deviner ni à reconstituer les identités réelles.',
    '- Ne répète pas ces étiquettes mécaniquement : préfère « le foyer », « le couple », « le client », « l\'un des conjoints », « le PEA », « le contrat d\'assurance-vie », « le portefeuille ». N\'utilise une étiquette que lorsqu\'il faut distinguer les titulaires ou les personnes concernées.',
    '- Ne supprime pas une information patrimoniale au motif qu\'elle est liée à une personne ou à une société pseudonymisée : garde-la, avec l\'étiquette si nécessaire.',
  ].join('\n');
}

// Trame hiérarchique : 1. Rubrique / 1.1 Sous-rubrique (section.level === 2).
export function trameBlock(template) {
  let n = 0, sub = 0;
  const lines = (template.sections || []).map((s) => {
    let num;
    if (s.level === 2 && n > 0) num = `   ${n}.${++sub}`; else { n++; sub = 0; num = `${n}.`; }
    return `${num} ${s.title}${s.instruction ? ' — ' + s.instruction : ''}`;
  });
  return ['TRAME DE LA FICHE : ' + template.name, ...lines].join('\n');
}

// Date au format AAMMJJ (ex. 7 octobre 2026 → 261007), pour la ligne « Maj du … ».
export function dateAAMMJJ(ms) {
  if (!Number.isFinite(ms)) return '';
  const d = new Date(ms);
  return String(d.getFullYear() % 100).padStart(2, '0') + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
}

export function buildPrompt({ template, categoryLabel = '', protectedText, dateMs = null }) {
  return [
    instructionsBlock({ dateLabel: dateMs ? dateAAMMJJ(dateMs) : '' }), '',
    trameBlock(template), '',
    'TYPE D\'ENTRETIEN : ' + (categoryLabel || 'non précisé'), '',
    'TRANSCRIPTION PSEUDONYMISÉE',
    '"""',
    protectedText.trim(),
    '"""',
  ].join('\n');
}
