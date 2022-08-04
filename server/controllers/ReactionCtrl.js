const ReactionModel = require('../models/reaction');
const Reaction = require('../classes/Reaction');


function handleError (error) {
  console.log('Mongo error in model "Reaction"!');
  console.log(JSON.stringify(error, null, 3));
}

exports.createReaction = async ({ left, middle, right, theme, kind }) => {
  return await ReactionModel.findOneAndUpdate({ left, middle, right, theme, kind }, { }, { upsert: true })
    .catch((error) => handleError(error));
};

exports.randomReaction = async () => {
  const result = await ReactionModel.aggregate([
    { $sample: { size: 1 } },
  ]).catch((error) => handleError(error));

  if (!result) return null;

  const r = result[0];

  return new Reaction({
    rid: r._id,
    left: r.left,
    middle: r.middle,
    right: r.right,
    theme: r.theme,
    kind: r.kind,
    difficulty: r.difficulty,
    mechanism: r.mechanism,
    qualification: r.qualification,
  });
};

exports.getReactionsWithParams = async (theme, difficulty, count) => {
  const translatedTheme = theme === 'any' ? { $exists: true } : theme;

  const reactions = await ReactionModel.aggregate([
    { $match: { $expr: { $and: [{ $eq: ['$theme', translatedTheme] }, { $lte: ['$difficulty', difficulty] }] } } },
    { $sample: { size: count } },
  ]).catch((error) => handleError(error));

  return reactions.map(r => {
    return new Reaction({
      rid: r._id,
      left: r.left,
      middle: r.middle,
      right: r.right,
      theme: r.theme,
      kind: r.kind,
      difficulty: r.difficulty,
      mechanism: r.mechanism,
      qualification: r.qualification,
    });
  });
};

exports.getReactionWithEmptyField = async (field) => {
  const r = await ReactionModel.findOne({ [field]: { $exists: false } })
    .catch((error) => handleError(error));

  if (!r || !r._id) return null;

  return new Reaction({
    rid: r._id,
    left: r.left,
    middle: r.middle,
    right: r.right,
    theme: r.theme,
    kind: r.kind,
    difficulty: r.difficulty,
    mechanism: r.mechanism,
    qualification: r.qualification,
  });
};

exports.getReactionMeta = async (rId) => {
  const basePath = 'https://orgtasks.storage.yandexcloud.net/';
  const clean = (s) => s.replace(basePath, '');
  const r = await ReactionModel.findOne({ _id: rId })
    .catch((error) => handleError(error));

  return `${clean(r.left)}\n${clean(r.middle)}\n${clean(r.right)}`;
};

exports.setReactionField = async (rId, field, value) => {
  return await ReactionModel.findOneAndUpdate({ _id: rId }, { $set: { [field]: value } }, { new: true })
    .catch((error) => handleError(error));
};

exports.collectThemes = async () => {
  const result = await ReactionModel.aggregate([
    { $group: { _id: null, themes: { $addToSet: '$theme' } } },
  ]).catch((error) => handleError(error));

  if (!result[0] || !result[0].themes || result[0].themes.length === 0) {
    return null;
  }

  return result[0].themes;
};
