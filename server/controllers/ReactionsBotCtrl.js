require('dotenv').config({ path: '/home/george/serv/fc-api/server/.env' });
const { Telegraf } = require('telegraf');
const ReactionCtrl = require('../controllers/ReactionCtrl');
const Session = require('../controllers/SessionCtrl');
const Presentations = require('../classes/Presentation');
const ImageStorage = require('../classes/ImageStorage');
const Keyboard = require('../assets/Keyboard');
const Locales = require('../assets/Locales');
const TwoWayDictionaries = require('../assets/TwoWayDictionaries');

const K = new Keyboard();
const P = new Locales.Russian();
const D = new TwoWayDictionaries.Russian();
const bot = new Telegraf(process.env.TELEGRAM_API_KEY_REACTIONS);


bot.use(async (ctx, next) => {
  ctx.state = await Session.getState(ctx.from.id);
  ctx.clearState = function () { this.state = {}; };
  await next();
  await Session.setState(ctx.from.id, ctx.state);
});

bot.catch(err => console.log(err));


bot.start(async (ctx) => {
  return ctx.reply(P.GREETING);
});


bot.on('text', async (ctx) => {
  const S = ctx.state;

  if (ctx.message.text === P.BUTTON_RESET) {
    ctx.clearState();
    return ctx.reply(P.BOT_RESET, K.defaultKeyboard);
  }


  if (ctx.message.text === P.BUTTON_CREATE_TEST) {
    const themes = await ReactionCtrl.collectThemes();
    if (!themes) return ctx.reply(P.NO_THEMES_FOUND);

    S.creatingTest = true;

    const titles = themes.map(t => D.themeAbbrToName(t));

    return ctx.reply(P.WHICH_THEME, K.paginatedKeyboard(titles, 2, { sort: true }));
  }

  if (S.creatingTest) {
    const test = S.test || {};
    if (!test.theme) {
      const theme = D.themeNameToAbbr(ctx.message.text);
      if (!theme) return ctx.reply(P.INCORRECT_THEME_NAME);

      test.theme = theme;
      S.test = test;

      return ctx.reply(P.WHICH_DIFFICULTY, K.difficultyKeyboard);
    } else if (!test.difficulty) {
      const difficulty = D.difficultyNameToAbbr(ctx.message.text);
      if (!difficulty) return ctx.reply(P.INCORRECT_DIFFICULTY_NAME);

      test.difficulty = difficulty;
      S.test = test;

      return ctx.reply(P.WHICH_REACTION_COUNT, K.noKeyboard);
    } else if (!test.size) {
      const size = parseInt(ctx.message.text, 10);
      if (!size) return ctx.reply(P.NOT_A_NUMBER);
      if (size % 4 !== 0) return ctx.reply(P.NUMBER_NOT_MULTIPLE_OF_4);

      test.size = size;

      const reactions = await ReactionCtrl.getReactionsWithParams(test.theme, test.difficulty, test.size);
      const hp = new Presentations.HomeworkPresentation(ctx, test.theme, reactions);
      await hp.sendAsPDFDocument();

      return ctx.clearState();
    }
  }


  if (ctx.message.text === P.BUTTON_RANDOM_REACTION) {
    const reaction = await ReactionCtrl.randomReaction();
    reaction.hideRandomSide();

    const sip = new Presentations.SingleImagePresentation(ctx, reaction);
    return sip.sendAsImage();
  }


  if (ctx.message.text === P.BUTTON_TAG_DIFFICULTY) {
    const reaction = await ReactionCtrl.getReactionWithEmptyField('difficulty');
    if (!reaction) return ctx.reply(P.NO_UNTAGGED_DIFFICULTIES, K.defaultKeyboard);

    S.settingDifficulty = true;
    S.reactionId = reaction.rid;
    await ctx.reply(P.PLEASE_TAG_DIFFICULTY, K.difficultyTaggingKeyboard);

    const sip = new Presentations.SingleImagePresentation(ctx, reaction);
    return sip.sendAsImage();
  }

  if (S.settingDifficulty) {
    if (ctx.message.text === P.BUTTON_REACTION_METADATA)
      return ctx.reply(await ReactionCtrl.getReactionMeta(S.reactionId));

    const difficulty = D.difficultyNameToAbbr(ctx.message.text);

    if (!difficulty)
      return ctx.reply(P.INCORRECT_DIFFICULTY_NAME);

    await ReactionCtrl.setReactionField(S.reactionId, 'difficulty', difficulty);

    const reaction = await ReactionCtrl.getReactionWithEmptyField('difficulty');
    if (!reaction) {
      ctx.clearState();
      return ctx.reply(P.NO_UNTAGGED_DIFFICULTIES, K.defaultKeyboard);
    }

    S.reactionId = reaction.rid;

    const sip = new Presentations.SingleImagePresentation(ctx, reaction);
    return sip.sendAsImage();
  }


  if (ctx.message.text === P.BUTTON_TAG_MECHANISM) {
    const reaction = await ReactionCtrl.getReactionWithEmptyField('mechanism');
    if (!reaction) return ctx.reply(P.NO_UNTAGGED_MECHANISMS, K.defaultKeyboard);

    S.settingMechanism = true;
    S.reactionId = reaction.rid;
    await ctx.reply(P.PLEASE_TAG_MECHANISM, K.mechanismTaggingKeyboard);

    const sip = new Presentations.SingleImagePresentation(ctx, reaction);
    return sip.sendAsImage();
  }

  if (S.settingMechanism) {
    const mechanism = ctx.message.text;

    await ReactionCtrl.setReactionField(S.reactionId, 'mechanism', mechanism);

    const reaction = await ReactionCtrl.getReactionWithEmptyField('mechanism');
    if (!reaction) {
      ctx.clearState();
      return ctx.reply(P.NO_UNTAGGED_MECHANISMS, K.defaultKeyboard);
    }

    S.reactionId = reaction.rid;

    const sip = new Presentations.SingleImagePresentation(ctx, reaction);
    return sip.sendAsImage();
  }


  if (ctx.message.text === P.BUTTON_TAG_QUALIFICATION) {
    const reaction = await ReactionCtrl.getReactionWithEmptyField('qualification');
    if (!reaction) return ctx.reply(P.NO_UNTAGGED_QUALIFICATIONS, K.defaultKeyboard);

    S.settingQualification = true;
    S.reactionId = reaction.rid;
    await ctx.reply(P.PLEASE_TAG_QUALIFICATION, K.noKeyboard);

    const sip = new Presentations.SingleImagePresentation(ctx, reaction);
    return sip.sendAsImage();
  }

  if (S.settingQualification) {
    const qualification = ctx.message.text;

    await ReactionCtrl.setReactionField(S.reactionId, 'qualification', qualification);

    const reaction = await ReactionCtrl.getReactionWithEmptyField('qualification');
    if (!reaction) {
      ctx.clearState();
      return ctx.reply(P.NO_UNTAGGED_QUALIFICATIONS, K.defaultKeyboard);
    }

    S.reactionId = reaction.rid;

    const sip = new Presentations.SingleImagePresentation(ctx, reaction);
    return sip.sendAsImage();
  }


  if (ctx.message.text === P.BUTTON_ADD_REACTIONS) {
    const titles = D.getThemeNames();

    S.addingReactions = true;

    return ctx.reply(P.WHICH_THEME, K.paginatedKeyboard(titles, 2, { sort: true }));
  }

  if (S.addingReactions) {
    const theme = D.themeNameToAbbr(ctx.message.text);
    if (!theme) return ctx.reply(P.INCORRECT_THEME_NAME);

    await ctx.reply(P.ADDING_REACTIONS, K.noKeyboard);

    for (const kind of ['get', 'feats']) {
      const storage = new ImageStorage();
      const files = await storage.getOrderedImagePaths(theme, kind);

      for (let i = 0; i < files.length; i += 3) {
        await ReactionCtrl.createReaction({
          left: files[i],
          middle: files[i + 1],
          right: files[i + 2],
          theme,
          kind,
        });
      }
    }
    await ctx.reply(P.REACTIONS_ADDED_SUCCESSFULLY, K.defaultKeyboard);

    return ctx.clearState();
  }
});

bot.launch();
