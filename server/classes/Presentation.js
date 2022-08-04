const jimp = require('jimp');
const mimg = require('merge-img');
const tmp = require('tmp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Keyboard = require('../assets/Keyboard');
const Locales = require('../assets/Locales');
const TwoWayDictionaries = require('../assets/TwoWayDictionaries');

const K = new Keyboard();
const P = new Locales.Russian();
const D = new TwoWayDictionaries.Russian();

class Presentation {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async sendAsImage() {}

  async sendAsPDFDocument() {}
}

class SingleImagePresentation extends Presentation {
  constructor(ctx, reaction) {
    super(ctx);
    this.reaction = reaction;
    this.file = undefined;
  }

  async sendAsImage() {
    const file = await this.prepareImageFile();

    await this.ctx.replyWithPhoto({ source: file.name });

    this.deleteImageFile();

    return true;
  }

  async prepareImageFile() {
    this.createEmptyImageFile();
    const image = await this.createImage(this.reaction);
    await (this.burnImage(image));
    return this.file;
  }

  createEmptyImageFile() {
    this.file = tmp.fileSync({ postfix: '.png' });
    return this.file;
  }

  async createImage(reaction) {
    const left = await jimp.read(reaction.left);
    const middle = await jimp.read(reaction.middle);
    const right = await jimp.read(reaction.right);

    const mimgConfig = {
      align: 'center',
      offset: 150,
      margin: 50,
      color: parseInt('FFFFFFFF', 16),
    }

    return mimg([left, middle, right], mimgConfig);
  }

  async burnImage(image) {
    const file = this.file;
    return new Promise(resolve => { image.write(file.name, () => { resolve() }); });
  }

  deleteImageFile() {
    return this.file.removeCallback();
  }
}


class HomeworkPresentation extends Presentation {
  constructor(ctx, theme, reactions) {
    super(ctx);
    this.theme = theme;
    this.reactions = reactions;
    this.count = this.reactions.length;
    this.tasks = undefined;
    this.answers = undefined;
    this.progress = 0;
  }

  async sendAsPDFDocument() {
    await this.createPDFFiles();
    await this.writeReactions();

    await this.ctx.replyWithDocument({ source: this.tasks.file.name });
    await this.ctx.replyWithDocument({ source: this.answers.file.name }, K.defaultKeyboard);

    this.deletePDFFiles();
  }

  async createPDFFiles() {
    await this.ctx.reply(P.CREATING_TEST);
    const reactionsPerPage = this.count / 4;
    this.tasks = new HomeworkPDFFile(P.TASKS_FILENAME(D.themeAbbrToName(this.theme)), reactionsPerPage);
    this.answers = new HomeworkPDFFile(P.ANSWERS_FILENAME(D.themeAbbrToName(this.theme)), reactionsPerPage);
  }

  async writeReactions() {
    for (let i = 0; i < this.count; i++) {
      this.updateProgressWithValue(i);
      await this.announceProgress();

      const reaction = this.reactions[i];

      const sip = new SingleImagePresentation(this.ctx, reaction);

      let imageFile = await sip.prepareImageFile();
      this.answers.addReaction(imageFile);
      sip.deleteImageFile();

      if (this.progress < 0.25) reaction.hideRightSide();
      else if (this.progress < 0.5) reaction.hideMiddleSide();
      else if (this.progress < 0.75) reaction.hideLeftSide();
      else reaction.hideRandomSide();

      imageFile = await sip.prepareImageFile();
      this.tasks.addReaction(imageFile);
      sip.deleteImageFile();
    }

    await this.delay(1000);

    this.tasks.end();
    this.answers.end();
  }

  updateProgressWithValue(value) {
    this.progress = value / this.count;
  }

  async announceProgress() {
    if ([0.25, 0.5, 0.75, 1].includes(this.progress)) {
      await this.ctx.reply(P.CURRENT_PROGRESS(this.progress));
    }
  }

  delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  deletePDFFiles() {
    this.tasks.deletePDFFile();
    this.answers.deletePDFFile();
  }
}


class HomeworkPDFFile {
  rwidth = 400;
  rheight = 80;
  voffset = 20;
  loffset = 40;

  constructor(name, reactionsPerPage) {
    this.name = name;
    this.reactionsPerPage = reactionsPerPage;
    this.document = new PDFDocument({ autoFirstPage: false });
    this.counter = 0;

    this.file = tmp.fileSync({ name: this.name });
    this.document.pipe(fs.createWriteStream(this.file.name));
    this.addPage();
  }

  addReaction(imageFile) {
    if (this.counter === this.reactionsPerPage) {
      this.addPage();
      this.resetCounter();
    }
    this.addReactionNumber();
    this.addReactionImage(imageFile);
    this.incrementCounter(1);
  }

  addPage() {
    return this.document.addPage({
      size: [this.rwidth + this.loffset, (this.rheight + this.voffset) * this.reactionsPerPage],
      margin: 0,
    });
  }

  resetCounter() {
    this.counter = 0;
  }

  incrementCounter(val) {
    this.counter += val;
  }

  addReactionNumber() {
    this.document.text(`${this.counter + 1})`, this.loffset/2 - 2, this.posy() + this.rheight/2);
  }

  addReactionImage(imageFile) {
    this.document.image(imageFile.name, this.loffset, this.posy(), { fit: [this.rwidth, this.rheight] });
  }

  posy() {
    return (this.rheight + this.voffset) * this.counter;
  }

  end() {
    this.document.end();
  }

  deletePDFFile() {
    this.file.removeCallback();
  }
}


module.exports = {
  SingleImagePresentation: SingleImagePresentation,
  HomeworkPresentation: HomeworkPresentation,
};
