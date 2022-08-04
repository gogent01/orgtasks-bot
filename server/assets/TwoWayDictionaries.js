class TwoWayDictionary {
  themeNames;
  difficultyNames;

  constructor() {
    this.themeAbbrs = this.flip(this.themeNames);
    this.difficultyAbbrs = this.flip(this.difficultyNames);
  }

  flip(obj) {
    return Object.keys(obj).reduce((revObj, key) => {
      revObj[obj[key]] = key;
      return revObj;
    }, {});
  }

  getThemeNames() { return Object.values(this.themeNames); }
  themeAbbrToName(abbr) { return this.themeNames[abbr]; }
  themeNameToAbbr(name) { return this.themeAbbrs[name]; }

  difficultyAbbrToName(abbr) { return this.difficultyNames[abbr]; }
  difficultyNameToAbbr(name) { return this.difficultyAbbrs[name]; }
}

class RussianTwoWayDictionary extends TwoWayDictionary {
  themeNames = {
    ans: 'Алканы',
    ens: 'Алкены',
    clk: 'Циклоалканы',
    dns: 'Алкадиены',
    ins: 'Алкины',
    arn: 'Арены',
    hal: 'Галогенуглеводороды',
    spi: 'Спирты',
    phe: 'Фенолы',
    oxo: 'Карбонильные соединения',
    aci: 'Карбоновые кислоты',
    drv: 'Производные кислот',
    htaci: 'Гетерокислоты',
    amn: 'Амины',
    tio: 'Соединения серы',
    cbh: 'Углеводы',
    lpd: 'Липиды',
    ptn: 'Белки',
    nca: 'Нуклеиновые кислоты',
    htc: 'Гетероциклы',
    any: 'Все темы',
  };

  difficultyNames = {
    0: 'ЕГЭ',
    1: 'ДВИ',
    2: 'Олимпиады',
  };

  constructor() {
    super();
  }
}


module.exports = {
  Russian: RussianTwoWayDictionary,
};
