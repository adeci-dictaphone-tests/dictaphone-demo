// Préparation du texte à copier vers une IA externe (ChatGPT ou autre) : instructions de rédaction + trame + transcription PROTÉGÉE.
// Le texte produit ne contient jamais de table de correspondance, ni les termes originaux masqués, ni le titre de la fiche.
// Rien n'est envoyé par l'application : c'est vous qui collez le texte, après avoir lu l'avertissement.

export const AVERTISSEMENT_COPIE = [
  'Ce texte est pseudonymisé, pas anonyme : montants, produits, situation familiale ou professionnelle peuvent encore permettre de reconnaître une personne.',
  'Relisez-le en entier avant de le coller. L\'application ne peut pas garantir qu\'aucune information identifiante n\'a échappé à la détection.',
  'Vérifiez que votre compte ChatGPT ou l\'outil utilisé n\'entraîne pas ses modèles sur vos conversations (réglages de données, chat temporaire) et que votre entreprise autorise cet usage.',
  'Rien n\'est envoyé par l\'application : le texte est seulement copié dans le presse-papiers. Sur iPhone et Mac, le presse-papiers peut être partagé avec vos autres appareils.',
];

export function instructionsBlock() {
  return [
    'Tu es l\'assistant rédactionnel d\'un cabinet de gestion de patrimoine (Family Office). Ci-dessous : la transcription d\'un entretien, déjà pseudonymisée, et la trame du compte rendu à produire.',
    '',
    'RÈGLES',
    '- N\'utilise que les informations de la transcription. N\'invente aucun montant, date, taux, nom, produit, décision ni conseil. Si une information manque, écris « Non évoqué ».',
    '- Conserve exactement les montants, dates, taux, établissements et produits cités.',
    '- Conserve les expressions d\'incertitude (environ, à confirmer, envisagé, prévu, en attente).',
    '- Distingue : les faits, les hypothèses ou pistes évoquées (non décidées), les décisions validées, les actions à réaliser (avec le responsable et l\'échéance seulement s\'ils sont dits explicitement) et les points de suivi.',
    '- Ne transforme pas une piste en recommandation validée. Ne classe pas une simple information descriptive dans les actions.',
    '- Sois synthétique : listes structurées, pas de répétitions, pas de récit chronologique, pas de phrases de remplissage ni de détails sans intérêt patrimonial.',
    '- Les étiquettes comme « Client A », « Cliente A », « Personne B », « Entreprise A » ou « Ville A » remplacent des informations masquées : reprends-les telles quelles et ne cherche pas à deviner ce qu\'elles désignent.',
    '- Écris en français. Utilise exactement les titres de rubriques de la trame, dans cet ordre.',
  ].join('\n');
}

export function trameBlock(template) {
  const lines = (template.sections || []).map((s, i) => `${i + 1}. ${s.title}${s.instruction ? ' — ' + s.instruction : ''}`);
  return ['TRAME DU COMPTE RENDU : ' + template.name, ...lines].join('\n');
}

export function buildPrompt({ template, categoryLabel = '', protectedText }) {
  return [
    instructionsBlock(), '',
    trameBlock(template), '',
    'TYPE D\'ENTRETIEN : ' + (categoryLabel || 'non précisé'), '',
    'TRANSCRIPTION PSEUDONYMISÉE',
    '"""',
    protectedText.trim(),
    '"""',
  ].join('\n');
}
