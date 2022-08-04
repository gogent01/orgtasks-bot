class Locale {
  GREETING;
  BOT_RESET;
  NO_UNTAGGED_DIFFICULTIES;
  NO_UNTAGGED_MECHANISMS;
  NO_UNTAGGED_QUALIFICATIONS;
  PLEASE_TAG_DIFFICULTY;
  PLEASE_TAG_MECHANISM;
  PLEASE_TAG_QUALIFICATION;
  NO_THEMES_FOUND;
  WHICH_THEME;
  INCORRECT_THEME_NAME;
  WHICH_DIFFICULTY;
  INCORRECT_DIFFICULTY_NAME;
  WHICH_REACTION_COUNT;
  NOT_A_NUMBER;
  NUMBER_NOT_MULTIPLE_OF_4;
  CREATING_TEST;
  ADDING_REACTIONS;
  REACTIONS_ADDED_SUCCESSFULLY;
  BUTTON_RESET;
  BUTTON_CREATE_TEST;
  BUTTON_RANDOM_REACTION;
  BUTTON_TAG_DIFFICULTY;
  BUTTON_TAG_MECHANISM;
  BUTTON_TAG_QUALIFICATION;
  BUTTON_ADD_REACTIONS;
  BUTTON_EGE;
  BUTTON_DVI;
  BUTTON_OLYMPIAD;
  BUTTON_REACTION_METADATA;

  constructor() {}

  CURRENT_PROGRESS() {}
  TASKS_FILENAME() {}
  ANSWERS_FILENAME() {}
}

class RussianLocale extends Locale {
  GREETING = 'Здравствуйте! Я — бот для создания наборов реакций органической химии для проверки знаний учащихся. Для составления домашней работы из случайных реакций по нужной теме нажмите "Составить вариант".';
  BOT_RESET = 'Бот перезагружен!';
  NO_UNTAGGED_DIFFICULTIES = 'Пока больше нет реакций без размеченной сложности!';
  NO_UNTAGGED_MECHANISMS = 'Пока больше нет реакций без размеченного механизма!';
  NO_UNTAGGED_QUALIFICATIONS = 'Пока больше нет реакций без размеченного типа!';
  PLEASE_TAG_DIFFICULTY = 'Определите уровень сложности следующих реакций:';
  PLEASE_TAG_MECHANISM = 'Укажите механизм следующих реакций:';
  PLEASE_TAG_QUALIFICATION = 'Укажите тип для следующих реакций:';
  NO_THEMES_FOUND = 'Не найдено тем, по которым бы можно было создать вариант!';
  WHICH_THEME = 'По какой теме?';
  INCORRECT_THEME_NAME = 'Темы с таким названием не существует! Выберите название темы из списка на клавиатуре.';
  WHICH_DIFFICULTY = 'Каким будет максимальный уровень сложности реакций?';
  INCORRECT_DIFFICULTY_NAME = 'Неверное название уровня сложности! Пожалуйста, выберите между вариантами, представленными на клавиатуре.';
  WHICH_REACTION_COUNT = 'Сколько реакций будет в варианте? (введите число, кратное 4).';
  NOT_A_NUMBER = 'Пожалуйста, введите число.';
  NUMBER_NOT_MULTIPLE_OF_4 = 'Пожалуйста, введите число кратное 4.';
  CREATING_TEST = 'Создаю вариант...';
  ADDING_REACTIONS = 'Добавляю реакции...';
  REACTIONS_ADDED_SUCCESSFULLY = 'Реакции добавлены успешно!';
  BUTTON_RESET = '🔁';
  BUTTON_CREATE_TEST = 'Создать вариант';
  BUTTON_RANDOM_REACTION = 'Случайная реакция';
  BUTTON_TAG_DIFFICULTY = 'Разметить сложность';
  BUTTON_TAG_MECHANISM = 'Разметить механизмы';
  BUTTON_TAG_QUALIFICATION = 'Разметить детали реакций';
  BUTTON_ADD_REACTIONS = 'Добавить реакции';
  BUTTON_EGE = 'ЕГЭ';
  BUTTON_DVI = 'ДВИ';
  BUTTON_OLYMPIAD = 'Олимпиады';
  BUTTON_REACTION_METADATA = 'Метаданные реакции';

  constructor() { super(); }

  CURRENT_PROGRESS(progress) { return `Готово на ${progress * 100}%!`; };
  TASKS_FILENAME(theme) { return `${theme}_задания.pdf`; };
  ANSWERS_FILENAME(theme) { return `${theme}_ответы.pdf`; };
}

module.exports = {
  Russian: RussianLocale,
};
