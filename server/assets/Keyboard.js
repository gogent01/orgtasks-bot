const Locales = require('../assets/Locales');
const P = new Locales.Russian();

class Keyboard {
  noKeyboard = { reply_markup: { remove_keyboard: true } };
  defaultKeyboard = { reply_markup: { keyboard : [
        [ { text: P.BUTTON_CREATE_TEST } ],
        [ { text: P.BUTTON_RANDOM_REACTION } ],
        [ { text: P.BUTTON_TAG_DIFFICULTY } ],
        [ { text: P.BUTTON_TAG_MECHANISM } ],
        [ { text: P.BUTTON_TAG_QUALIFICATION } ],
        [ { text: P.BUTTON_ADD_REACTIONS } ],
      ] } };
  difficultyKeyboard = { reply_markup: { keyboard : [
        [ { text: P.BUTTON_EGE } ],
        [ { text: P.BUTTON_DVI } ],
        [ { text: P.BUTTON_OLYMPIAD } ],
      ] } };
  difficultyTaggingKeyboard = { reply_markup: { keyboard : [
        [ { text: P.BUTTON_REACTION_METADATA } ],
        [ { text: P.BUTTON_EGE } ],
        [ { text: P.BUTTON_DVI } ],
        [ { text: P.BUTTON_OLYMPIAD } ],
      ] } };
  mechanismTaggingKeyboard = { reply_markup: { keyboard : [
        [ { text: 'Sr' }, { text: 'Se' }, { text: 'Sn' } ],
        [ { text: 'Ar' }, { text: 'Ae' }, { text: 'An' } ],
        [ { text: 'SnAc' }, { text: 'Re' }, { text: 'Ox' } ],
        [ { text: 'RA' }, { text: 'CA' }, { text: 'E' } ],
        [ { text: 'DC' }, { text: 'other' } ],
      ] } };

  constructor() {}

  paginatedKeyboard(buttons, buttonsPerRow, { sort = false }) {
    const b = sort ? buttons.sort((a,b) => a.localeCompare(b)) : buttons;

    const rows = b.reduce((acc, val, i) => {
      const idx = Math.floor(i / buttonsPerRow);
      const page = acc[idx] || (acc[idx] = []);
      page.push(val.toString());

      return acc;
    }, []);

    return { reply_markup: { keyboard: rows, resize_keyboard: true } };
  }
}

module.exports = Keyboard;
